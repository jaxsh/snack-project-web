import {
  CheckOutlined,
  CloseOutlined,
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
  Space,
  Switch,
  Tag,
  Typography,
  theme,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  deleteUsers,
  queryUsers,
  revokeUserSession,
  unlockUser,
  updateUser,
} from '@/services/system/user';
import ResetPasswordForm from './components/ResetPasswordForm';
import UserCreateForm from './components/UserCreateForm';
import UserDetailDrawer from './components/UserDetailDrawer';
import UserEditForm from './components/UserEditForm';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const intl = useIntl();
  const { canAccess } = useAccess();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.SysUserVO | null>(
    null,
  );
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const { mutate: updateStatusRun } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateUser(id, { status } as API.SysUserDTO),
    onMutate: ({ id }) => setStatusLoadingId(id),
    onSettled: () => setStatusLoadingId(null),
    onSuccess: () => actionRef.current?.reload(),
  });

  const { mutate: deleteRun } = useMutation({
    mutationFn: (id: string | number) => deleteUsers(id),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
      );
      actionRef.current?.reloadAndRest?.();
    },
  });

  const { mutate: batchDeleteRun, isPending: batchDeletePending } = useMutation(
    {
      mutationFn: (ids: string) => deleteUsers(ids),
      onSuccess: () => {
        void message.success(
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
      void message.success(
        intl.formatMessage({ id: 'pages.system.user.feedback.unlock.success' }),
      );
      actionRef.current?.reload();
    },
  });

  const { mutate: revokeRun } = useMutation({
    mutationFn: (id: number) => revokeUserSession(id),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.system.user.feedback.revoke.success' }),
      );
      actionRef.current?.reload();
    },
  });

  const { mutate: resetMfaRun } = useMutation({
    mutationFn: (id: number) =>
      updateUser(id, { mfaEnabled: 0 } as API.SysUserDTO),
    onSuccess: () => {
      void message.success(
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
      sorter: true,
      render: (_, record) => (
        <Space size={4}>
          {canAccess('sys:user:detail') ? (
            <UserDetailDrawer
              record={record}
              trigger={
                <a onClick={(e) => e.stopPropagation()}>{record.username}</a>
              }
            />
          ) : (
            <span>{record.username}</span>
          )}
          <Typography.Text
            copyable={{ text: record.username }}
            style={{ color: token.colorTextDescription }}
          />
        </Space>
      ),
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
      hideInTable: true,
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.user.fields.gender' }),
      dataIndex: 'gender',
      key: 'gender',
      hideInTable: true,
      search: false,
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
      title: intl.formatMessage({ id: 'pages.common.fields.status' }),
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
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={record.status === 1}
            loading={statusLoadingId === record.id}
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
      search: false,
      render: (_, record) => {
        if (!record.sessions || record.sessions.length === 0) {
          return '-';
        }
        let latest = dayjs(record.sessions[0].lastRequest);
        for (let i = 1; i < record.sessions.length; i++) {
          const time = dayjs(record.sessions[i].lastRequest);
          if (time.isAfter(latest)) {
            latest = time;
          }
        }
        return latest.format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.common.action.columnLabel' }),
      valueType: 'option',
      key: 'option',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' as const } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' as const } }),
      render: (_, record) => {
        const dropdownItems = [
          canAccess('sys:user:reset-password') && {
            key: 'resetPassword',
            label: intl.formatMessage({
              id: 'pages.system.user.action.resetPassword',
            }),
            icon: <KeyOutlined />,
            onClick: () => {
              setCurrentRecord(record);
              setResetPasswordOpen(true);
            },
          },
          canAccess('sys:user:unlock') && {
            key: 'unlock',
            label: intl.formatMessage({
              id: 'pages.system.user.action.unlock',
            }),
            icon: <UnlockOutlined />,
            onClick: () => unlockRun(record.id),
          },
          canAccess('sys:user:reset-mfa') && {
            key: 'resetMfa',
            label: intl.formatMessage({
              id: 'pages.system.user.action.resetMfa',
            }),
            icon: <LockOutlined />,
            onClick: () => {
              modal.confirm({
                title: intl.formatMessage({
                  id: 'pages.system.user.action.resetMfa',
                }),
                content: intl.formatMessage(
                  { id: 'pages.system.user.text.resetMfaConfirm' },
                  { name: record.username },
                ),
                okText: intl.formatMessage({ id: 'pages.common.action.ok' }),
                cancelText: intl.formatMessage({
                  id: 'pages.common.action.cancel',
                }),
                onOk: () => resetMfaRun(record.id),
              });
            },
          },
          canAccess('sys:user:revoke-session') && {
            key: 'revokeTokens',
            label: intl.formatMessage({
              id: 'pages.system.user.action.revoke',
            }),
            icon: <LogoutOutlined />,
            danger: true,
            disabled: !record.sessions || record.sessions.length === 0,
            onClick: () => revokeRun(record.id),
          },
          (canAccess('sys:user:reset-password') ||
            canAccess('sys:user:unlock') ||
            canAccess('sys:user:reset-mfa') ||
            canAccess('sys:user:revoke-session')) &&
            canAccess('sys:user:delete') && { type: 'divider' as const },
          canAccess('sys:user:delete') && {
            key: 'delete',
            label: intl.formatMessage({
              id: 'pages.common.action.delete',
            }),
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              modal.confirm({
                title: intl.formatMessage({
                  id: 'pages.common.action.confirmDelete',
                }),
                content: intl.formatMessage(
                  { id: 'pages.common.feedback.delete.confirm' },
                  { name: record.username },
                ),
                okText: intl.formatMessage({ id: 'pages.common.action.ok' }),
                okType: 'danger',
                cancelText: intl.formatMessage({
                  id: 'pages.common.action.cancel',
                }),
                onOk: () => deleteRun(record.id),
              });
            },
          },
        ].filter(Boolean) as any[];

        return (
          <Space size="middle">
            {canAccess('sys:user:update') && (
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
            )}
            {dropdownItems.length > 0 && (
              <Dropdown menu={{ items: dropdownItems }}>
                <a onClick={(e) => e.preventDefault()}>
                  <MoreOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
                </a>
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SysUserVO>
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        toolBarRender={() =>
          [
            canAccess('sys:user:create') && (
              <UserCreateForm
                key="create"
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
            ),
          ].filter(Boolean) as React.ReactNode[]
        }
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={16}>
            {canAccess('sys:user:batch-delete') && (
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
      {resetPasswordOpen && currentRecord && (
        <ResetPasswordForm
          open={resetPasswordOpen}
          onOpenChange={setResetPasswordOpen}
          record={currentRecord}
        />
      )}
    </PageContainer>
  );
};

export default UserList;
