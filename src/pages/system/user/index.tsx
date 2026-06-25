import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  LockOutlined,
  LogoutOutlined,
  MoreOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useAccess, useIntl } from '@umijs/max';
import {
  App,
  Avatar,
  Dropdown,
  Popconfirm,
  Space,
  Switch,
  Tag,
  theme,
} from 'antd';
import React, { useRef } from 'react';
import {
  deleteUsers,
  queryUsers,
  revokeUserTokens,
  unlockUser,
  updateUser,
} from '@/services/system/user';
import ResetPasswordForm from './components/ResetPasswordForm';
import UserCreateForm from './components/UserCreateForm';
import UserEditForm from './components/UserEditForm';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const intl = useIntl();
  const { canAccess } = useAccess();

  const { mutate: updateStatusRun } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateUser(id, { status } as API.SysUserDTO),
    onSuccess: () => actionRef.current?.reload(),
  });

  const { mutate: deleteRun } = useMutation({
    mutationFn: (id: string | number) => deleteUsers(id),
    onSuccess: () => {
      message.success(
        intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
      );
      actionRef.current?.reloadAndRest?.();
    },
  });

  const { mutate: batchDeleteRun, isPending: batchDeletePending } = useMutation(
    {
      mutationFn: (ids: string) => deleteUsers(ids),
      onSuccess: () => {
        message.success(
          intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
        );
        actionRef.current?.clearSelected?.();
        actionRef.current?.reloadAndRest?.();
      },
    },
  );

  const { mutate: unlockRun } = useMutation({
    mutationFn: (id: number) => unlockUser(id),
    onSuccess: () => {
      message.success(
        intl.formatMessage({ id: 'pages.system.user.feedback.unlock.success' }),
      );
      actionRef.current?.reload();
    },
  });

  const { mutate: revokeRun } = useMutation({
    mutationFn: (id: number) => revokeUserTokens(id),
    onSuccess: () => {
      message.success(
        intl.formatMessage({ id: 'pages.system.user.feedback.revoke.success' }),
      );
      actionRef.current?.reload();
    },
  });

  const { mutate: resetMfaRun } = useMutation({
    mutationFn: (id: number) =>
      updateUser(id, { mfaEnabled: 0 } as API.SysUserDTO),
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'pages.system.user.feedback.resetMfa.success',
        }),
      );
      actionRef.current?.reload();
    },
  });

  const handleTableRequest = async (
    params: any & { pageSize?: number; current?: number },
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
    } catch {
      return { data: [], success: false, total: 0 };
    }
  };

  const handleBatchDelete = (selectedRowKeys: React.Key[]) => {
    if (!selectedRowKeys.length) return;
    modal.confirm({
      title: intl.formatMessage({ id: 'pages.common.action.confirmDelete' }),
      content: intl.formatMessage(
        { id: 'pages.common.feedback.batchDelete.confirm' },
        { count: selectedRowKeys.length },
      ),
      okText: intl.formatMessage({ id: 'pages.common.action.ok' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'pages.common.action.cancel' }),
      onOk: () => batchDeleteRun(selectedRowKeys.join(',')),
    });
  };

  const columns: ProColumns<API.SysUserVO>[] = [
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.avatar' }),
      dataIndex: 'avatar',
      key: 'avatar',
      search: false,
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
      search: false,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.gender' }),
      dataIndex: 'gender',
      key: 'gender',
      search: false,
      hideInTable: true,
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
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.email' }),
      dataIndex: 'email',
      key: 'email',
      hideInTable: true,
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
        if (!canAccess('sys:user:status')) {
          const isEnabled = record.status === 1;
          return (
            <Tag color={isEnabled ? 'success' : 'error'}>
              {record.statusLabel ||
                (isEnabled
                  ? intl.formatMessage({
                      id: 'pages.common.dict.status.enabled',
                    })
                  : intl.formatMessage({
                      id: 'pages.common.dict.status.disabled',
                    }))}
            </Tag>
          );
        }
        return (
          <Switch
            size="small"
            checked={record.status === 1}
            onChange={(checked) =>
              updateStatusRun({ id: record.id, status: checked ? 1 : 0 })
            }
          />
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
      hideInTable: true,
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
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' as const } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' as const } }),
      render: (_, record) => (
        <Space size="middle">
          <UserEditForm
            trigger={
              <a>
                <EditOutlined style={{ marginRight: 4 }} />
                {intl.formatMessage({ id: 'pages.common.action.edit' })}
              </a>
            }
            record={record}
            onOk={() => {
              actionRef.current?.reload();
            }}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'resetPwd',
                  label: (
                    <ResetPasswordForm
                      trigger={
                        <span>
                          {intl.formatMessage({
                            id: 'pages.system.user.action.resetPassword',
                          })}
                        </span>
                      }
                      record={record}
                    />
                  ),
                  icon: <KeyOutlined />,
                },
                {
                  key: 'unlock',
                  label: intl.formatMessage({
                    id: 'pages.system.user.action.unlock',
                  }),
                  icon: <UnlockOutlined />,
                  onClick: () => unlockRun(record.id),
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
                      onConfirm={() => resetMfaRun(record.id)}
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
                  onClick: () => revokeRun(record.id),
                },
                { type: 'divider' },
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
                      onConfirm={() => deleteRun(record.id)}
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

  return (
    <PageContainer>
      <ProTable<API.SysUserVO>
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        toolBarRender={() => [
          <UserCreateForm
            key="create"
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ]}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={16}>
            {canAccess('sys:user:delete') && (
              <a
                onClick={() => handleBatchDelete(selectedRowKeys)}
                style={{ color: token.colorError }}
              >
                <DeleteOutlined />{' '}
                {intl.formatMessage({ id: 'pages.common.action.batchDelete' })}
                {batchDeletePending && '...'}
              </a>
            )}
            <a onClick={onCleanSelected}>
              {intl.formatMessage({ id: 'pages.common.action.clearSelection' })}
            </a>
          </Space>
        )}
        request={handleTableRequest}
        columns={columns}
        rowSelection={{}}
        scroll={{ x: 'max-content' }}
        cardBordered
        style={{ borderRadius: 8, overflow: 'hidden' }}
      />
    </PageContainer>
  );
};

export default UserList;
