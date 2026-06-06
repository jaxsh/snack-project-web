import { LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { App } from 'antd';
import React, { useState } from 'react';
import { changePassword, logout } from '@/services/auth';
import { AuthLayout } from '../components/AuthLayout';

const ChangePassword: React.FC = () => {
  const { message } = App.useApp();
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [passwordVal, setPasswordVal] = useState('');

  const getStrengthLevel = (val: string): number => {
    if (!val) return 0;
    if (val.length < 8) return 1;

    const hasUpperCase = /[A-Z]/.test(val);
    const hasLowerCase = /[a-z]/.test(val);
    const hasDigit = /\d/.test(val);
    const hasSpecial = /[@$!%*?&]/.test(val);

    if (hasUpperCase && hasLowerCase && hasDigit && hasSpecial) {
      return 3;
    }

    const hasLetter = /[a-zA-Z]/.test(val);
    if (hasDigit && hasLetter) {
      return 2;
    }

    return 1;
  };

  const level = getStrengthLevel(passwordVal);

  const getBarColor = (index: number) => {
    if (level === 0 || index > level) return 'rgba(0, 0, 0, 0.06)';
    if (level === 1) return '#faad14';
    if (level === 2) return '#a0d911';
    return '#52c41a';
  };

  const strengthTexts = ['', '弱', '中', '强'];
  const textColors = ['', '#faad14', '#a0d911', '#52c41a'];

  const handleSubmit = async (values: API.UpdatePasswordParams) => {
    try {
      const res = await changePassword({ password: values.password });
      if (res.success) {
        message.success(
          intl.formatMessage({ id: 'pages.changePassword.success' }),
        );

        let logoutRes: any = null;
        try {
          logoutRes = await logout();
        } catch (e) {
          console.error('Logout failed after password change', e);
        }

        setInitialState((s) => {
          if (!s) return s;
          return {
            ...s,
            currentUser: undefined,
            changePasswordRequired: false,
          };
        });

        setTimeout(() => {
          if (logoutRes?.redirectUrl) {
            window.location.href = logoutRes.redirectUrl;
          } else {
            window.location.href = '/user/login';
          }
        }, 1500);
      }
    } catch {
      return;
    }
  };

  return (
    <AuthLayout titleId="pages.changePassword.title">
      <LoginForm
        contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
        }}
        logo={<img alt="logo" src="/logo.svg" />}
        title={intl.formatMessage({
          id: 'pages.changePassword.title',
        })}
        subTitle={intl.formatMessage({
          id: 'pages.changePassword.description',
        })}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({
              id: 'pages.changePassword.submit',
            }),
          },
        }}
        onFinish={handleSubmit}
      >
        <div style={{ height: '46px' }} />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
            onChange: (e) => setPasswordVal(e.target.value),
          }}
          placeholder={intl.formatMessage({
            id: 'pages.changePassword.newPassword.placeholder',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.changePassword.newPassword.required',
              }),
            },
            {
              min: 8,
              message: intl.formatMessage({
                id: 'pages.changePassword.newPassword.minLen',
              }),
            },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: intl.formatMessage({
                id: 'pages.changePassword.newPassword.pattern',
              }),
            },
          ]}
        />
        {passwordVal && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              marginTop: '-12px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
              密码强度：
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    width: '24px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: getBarColor(idx),
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: '12px',
                color: textColors[level],
                fontWeight: 500,
              }}
            >
              {strengthTexts[level]}
            </span>
          </div>
        )}
        <ProFormText.Password
          name="confirmPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder={intl.formatMessage({
            id: 'pages.changePassword.confirmPassword.placeholder',
          })}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.changePassword.confirmPassword.required',
              }),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    intl.formatMessage({
                      id: 'pages.changePassword.confirmPassword.mismatch',
                    }),
                  ),
                );
              },
            }),
          ]}
        />
      </LoginForm>
    </AuthLayout>
  );
};

export default ChangePassword;
