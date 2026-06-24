import { LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { request, useIntl } from '@umijs/max';
import { App, theme } from 'antd';
import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';

const STRENGTH_COLORS = ['', '#faad14', '#a0d911', '#52c41a'];

const getStrengthLevel = (val: string): number => {
  if (!val) return 0;
  if (val.length < 8) return 1;
  const hasUpperCase = /[A-Z]/.test(val);
  const hasLowerCase = /[a-z]/.test(val);
  const hasDigit = /\d/.test(val);
  const hasSpecial = /[@$!%*?&]/.test(val);
  if (hasUpperCase && hasLowerCase && hasDigit && hasSpecial) return 3;
  if (hasDigit && /[a-zA-Z]/.test(val)) return 2;
  return 1;
};

const PasswordStrengthBar: React.FC<{ level: number }> = ({ level }) => {
  const { token } = theme.useToken();
  const intl = useIntl();
  const strengthTexts = [
    '',
    intl.formatMessage({ id: 'pages.common.dict.passwordStrength.weak' }),
    intl.formatMessage({ id: 'pages.common.dict.passwordStrength.medium' }),
    intl.formatMessage({ id: 'pages.common.dict.passwordStrength.strong' }),
  ];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        marginTop: '-12px',
      }}
    >
      <span style={{ fontSize: '12px', color: token.colorTextSecondary }}>
        {intl.formatMessage({ id: 'pages.common.dict.passwordStrength.label' })}
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              width: '24px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor:
                level === 0 || idx > level
                  ? token.colorFillSecondary
                  : STRENGTH_COLORS[level],
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: '12px',
          color: STRENGTH_COLORS[level],
          fontWeight: 500,
        }}
      >
        {strengthTexts[level]}
      </span>
    </div>
  );
};

const ChangePassword: React.FC = () => {
  const { message } = App.useApp();
  const intl = useIntl();
  const [passwordVal, setPasswordVal] = useState('');

  const level = getStrengthLevel(passwordVal);

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
        {passwordVal && <PasswordStrengthBar level={level} />}
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
