import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { Footer } from '@/components';
import { login } from '@/services/auth';
import { AuthLayout } from '../components/AuthLayout';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: token.colorTextQuaternary,
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
  };
});

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined
        key="AlipayCircleOutlined"
        className={styles.action}
      />
      <TaobaoCircleOutlined
        key="TaobaoCircleOutlined"
        className={styles.action}
      />
      <WeiboCircleOutlined
        key="WeiboCircleOutlined"
        className={styles.action}
      />
    </>
  );
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { message } = App.useApp();
  const intl = useIntl();

  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);

  const getSafeRedirectUrl = (redirect: string | null): string => {
    if (!redirect?.startsWith('/')) return '/';

    if (redirect.startsWith('//')) return '/';

    try {
      const parsed = new URL(redirect, window.location.origin);
      if (parsed.origin !== window.location.origin) return '/';
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return '/';
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      setLoginErrorMsg(null);
      const msg = await login({ ...values, type }, { skipErrorHandler: true });
      if (msg.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.feedback.success',
        });
        void message.success(defaultLoginSuccessMessage);

        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');

        if (values.autoLogin) {
          document.cookie =
            'x-remember-me=1; max-age=300; path=/; SameSite=Lax';
        }

        window.location.href =
          msg.data?.redirectUrl || getSafeRedirectUrl(redirect);
        return;
      }
    } catch (error: any) {
      const serverMsg = error.response?.data?.msg;
      if (serverMsg) {
        setLoginErrorMsg(serverMsg);
      } else if (error.name === 'BizError' && error.info?.errorMessage) {
        setLoginErrorMsg(error.info.errorMessage);
      } else {
        setLoginErrorMsg(
          intl.formatMessage({
            id: 'pages.login.networkError',
          }),
        );
      }
    }
  };

  return (
    <AuthLayout titleId="menu.login">
      <LoginForm
        contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
        }}
        logo={<img alt="logo" src="/logo.svg" />}
        title="Ant Design"
        subTitle={intl.formatMessage({
          id: 'pages.login.text.layoutTitle',
        })}
        initialValues={{
          autoLogin: true,
        }}
        actions={[
          <FormattedMessage key="loginWith" id="pages.login.text.loginWith" />,
          <ActionIcons key="icons" />,
        ]}
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
        }}
      >
        <Tabs
          activeKey={type}
          onChange={setType}
          centered
          items={[
            {
              key: 'account',
              label: intl.formatMessage({
                id: 'pages.login.text.accountLoginTab',
              }),
            },
            {
              key: 'mobile',
              label: intl.formatMessage({
                id: 'pages.login.text.phoneLoginTab',
              }),
            },
          ]}
        />

        {loginErrorMsg && (
          <Alert
            style={{
              marginBottom: 24,
            }}
            title={loginErrorMsg}
            type="error"
            showIcon
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
                onKeyDown: (e) => {
                  if (e.key === 'Enter' && e.nativeEvent.isComposing) {
                    e.stopPropagation();
                  }
                },
              }}
              placeholder={intl.formatMessage(
                { id: 'pages.common.validation.placeholder.input' },
                {
                  field: intl.formatMessage({
                    id: 'pages.login.fields.username',
                  }),
                },
              )}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage(
                    { id: 'pages.common.validation.required' },
                    {
                      field: intl.formatMessage({
                        id: 'pages.login.fields.username',
                      }),
                    },
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
                onKeyDown: (e) => {
                  if (e.key === 'Enter' && e.nativeEvent.isComposing) {
                    e.stopPropagation();
                  }
                },
              }}
              placeholder={intl.formatMessage(
                { id: 'pages.common.validation.placeholder.input' },
                {
                  field: intl.formatMessage({
                    id: 'pages.login.fields.password',
                  }),
                },
              )}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage(
                    { id: 'pages.common.validation.required' },
                    {
                      field: intl.formatMessage({
                        id: 'pages.login.fields.password',
                      }),
                    },
                  ),
                },
              ]}
            />
          </>
        )}

        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined />,
                onKeyDown: (e) => {
                  if (e.key === 'Enter' && e.nativeEvent.isComposing) {
                    e.stopPropagation();
                  }
                },
              }}
              name="mobile"
              placeholder={intl.formatMessage(
                { id: 'pages.common.validation.placeholder.input' },
                {
                  field: intl.formatMessage({
                    id: 'pages.login.fields.mobile',
                  }),
                },
              )}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage(
                    { id: 'pages.common.validation.required' },
                    {
                      field: intl.formatMessage({
                        id: 'pages.login.fields.mobile',
                      }),
                    },
                  ),
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: intl.formatMessage(
                    { id: 'pages.common.validation.invalid' },
                    {
                      field: intl.formatMessage({
                        id: 'pages.login.fields.mobile',
                      }),
                    },
                  ),
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
                onKeyDown: (e) => {
                  if (e.key === 'Enter' && e.nativeEvent.isComposing) {
                    e.stopPropagation();
                  }
                },
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={intl.formatMessage(
                { id: 'pages.common.validation.placeholder.input' },
                {
                  field: intl.formatMessage({
                    id: 'pages.login.fields.captcha',
                  }),
                },
              )}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${intl.formatMessage({
                    id: 'pages.login.text.captchaCountdown',
                  })}`;
                }
                return intl.formatMessage({
                  id: 'pages.login.action.getVerificationCode',
                });
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage(
                    { id: 'pages.common.validation.required' },
                    {
                      field: intl.formatMessage({
                        id: 'pages.login.fields.captcha',
                      }),
                    },
                  ),
                },
              ]}
              onGetCaptcha={async () => {
                void message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            <FormattedMessage id="pages.login.fields.rememberMe" />
          </ProFormCheckbox>
          <a
            href="#"
            style={{
              float: 'right',
            }}
          >
            <FormattedMessage id="pages.login.action.forgotPassword" />
          </a>
        </div>
      </LoginForm>
      <Footer />
    </AuthLayout>
  );
};

export default Login;
