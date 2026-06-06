import { Helmet, SelectLang, useIntl, useModel } from '@umijs/max';
import { ConfigProvider, theme } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import Settings from '../../../../../config/defaultSettings';

const useStyles = createStyles(({ token }, isDark: boolean) => {
  return {
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      top: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundColor: token.colorBgLayout,
      backgroundImage: isDark
        ? 'none'
        : "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
      '.ant-pro-form-login-title': {
        color: `${token.colorTextHeading} !important`,
      },
    },
  };
});

interface AuthLayoutProps {
  children: React.ReactNode;
  titleId: string;
}

const AuthLayoutContent: React.FC<AuthLayoutProps> = ({
  children,
  titleId,
}) => {
  const { initialState } = useModel('@@initialState');
  const isDark = initialState?.settings?.navTheme === 'realDark';
  const { styles } = useStyles(isDark);
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: titleId,
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  titleId,
}) => {
  const { initialState } = useModel('@@initialState');
  const isDark = initialState?.settings?.navTheme === 'realDark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AuthLayoutContent titleId={titleId}>{children}</AuthLayoutContent>
    </ConfigProvider>
  );
};
