import { GridContent } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Menu, Spin } from 'antd';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getSysUserInfo } from '@/services/auth';
import BaseView from './components/base';
import SecurityView from './components/security';
import useStyles from './style.style';

type SettingsStateKeys = 'base' | 'security';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const SettingsContent: React.FC<{ selectKey: SettingsStateKeys }> = ({
  selectKey,
}) => {
  switch (selectKey) {
    case 'base':
      return <BaseView />;
    case 'security':
      return <SecurityView />;
    default:
      return null;
  }
};

const Settings: React.FC = () => {
  const { styles } = useStyles();
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [loading, setLoading] = useState(true);

  const menuMap: Record<string, React.ReactNode> = {
    base: intl.formatMessage({ id: 'pages.settings.text.menuBase' }),
    security: intl.formatMessage({ id: 'pages.settings.text.menuSecurity' }),
  };
  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef<HTMLDivElement>(null);

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig((prev) => ({
        ...prev,
        mode: mode as SettingsState['mode'],
      }));
    });
  };

  const resizeRef = useRef(resize);
  resizeRef.current = resize;

  useLayoutEffect(() => {
    const handler = () => resizeRef.current();
    window.addEventListener('resize', handler);
    handler();
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestUserInfo = async () => {
      try {
        setLoading(true);
        const res = await getSysUserInfo();
        if (res?.data && isMounted) {
          await setInitialState((s) => {
            if (!s) return s;
            return {
              ...s,
              currentUser: res.data,
            };
          });
        }
      } catch (e) {
        console.error('Failed to fetch latest user info in settings page', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    void fetchLatestUserInfo();
    return () => {
      isMounted = false;
    };
  }, [setInitialState]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => ({
      key: item,
      label: menuMap[item],
    }));
  };

  return (
    <GridContent>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 320,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              dom.current = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={initConfig.mode}
              selectedKeys={[initConfig.selectKey]}
              onClick={({ key }) => {
                setInitConfig((prev) => ({
                  ...prev,
                  selectKey: key as SettingsStateKeys,
                }));
              }}
              items={getMenu()}
            />
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
            <SettingsContent selectKey={initConfig.selectKey} />
          </div>
        </div>
      )}
    </GridContent>
  );
};

export default Settings;
