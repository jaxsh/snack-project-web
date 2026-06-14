import { LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { request, useIntl } from '@umijs/max';
import { App } from 'antd';
import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';

const ChangePassword: React.FC = () => {
  const { message } = App.useApp();
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
      const res = await request<{ redirectUrl?: string }>(
        '/oauth2/account/change-password',
        {
          method: 'POST',
          data: { password: values.password },
        },
      );
      message.success(
        intl.formatMessage({ id: 'pages.changePassword.feedback.success' }),
      );
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch {
      return;
    }
  };

  return (
    <AuthLayout titleId="pages.changePassword.text.title">
      <LoginForm
        contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
        }}
        logo={<img alt="logo" src="/logo.svg" />}
        title={intl.formatMessage({
          id: 'pages.changePassword.text.title',
        })}
        subTitle={intl.formatMessage({
          id: 'pages.changePassword.text.description',
        })}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({
              id: 'pages.changePassword.action.submit',
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
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.changePassword.fields.newPassword',
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
                    id: 'pages.changePassword.fields.newPassword',
                  }),
                },
              ),
            },
            {
              min: 8,
              max: 255,
              message: intl.formatMessage(
                { id: 'pages.common.validation.rangeLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.changePassword.fields.newPassword',
                  }),
                  min: 8,
                  max: 255,
                },
              ),
            },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: intl.formatMessage({
                id: 'pages.common.validation.passwordPattern',
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
            id: 'pages.changePassword.validation.confirmPassword.placeholder',
          })}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.changePassword.validation.confirmPassword.required',
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
                      id: 'pages.changePassword.validation.confirmPassword.mismatch',
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
