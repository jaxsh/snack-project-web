import { LockOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Alert, App, List, Modal, QRCode, Spin } from 'antd';
import React, { useState } from 'react';
import { PasswordStrengthBar } from '@/components/PasswordStrengthBar';
import {
  changePassword,
  getMfaSetup,
  getSysUserInfo,
  logout,
  updateMfa,
  updateProfile,
} from '@/services/auth';

const maskMobile = (mobile?: string) => {
  if (!mobile) return '';
  if (mobile.length >= 7) {
    return `${mobile.slice(0, 3)}****${mobile.slice(-4)}`;
  }
  return mobile;
};

const maskEmail = (email?: string) => {
  if (!email) return '';
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
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState<API.MfaSetupVO | null>(null);
  const [mfaSubmitting, setMfaSubmitting] = useState(false);
  const [mfaDisableModalOpen, setMfaDisableModalOpen] = useState(false);
  const [mfaDisableSubmitting, setMfaDisableSubmitting] = useState(false);

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
          intl.formatMessage({ id: 'pages.changePassword.feedback.success' }),
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
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
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
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
      );
      setEmailModalOpen(false);
      await refreshCurrentUser();
    } catch {
      return;
    }
  };

  const handleMfaOpen = async () => {
    setMfaModalOpen(true);
    try {
      const res = await getMfaSetup();
      if (res?.data) {
        setMfaSetupData(res.data);
      }
    } catch {
      setMfaModalOpen(false);
    }
  };

  const handleMfaClose = () => {
    if (!mfaSubmitting) {
      setMfaModalOpen(false);
      setMfaSetupData(null);
    }
  };

  const handleMfaSubmit = async (values: { mfaCode: string }) => {
    if (!mfaSetupData) return;
    setMfaSubmitting(true);
    try {
      await updateMfa({
        mfaEnabled: 1,
        mfaCode: values.mfaCode,
      });
      antdMessage.success(fmt('pages.common.feedback.update.success'));
      setMfaModalOpen(false);
      setMfaSetupData(null);
      await refreshCurrentUser();
    } catch {
      return;
    } finally {
      setMfaSubmitting(false);
    }
  };

  const handleMfaDisable = async (values: { mfaCode: string }) => {
    setMfaDisableSubmitting(true);
    try {
      await updateMfa({ mfaEnabled: 0, mfaCode: values.mfaCode });
      antdMessage.success(fmt('pages.common.feedback.update.success'));
      setMfaDisableModalOpen(false);
      await refreshCurrentUser();
    } catch {
      return;
    } finally {
      setMfaDisableSubmitting(false);
    }
  };

  const fmt = (id: string, values?: Record<string, string>) =>
    intl.formatMessage({ id }, values);

  const getData = () => [
    {
      title: fmt('pages.system.user.fields.password'),
      actions: [
        <a key="Modify" onClick={() => setIsModalOpen(true)}>
          {fmt('pages.common.action.modify')}
        </a>,
      ],
    },
    {
      title: fmt('pages.system.user.fields.mobile'),
      description: currentUser?.mobile
        ? `${fmt('pages.common.text.bound')} : ${maskMobile(currentUser.mobile)}`
        : fmt('pages.common.text.unbound'),
      actions: [
        <a
          key="Modify"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileModalOpen(true);
          }}
        >
          {fmt('pages.common.action.modify')}
        </a>,
      ],
    },
    {
      title: fmt('pages.system.user.fields.email'),
      description: currentUser?.email
        ? `${fmt('pages.common.text.bound')} : ${maskEmail(currentUser.email)}`
        : fmt('pages.common.text.unbound'),
      actions: [
        <a
          key="Modify"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setEmailModalOpen(true);
          }}
        >
          {fmt('pages.common.action.modify')}
        </a>,
      ],
    },
    {
      title: fmt('pages.security.text.mfaTitle'),
      description:
        currentUser?.oauthVO?.mfaEnabled === 1
          ? fmt('pages.common.text.bound')
          : fmt('pages.common.text.unbound'),
      actions:
        currentUser?.oauthVO?.mfaEnabled === 1
          ? [
              <a key="Disable" onClick={() => setMfaDisableModalOpen(true)}>
                {fmt('pages.common.action.unbind')}
              </a>,
            ]
          : [
              <a key="Enable" onClick={handleMfaOpen}>
                {fmt('pages.common.action.bind')}
              </a>,
            ],
    },
  ];

  const data = getData();
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />

      <Modal
        title={fmt('pages.common.action.modifyField', {
          field: fmt('pages.system.user.fields.password'),
        })}
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
                id: 'pages.common.action.confirm',
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
              id: 'pages.system.user.fields.newPassword',
            })}
            fieldProps={{
              prefix: <LockOutlined />,
              onChange: (e) => setPasswordVal(e.target.value),
            }}
            placeholder={intl.formatMessage(
              { id: 'pages.common.validation.placeholder.input' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.newPassword',
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
                      id: 'pages.system.user.fields.newPassword',
                    }),
                  },
                ),
              },
              {
                min: 8,
                message: intl.formatMessage(
                  { id: 'pages.common.validation.rangeLength' },
                  {
                    field: intl.formatMessage({
                      id: 'pages.system.user.fields.newPassword',
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
            label={intl.formatMessage({
              id: 'pages.system.user.fields.confirmPassword',
            })}
            placeholder={intl.formatMessage(
              { id: 'pages.common.validation.placeholder.input' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.confirmPassword',
                }),
              },
            )}
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pages.common.validation.required' },
                  {
                    field: intl.formatMessage({
                      id: 'pages.system.user.fields.confirmPassword',
                    }),
                  },
                ),
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
        </ProForm>
      </Modal>
      <Modal
        title={fmt('pages.common.action.modifyField', {
          field: fmt('pages.system.user.fields.mobile'),
        })}
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
              submitText: intl.formatMessage({
                id: 'pages.common.action.confirm',
              }),
            },
            resetButtonProps: false,
            submitButtonProps: { block: true },
          }}
        >
          <ProFormText
            name="mobile"
            label={intl.formatMessage({
              id: 'pages.system.user.fields.mobile',
            })}
            placeholder={intl.formatMessage(
              { id: 'pages.common.validation.placeholder.input' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.mobile',
                }),
              },
            )}
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: intl.formatMessage(
                  { id: 'pages.common.validation.invalid' },
                  {
                    field: intl.formatMessage({
                      id: 'pages.system.user.fields.mobile',
                    }),
                  },
                ),
              },
            ]}
          />
        </ProForm>
      </Modal>

      <Modal
        title={fmt('pages.common.action.modifyField', {
          field: fmt('pages.system.user.fields.email'),
        })}
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
              submitText: intl.formatMessage({
                id: 'pages.common.action.confirm',
              }),
            },
            resetButtonProps: false,
            submitButtonProps: { block: true },
          }}
        >
          <ProFormText
            name="email"
            label={intl.formatMessage({ id: 'pages.system.user.fields.email' })}
            placeholder={intl.formatMessage(
              { id: 'pages.common.validation.placeholder.input' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.email',
                }),
              },
            )}
            rules={[
              {
                type: 'email',
                message: intl.formatMessage(
                  { id: 'pages.common.validation.invalid' },
                  {
                    field: intl.formatMessage({
                      id: 'pages.system.user.fields.email',
                    }),
                  },
                ),
              },
            ]}
          />
        </ProForm>
      </Modal>

      <Modal
        title={fmt('pages.common.action.bindField', {
          field: fmt('pages.security.text.mfaTitle'),
        })}
        open={mfaModalOpen}
        onCancel={handleMfaClose}
        footer={null}
        destroyOnHidden
        closable={!mfaSubmitting}
        width={400}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          {mfaSetupData ? (
            <QRCode value={mfaSetupData.otpauthUri} size={200} />
          ) : (
            <Spin style={{ padding: '20px 0' }} />
          )}
        </div>
        <Alert
          title={fmt('pages.security.text.mfaDescription')}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <ProForm
          onFinish={handleMfaSubmit}
          submitter={{
            searchConfig: {
              submitText: fmt('pages.common.action.confirm'),
            },
            resetButtonProps: false,
            submitButtonProps: {
              loading: mfaSubmitting,
              block: true,
              disabled: !mfaSetupData,
            },
          }}
        >
          <ProFormText
            name="mfaCode"
            label={fmt('pages.system.user.fields.mfaCode')}
            placeholder={fmt('pages.common.validation.placeholder.input', {
              field: fmt('pages.system.user.fields.mfaCode'),
            })}
            rules={[
              {
                required: true,
                message: fmt('pages.common.validation.required', {
                  field: fmt('pages.system.user.fields.mfaCode'),
                }),
              },
              {
                pattern: /^[0-9]{6}$/,
                message: fmt('pages.security.validation.mfaCode'),
              },
            ]}
          />
        </ProForm>
      </Modal>

      <Modal
        title={fmt('pages.common.action.unbindField', {
          field: fmt('pages.security.text.mfaTitle'),
        })}
        open={mfaDisableModalOpen}
        onCancel={() => {
          if (!mfaDisableSubmitting) setMfaDisableModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
        closable={!mfaDisableSubmitting}
        width={400}
      >
        <Alert
          title={fmt('pages.security.text.mfaDisableConfirm')}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <ProForm
          onFinish={handleMfaDisable}
          submitter={{
            searchConfig: {
              submitText: fmt('pages.common.action.confirm'),
            },
            resetButtonProps: false,
            submitButtonProps: {
              loading: mfaDisableSubmitting,
              block: true,
              danger: true,
            },
          }}
        >
          <ProFormText
            name="mfaCode"
            label={fmt('pages.system.user.fields.mfaCode')}
            placeholder={fmt('pages.common.validation.placeholder.input', {
              field: fmt('pages.system.user.fields.mfaCode'),
            })}
            rules={[
              {
                required: true,
                message: fmt('pages.common.validation.required', {
                  field: fmt('pages.system.user.fields.mfaCode'),
                }),
              },
              {
                pattern: /^[0-9]{6}$/,
                message: fmt('pages.security.validation.mfaCode'),
              },
            ]}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default SecurityView;
