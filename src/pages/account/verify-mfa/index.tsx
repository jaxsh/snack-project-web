import { SafetyCertificateOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { App } from 'antd';
import React from 'react';
import { verifyMfa } from '@/services/auth';
import { AuthLayout } from '../components/AuthLayout';

const VerifyMfa: React.FC = () => {
  const { message } = App.useApp();
  const intl = useIntl();

  const handleSubmit = async (values: { code: string }) => {
    try {
      const res = await verifyMfa({ code: values.code });
      message.success(
        intl.formatMessage({ id: 'pages.verifyMfa.feedback.success' }),
      );
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch {
      return;
    }
  };

  return (
    <AuthLayout titleId="pages.verifyMfa.text.title">
      <LoginForm
        contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
        }}
        logo={<img alt="logo" src="/logo.svg" />}
        title={intl.formatMessage({ id: 'pages.verifyMfa.text.title' })}
        subTitle={intl.formatMessage({
          id: 'pages.verifyMfa.text.description',
        })}
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({
              id: 'pages.verifyMfa.action.submit',
            }),
          },
        }}
        onFinish={handleSubmit}
      >
        <div style={{ height: '46px' }} />
        <ProFormText
          name="code"
          fieldProps={{
            size: 'large',
            prefix: <SafetyCertificateOutlined />,
            maxLength: 6,
          }}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({ id: 'pages.verifyMfa.fields.code' }),
            },
          )}
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: 'pages.common.validation.required' },
                {
                  field: intl.formatMessage({
                    id: 'pages.verifyMfa.fields.code',
                  }),
                },
              ),
            },
            {
              pattern: /^[0-9]{6}$/,
              message: intl.formatMessage({
                id: 'pages.security.validation.mfaCode',
              }),
            },
          ]}
        />
      </LoginForm>
    </AuthLayout>
  );
};

export default VerifyMfa;
