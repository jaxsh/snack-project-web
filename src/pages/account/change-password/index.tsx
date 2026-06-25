import { LockOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { request, useIntl } from '@umijs/max';
import { App } from 'antd';
import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordStrengthBar } from '../components/PasswordStrengthBar';

const ChangePassword: React.FC = () => {
  const { message } = App.useApp();
  const intl = useIntl();
  const [passwordVal, setPasswordVal] = useState('');

  const handleSubmit = async (values: API.UpdatePasswordParams) => {
    try {
      const res = await request<API.ApiResponse<{ redirectUrl?: string }>>(
        '/oauth2/account/change-password',
        {
          method: 'POST',
          data: { password: values.password },
        },
      );
      void message.success(
        intl.formatMessage({ id: 'pages.changePassword.feedback.success' }),
      );
      if (res?.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
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
              id: 'pages.common.action.confirm',
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
        <PasswordStrengthBar password={passwordVal} />
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
