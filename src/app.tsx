import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link, useModel } from '@umijs/max';
import { App } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { bindAntdApis } from '@/utils/antdStaticApi';

// Initialize dayjs plugins globally
dayjs.extend(relativeTime);

import {
  AvatarDropdown,
  ErrorBoundary,
  Footer,
  LangDropdown,
  OfflineBanner,
  ThemeDropdown,
} from '@/components';
import { getSysUserInfo } from '@/services/auth';
import { getSystemNavTheme } from '@/utils/theme';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const THEME_PREF_KEY = 'snack-theme-preference';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  themePreference?: 'auto' | 'light' | 'realDark';
  currentUser?: API.CurrentUser;
  changePasswordRequired?: boolean;
  hasNetworkError?: boolean;
  loading?: boolean;
  fetchUserInfo?: () => Promise<{
    currentUser: API.CurrentUser | undefined;
    changePasswordRequired: boolean;
    hasNetworkError?: boolean;
  }>;
}> {
  let themePref: 'auto' | 'light' | 'realDark' = 'auto';
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_PREF_KEY);
    if (saved === 'light' || saved === 'realDark' || saved === 'auto') {
      themePref = saved;
    }
  }

  const initialNavTheme =
    themePref === 'auto' ? getSystemNavTheme() : themePref;

  const initialSettings = {
    ...defaultSettings,
    navTheme: initialNavTheme,
  } as Partial<LayoutSettings>;

  const fetchUserInfo = async () => {
    try {
      const sysUserRes = await getSysUserInfo({
        skipErrorHandler: true,
      });
      const profile = sysUserRes?.data;
      if (profile) {
        return {
          currentUser: profile,
          changePasswordRequired: false,
          hasNetworkError: false,
        };
      }
    } catch (error: any) {
      const loginUrl = error.response?.data?.data?.loginUrl;
      if (loginUrl) {
        window.location.href = loginUrl;
        return {
          currentUser: undefined,
          changePasswordRequired: false,
          hasNetworkError: false,
        };
      }

      // 如果是底层的网络超时/服务器故障/断网等错误，只标记 hasNetworkError 为 true 且不强转重定向
      const isNetworkError =
        error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout') ||
        !error.response ||
        error.response.status >= 500 ||
        (typeof navigator !== 'undefined' && !navigator.onLine);

      if (!isNetworkError && error.response?.status === 401) {
        const { pathname, search, hash } = history.location;
        history.replace(
          `${loginPath}?redirect=${encodeURIComponent(pathname + search + hash)}`,
        );
      }

      return {
        currentUser: undefined,
        changePasswordRequired: false,
        hasNetworkError: isNetworkError,
      };
    }
    return {
      currentUser: undefined,
      changePasswordRequired: false,
      hasNetworkError: false,
    };
  };
  const { location } = history;
  if (![loginPath, '/account/change-password'].includes(location.pathname)) {
    const { currentUser, changePasswordRequired, hasNetworkError } =
      await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      changePasswordRequired,
      hasNetworkError,
      settings: initialSettings,
      themePreference: themePref,
    };
  }
  return {
    fetchUserInfo,
    settings: initialSettings,
    themePreference: themePref,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    menuItemRender: (item, dom) => {
      if (item.path) {
        return (
          <Link to={item.path} prefetch>
            {dom}
          </Link>
        );
      }
      return dom;
    },
    actionsRender: () => [
      <ThemeDropdown key="theme" />,
      <LangDropdown key="lang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title:
        initialState?.currentUser?.nickname ||
        initialState?.currentUser?.username,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    footerRender: () => (isDev ? <Footer /> : false),
    onPageChange: () => {
      const { location } = history;
      if (
        !initialState?.currentUser &&
        !initialState?.hasNetworkError &&
        location.pathname !== loginPath
      ) {
        history.replace(
          `${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`,
        );
        return;
      }
      if (
        initialState?.changePasswordRequired &&
        location.pathname !== '/account/change-password'
      ) {
        history.replace('/account/change-password');
      }
      if (
        initialState?.currentUser &&
        !initialState?.changePasswordRequired &&
        location.pathname === '/account/change-password'
      ) {
        history.replace('/');
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    // Replace ProLayout's default ErrorBoundary with our offline-aware version,
    // so chunk load errors show friendly messages instead of "Something went wrong."
    ErrorBoundary,
    childrenRender: (children) => {
      return (
        <>
          <AntdApiBinder />
          <ThemeWatcher />
          {children}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  baseURL: '',
  timeout: 10000,
  ...errorConfig,
};

function ThemeWatcher() {
  const { initialState, setInitialState } = useModel('@@initialState');

  React.useEffect(() => {
    if (!initialState) return;
    const pref = initialState.themePreference || 'auto';
    if (pref !== 'auto') return;

    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const nextTheme = e.matches ? 'realDark' : 'light';
      setInitialState((s) => {
        if (!s) return s;
        if (s.themePreference === 'auto') {
          return {
            ...s,
            settings: {
              ...s.settings,
              navTheme: nextTheme,
            },
          };
        }
        return s;
      });
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [initialState?.themePreference, setInitialState]);

  return null;
}

function AntdApiBinder() {
  const { message, notification } = App.useApp();
  React.useEffect(() => {
    bindAntdApis(message, notification);
  }, [message, notification]);
  return null;
}

export function rootContainer(container: React.ReactNode) {
  return (
    <>
      <OfflineBanner />
      <ErrorBoundary>{container}</ErrorBoundary>
    </>
  );
}
