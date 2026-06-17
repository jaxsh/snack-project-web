import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  LockOutlined,
  LogoutOutlined,
  MoreOutlined,
  PlusOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { App, Avatar, Button, Dropdown, Popconfirm, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
  createUser,
  deleteUsers,
  queryUsers,
  resetUserPassword,
  revokeUserTokens,
  unlockUser,
  updateUser,
} from '@/services/system/user';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const intl = useIntl();

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.SysUserVO>();

  const [resetPwdModalOpen, setResetPwdModalOpen] = useState<boolean>(false);
  const [resetPwdRow, setResetPwdRow] = useState<API.SysUserVO>();

  const handleTableRequest = async (
    params: any & {
      pageSize?: number;
      current?: number;
    },
    sort: any,
  ) => {
    const { current, pageSize, ...searchParams } = params;

    const where: Record<string, any> = {};
    for (const [key, val] of Object.entries(searchParams)) {
      if (val !== undefined && val !== null && val !== '') {
        if (
          ['username', 'realName', 'nickname', 'mobile', 'email'].includes(key)
        ) {
          where[key] = { _like: val };
        } else {
          where[key] = { _eq: val };
        }
      }
    }

    const orderBy = Object.entries(sort).map(([field, direction]) => ({
      field,
      direction: direction === 'ascend' ? ('asc' as const) : ('desc' as const),
    }));

    try {
      const response = await queryUsers({
        current,
        size: pageSize,
        where,
        orderBy,
      });

      return {
        data: response.data?.records || [],
        success: true,
        total: response.data?.total || 0,
      };
    } catch (error) {
      console.error('Query users failed:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const handleCreateSubmit = async (values: API.SysUserDTO) => {
    try {
      await createUser(values);
      message.success(
        intl.formatMessage({ id: 'pages.common.feedback.create.success' }),
      );
      setCreateModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (_error) {
      return false;
    }
  };

  const handleUpdateSubmit = async (values: API.SysUserDTO) => {
    if (!currentRow?.id) return false;
    try {
      await updateUser(currentRow.id, values);
      message.success(
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
      );
      setUpdateModalOpen(false);
      setCurrentRow(undefined);
      actionRef.current?.reload();
      return true;
    } catch (_error) {
      return false;
    }
  };

  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    modal.confirm({
      title: intl.formatMessage({ id: 'pages.common.action.confirmDelete' }),
      content: intl.formatMessage(
        { id: 'pages.common.feedback.batchDelete.confirm' },
        { count: selectedRowKeys.length },
      ),
      okText: intl.formatMessage({ id: 'pages.common.action.ok' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'pages.common.action.cancel' }),
      onOk: async () => {
        try {
          const ids = selectedRowKeys.join(',');
          await deleteUsers(ids);
          message.success(
            intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
          );
          actionRef.current?.clearSelected?.();
          actionRef.current?.reload();
        } catch (error) {
          console.error('Delete users failed:', error);
        }
      },
    });
  };

  const handleResetPassword = async (values: { password?: string }) => {
    if (!resetPwdRow?.id) return false;
    try {
      await resetUserPassword(resetPwdRow.id, {
        password: values.password,
      });
      message.success(
        intl.formatMessage({
          id: 'pages.system.user.feedback.resetPassword.success',
        }),
      );
      setResetPwdModalOpen(false);
      setResetPwdRow(undefined);
      return true;
    } catch (_error) {
      return false;
    }
  };

  const handleUnlockUser = async (record: API.SysUserVO) => {
    try {
      await unlockUser(record.id);
      message.success(
        intl.formatMessage({ id: 'pages.system.user.feedback.unlock.success' }),
      );
      actionRef.current?.reload();
    } catch (error) {
      console.error('Unlock user failed:', error);
    }
  };

  const handleRevokeTokens = async (record: API.SysUserVO) => {
    try {
      await revokeUserTokens(record.id);
      message.success(
        intl.formatMessage({ id: 'pages.system.user.feedback.revoke.success' }),
      );
      actionRef.current?.reload();
    } catch (error) {
      console.error('Revoke user tokens failed:', error);
    }
  };

  const handleResetMfa = async (record: API.SysUserVO) => {
    try {
      await updateUser(record.id, { mfaEnabled: 0 } as API.SysUserDTO);
      message.success(
        intl.formatMessage({
          id: 'pages.system.user.feedback.resetMfa.success',
        }),
      );
      actionRef.current?.reload();
    } catch (error) {
      console.error('Reset MFA failed:', error);
    }
  };

  const columns: ProColumns<API.SysUserVO>[] = [
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.avatar' }),
      dataIndex: 'avatar',
      key: 'avatar',
      search: false,
      width: 64,
      render: (_, record) => {
        const defaultAvatar =
          'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
        return <Avatar src={record.avatar || defaultAvatar} size="large" />;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.username' }),
      dataIndex: 'username',
      key: 'username',
      copyable: true,
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: intl.formatMessage(
              { id: 'pages.common.validation.required' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.username',
                }),
              },
            ),
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.realName' }),
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.nickname' }),
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.gender' }),
      dataIndex: 'gender',
      key: 'gender',
      valueType: 'select',
      valueEnum: {
        0: {
          text: intl.formatMessage({ id: 'pages.common.dict.gender.unknown' }),
          status: 'Default',
        },
        1: {
          text: intl.formatMessage({ id: 'pages.common.dict.gender.male' }),
          status: 'Processing',
        },
        2: {
          text: intl.formatMessage({ id: 'pages.common.dict.gender.female' }),
          status: 'Success',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.mobile' }),
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.email' }),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.status' }),
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: intl.formatMessage({ id: 'pages.common.dict.status.disabled' }),
          status: 'Error',
        },
        1: {
          text: intl.formatMessage({ id: 'pages.common.dict.status.enabled' }),
          status: 'Success',
        },
      },
      render: (_, record) => {
        const isEnabled = record.status === 1;
        return (
          <Tag color={isEnabled ? 'emerald' : 'rose'}>
            {record.statusLabel ||
              (isEnabled
                ? intl.formatMessage({ id: 'pages.common.dict.status.enabled' })
                : intl.formatMessage({
                    id: 'pages.common.dict.status.disabled',
                  }))}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.birthday' }),
      dataIndex: 'birthday',
      key: 'birthday',
      valueType: 'date',
      search: false,
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.user.fields.lastActiveTime',
      }),
      dataIndex: 'lastActiveTime',
      key: 'lastActiveTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'pages.common.action.columnLabel' }),
      valueType: 'option',
      key: 'option',
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalOpen(true);
            }}
          >
            <EditOutlined style={{ marginRight: 4 }} />
            {intl.formatMessage({ id: 'pages.common.action.edit' })}
          </a>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'resetPwd',
                  label: intl.formatMessage({
                    id: 'pages.system.user.action.resetPassword',
                  }),
                  icon: <KeyOutlined />,
                  onClick: () => {
                    setResetPwdOpen(record);
                  },
                },
                {
                  key: 'unlock',
                  label: intl.formatMessage({
                    id: 'pages.system.user.action.unlock',
                  }),
                  icon: <UnlockOutlined />,
                  onClick: () => handleUnlockUser(record),
                },
                {
                  key: 'resetMfa',
                  label: (
                    <Popconfirm
                      title={intl.formatMessage({
                        id: 'pages.system.user.action.resetMfa',
                      })}
                      description={intl.formatMessage(
                        { id: 'pages.system.user.text.resetMfaConfirm' },
                        { name: record.username },
                      )}
                      onConfirm={() => handleResetMfa(record)}
                      okText={intl.formatMessage({
                        id: 'pages.common.action.ok',
                      })}
                      cancelText={intl.formatMessage({
                        id: 'pages.common.action.cancel',
                      })}
                    >
                      <span>
                        {intl.formatMessage({
                          id: 'pages.system.user.action.resetMfa',
                        })}
                      </span>
                    </Popconfirm>
                  ),
                  icon: <LockOutlined />,
                },
                {
                  key: 'revokeTokens',
                  label: intl.formatMessage({
                    id: 'pages.system.user.action.revoke',
                  }),
                  icon: <LogoutOutlined />,
                  danger: true,
                  disabled: !record.lastActiveTime,
                  onClick: () => handleRevokeTokens(record),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: (
                    <Popconfirm
                      title={intl.formatMessage({
                        id: 'pages.common.action.confirmDelete',
                      })}
                      description={intl.formatMessage(
                        { id: 'pages.common.feedback.delete.confirm' },
                        { name: record.username },
                      )}
                      onConfirm={async () => {
                        try {
                          await deleteUsers(record.id);
                          message.success(
                            intl.formatMessage({
                              id: 'pages.common.feedback.delete.success',
                            }),
                          );
                          actionRef.current?.reload();
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      okText={intl.formatMessage({
                        id: 'pages.common.action.ok',
                      })}
                      cancelText={intl.formatMessage({
                        id: 'pages.common.action.cancel',
                      })}
                    >
                      <span>
                        {intl.formatMessage({
                          id: 'pages.common.action.delete',
                        })}
                      </span>
                    </Popconfirm>
                  ),
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <MoreOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const setResetPwdOpen = (record: API.SysUserVO) => {
    setResetPwdRow(record);
    setResetPwdModalOpen(true);
  };

  return (
    <PageContainer>
      <ProTable<API.SysUserVO>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => setCreateModalOpen(true)}
            icon={<PlusOutlined />}
            style={{ borderRadius: 6 }}
          >
            {intl.formatMessage({ id: 'pages.common.action.create' })}
          </Button>,
        ]}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return (
            <Space size={16}>
              <a
                onClick={() => handleBatchDelete(selectedRowKeys)}
                style={{ color: '#ff4d4f' }}
              >
                <DeleteOutlined />{' '}
                {intl.formatMessage({ id: 'pages.common.action.batchDelete' })}
              </a>
            </Space>
          );
        }}
        request={handleTableRequest}
        columns={columns}
        rowSelection={{}}
        cardBordered
        style={{
          borderRadius: 8,
          overflow: 'hidden',
        }}
      />

      <DrawerForm
        title={intl.formatMessage({ id: 'pages.common.action.create' })}
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onFinish={handleCreateSubmit}
        drawerProps={{
          destroyOnHidden: true,
          size: 520,
        }}
      >
        <ProFormText
          name="username"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.username',
          })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.username',
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
                    id: 'pages.system.user.fields.username',
                  }),
                },
              ),
            },
            {
              min: 1,
              max: 64,
              message: intl.formatMessage(
                { id: 'pages.common.validation.rangeLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.username',
                  }),
                  min: 1,
                  max: 64,
                },
              ),
            },
          ]}
        />
        <ProFormText
          name="realName"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.realName',
          })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.realName',
              }),
            },
          )}
          rules={[
            {
              max: 50,
              message: intl.formatMessage(
                { id: 'pages.common.validation.maxLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.realName',
                  }),
                  max: 50,
                },
              ),
            },
          ]}
        />
        <ProFormText
          name="nickname"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.nickname',
          })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.nickname',
              }),
            },
          )}
          rules={[
            {
              max: 50,
              message: intl.formatMessage(
                { id: 'pages.common.validation.maxLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.nickname',
                  }),
                  max: 50,
                },
              ),
            },
          ]}
        />
        <ProFormSelect
          name="gender"
          label={intl.formatMessage({ id: 'pages.system.user.fields.gender' })}
          initialValue={0}
          options={[
            {
              value: 0,
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.unknown',
              }),
            },
            {
              value: 1,
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.male',
              }),
            },
            {
              value: 2,
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.female',
              }),
            },
          ]}
        />
        <ProFormDatePicker
          name="birthday"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.birthday',
          })}
        />
        <ProFormText
          name="mobile"
          label={intl.formatMessage({ id: 'pages.system.user.fields.mobile' })}
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
        <ProFormSelect
          name="status"
          label={intl.formatMessage({ id: 'pages.system.user.fields.status' })}
          initialValue={1}
          options={[
            {
              value: 1,
              label: intl.formatMessage({
                id: 'pages.common.dict.status.enabled',
              }),
            },
            {
              value: 0,
              label: intl.formatMessage({
                id: 'pages.common.dict.status.disabled',
              }),
            },
          ]}
        />
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({ id: 'pages.system.user.fields.remark' })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.remark',
              }),
            },
          )}
          rules={[
            {
              max: 500,
              message: intl.formatMessage(
                { id: 'pages.common.validation.maxLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.remark',
                  }),
                  max: 500,
                },
              ),
            },
          ]}
        />
      </DrawerForm>

      <DrawerForm
        title={intl.formatMessage({ id: 'pages.common.action.edit' })}
        open={updateModalOpen}
        onOpenChange={(open) => {
          setUpdateModalOpen(open);
          if (!open) setCurrentRow(undefined);
        }}
        onFinish={handleUpdateSubmit}
        drawerProps={{
          destroyOnHidden: true,
          size: 520,
        }}
        initialValues={{
          realName: currentRow?.realName,
          nickname: currentRow?.nickname,
          gender: currentRow?.gender ?? 0,
          birthday: currentRow?.birthday,
          mobile: currentRow?.mobile,
          email: currentRow?.email,
          status: currentRow?.status ?? 1,
          remark: currentRow?.remark,
        }}
      >
        <ProFormText
          name="username"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.username',
          })}
          disabled
          initialValue={currentRow?.username}
        />
        <ProFormText
          name="realName"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.realName',
          })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.realName',
              }),
            },
          )}
          rules={[
            {
              max: 50,
              message: intl.formatMessage(
                { id: 'pages.common.validation.maxLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.realName',
                  }),
                  max: 50,
                },
              ),
            },
          ]}
        />
        <ProFormText
          name="nickname"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.nickname',
          })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.nickname',
              }),
            },
          )}
          rules={[
            {
              max: 50,
              message: intl.formatMessage(
                { id: 'pages.common.validation.maxLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.nickname',
                  }),
                  max: 50,
                },
              ),
            },
          ]}
        />
        <ProFormSelect
          name="gender"
          label={intl.formatMessage({ id: 'pages.system.user.fields.gender' })}
          options={[
            {
              value: 0,
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.unknown',
              }),
            },
            {
              value: 1,
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.male',
              }),
            },
            {
              value: 2,
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.female',
              }),
            },
          ]}
        />
        <ProFormDatePicker
          name="birthday"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.birthday',
          })}
        />
        <ProFormText
          name="mobile"
          label={intl.formatMessage({ id: 'pages.system.user.fields.mobile' })}
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
        <ProFormSelect
          name="status"
          label={intl.formatMessage({ id: 'pages.system.user.fields.status' })}
          options={[
            {
              value: 1,
              label: intl.formatMessage({
                id: 'pages.common.dict.status.enabled',
              }),
            },
            {
              value: 0,
              label: intl.formatMessage({
                id: 'pages.common.dict.status.disabled',
              }),
            },
          ]}
        />
        <ProFormTextArea
          name="remark"
          label={intl.formatMessage({ id: 'pages.system.user.fields.remark' })}
          placeholder={intl.formatMessage(
            { id: 'pages.common.validation.placeholder.input' },
            {
              field: intl.formatMessage({
                id: 'pages.system.user.fields.remark',
              }),
            },
          )}
          rules={[
            {
              max: 500,
              message: intl.formatMessage(
                { id: 'pages.common.validation.maxLength' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.user.fields.remark',
                  }),
                  max: 500,
                },
              ),
            },
          ]}
        />
      </DrawerForm>

      <ModalForm
        title={intl.formatMessage(
          { id: 'pages.system.user.text.resetPasswordTitle' },
          { username: resetPwdRow?.username },
        )}
        open={resetPwdModalOpen}
        onOpenChange={(open) => {
          setResetPwdModalOpen(open);
          if (!open) setResetPwdRow(undefined);
        }}
        onFinish={handleResetPassword}
        modalProps={{
          destroyOnHidden: true,
          mask: { closable: false },
          width: 400,
        }}
      >
        <ProFormText.Password
          name="password"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.newPassword',
          })}
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
              max: 255,
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
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/,
              message: intl.formatMessage({
                id: 'pages.common.validation.passwordPattern',
              }),
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserList;
