import { LockOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { App, Modal } from 'antd';
import React, { useState } from 'react';
import {
  changePassword,
  getSysUserInfo,
  logout,
  updateProfile,
} from '@/services/auth';

const maskMobile = (mobile?: string) => {
  if (!mobile) return '未绑定手机';
  if (mobile.length >= 7) {
    return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`;
  }
  return mobile;
};

const maskEmail = (email?: string) => {
  if (!email) return '未绑定邮箱';
  const parts = email.split('@');
  if (parts.length === 2) {
    const name = parts[0];
    const domain = parts[1];
    if (name.length > 2) {
      return `${name.charAt(0)}***${name.charAt(name.length - 1)}@${domain}`;
    }
    return `${name}***@${domain}`;
  }
  return email;
};

const SecurityView: React.FC = () => {
  const { message: antdMessage } = App.useApp();
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordVal, setPasswordVal] = useState('');
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

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

  const textColors = ['', '#faad14', '#a0d911', '#52c41a'];

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setIsModalOpen(false);
      setPasswordVal('');
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const res = await changePassword({ password: values.password });
      if (res.success) {
        antdMessage.success(
          intl.formatMessage({ id: 'pages.changePassword.success' }),
        );
        setIsModalOpen(false);
        setPasswordVal('');

        let logoutRes: any = null;
        try {
          logoutRes = await logout();
        } catch (e) {
          console.error('Logout failed after password change', e);
        }

        await setInitialState((s) => {
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
    } finally {
      setSubmitting(false);
    }
  };

  const refreshCurrentUser = async () => {
    const res = await getSysUserInfo();
    if (res?.data) {
      await setInitialState((s) => (s ? { ...s, currentUser: res.data } : s));
    }
  };

  const handleMobileSubmit = async (values: { mobile: string }) => {
    try {
      await updateProfile({ mobile: values.mobile });
      antdMessage.success(
        intl.formatMessage({ id: 'pages.security.mobile.success' }),
      );
      setMobileModalOpen(false);
      await refreshCurrentUser();
    } catch {
      return;
    }
  };

  const handleEmailSubmit = async (values: { email: string }) => {
    try {
      await updateProfile({ email: values.email });
      antdMessage.success(
        intl.formatMessage({ id: 'pages.security.email.success' }),
      );
      setEmailModalOpen(false);
      await refreshCurrentUser();
    } catch {
      return;
    }
  };

  const fmt = (id: string, values?: Record<string, string>) =>
    intl.formatMessage({ id }, values);

  const strengthTexts = [
    '',
    fmt('pages.security.passwordStrength.weak'),
    fmt('pages.security.passwordStrength.medium'),
    fmt('pages.security.passwordStrength.strong'),
  ];

  const getData = () => [
    {
      title: fmt('pages.security.password.title'),
      description: fmt('pages.security.password.description'),
      actions: [
        <a key="Modify" href="#" onClick={handleOpenModal}>
          {fmt('pages.security.modify')}
        </a>,
      ],
    },
    {
      title: fmt('pages.security.mobile.title'),
      description: currentUser?.mobile
        ? fmt('pages.security.mobile.bound', {
            mobile: maskMobile(currentUser.mobile),
          })
        : fmt('pages.security.mobile.unbound'),
      actions: [
        <a
          key="Modify"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileModalOpen(true);
          }}
        >
          {fmt('pages.security.modify')}
        </a>,
      ],
    },
    {
      title: fmt('pages.security.email.title'),
      description: currentUser?.email
        ? fmt('pages.security.email.bound', {
            email: maskEmail(currentUser.email),
          })
        : fmt('pages.security.email.unbound'),
      actions: [
        <a
          key="Modify"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setEmailModalOpen(true);
          }}
        >
          {fmt('pages.security.modify')}
        </a>,
      ],
    },
  ];

  const data = getData();
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.map((item, index) => (
          <div
            key={item.title}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom:
                index < data.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: 4,
                  color: 'rgba(0, 0, 0, 0.88)',
                }}
              >
                {item.title}
              </div>
              <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 14 }}>
                {item.description}
              </div>
            </div>
            <div>{item.actions}</div>
          </div>
        ))}
      </div>

      <Modal
        title={intl.formatMessage({ id: 'pages.changePassword.modalTitle' })}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnHidden
        mask={{ closable: !submitting }}
        closable={!submitting}
        width={400}
      >
        <ProForm
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({
                id: 'pages.changePassword.submit',
              }),
            },
            resetButtonProps: false,
            submitButtonProps: {
              loading: submitting,
              block: true,
            },
          }}
        >
          <ProFormText.Password
            name="password"
            label={intl.formatMessage({
              id: 'pages.changePassword.newPassword',
            })}
            fieldProps={{
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
                {fmt('pages.security.passwordStrength.label')}
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
            label={intl.formatMessage({
              id: 'pages.changePassword.confirmPassword',
            })}
            fieldProps={{
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
        </ProForm>
      </Modal>
      <Modal
        title={intl.formatMessage({ id: 'pages.security.mobile.modalTitle' })}
        open={mobileModalOpen}
        onCancel={() => setMobileModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={400}
      >
        <ProForm
          onFinish={handleMobileSubmit}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({ id: 'pages.security.submit' }),
            },
            resetButtonProps: false,
            submitButtonProps: { block: true },
          }}
        >
          <ProFormText
            name="mobile"
            label={intl.formatMessage({ id: 'pages.security.mobile.label' })}
            placeholder={intl.formatMessage({
              id: 'pages.security.mobile.hint',
            })}
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: intl.formatMessage({
                  id: 'pages.security.mobile.hint',
                }),
              },
            ]}
          />
        </ProForm>
      </Modal>

      <Modal
        title={intl.formatMessage({ id: 'pages.security.email.modalTitle' })}
        open={emailModalOpen}
        onCancel={() => setEmailModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={400}
      >
        <ProForm
          onFinish={handleEmailSubmit}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({ id: 'pages.security.submit' }),
            },
            resetButtonProps: false,
            submitButtonProps: { block: true },
          }}
        >
          <ProFormText
            name="email"
            label={intl.formatMessage({ id: 'pages.security.email.label' })}
            placeholder={intl.formatMessage({
              id: 'pages.security.email.hint',
            })}
            rules={[
              {
                type: 'email',
                message: intl.formatMessage({
                  id: 'pages.security.email.hint',
                }),
              },
            ]}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default SecurityView;
