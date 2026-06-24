import { history, useModel } from '@umijs/max';
import { Skeleton, Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const lazyCache = new Map<string, React.LazyExoticComponent<any>>();

function PageSkeleton() {
  return <Skeleton active style={{ padding: 24 }} />;
}

function getLazy(componentPath: string): React.LazyExoticComponent<any> {
  if (!lazyCache.has(componentPath)) {
    const path = componentPath.replace(/^\.\//, '');
    lazyCache.set(
      componentPath,
      React.lazy(() => import(`@/pages/${path}`)),
    );
  }
  return lazyCache.get(componentPath)!;
}

const DynamicPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { pathname } = useLocation();
  const resources = initialState?.menuResources ?? [];

  const resource = useMemo(
    () => resources.find((r) => r.type === 0 && r.path === pathname),
    [resources, pathname],
  );

  useEffect(() => {
    if (!initialState?.currentUser) return;
    if (resource !== undefined) return;
    if (pathname === '/') return;
    history.replace('/exception/403');
  }, [pathname, resource, initialState?.currentUser]);

  if (!initialState?.currentUser) return <Spin />;

  if (!resource?.component) return null;

  const Component = getLazy(resource.component);

  return (
    <React.Suspense fallback={<PageSkeleton />}>
      <Component />
    </React.Suspense>
  );
};

export default DynamicPage;
