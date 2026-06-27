import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useAccess, useIntl } from '@umijs/max';
import { App, Popconfirm, Space, Switch, Tag, theme } from 'antd';
import React, { useRef, useState } from 'react';
import { deleteRoles, queryRoles, updateRole } from '@/services/system/role';
import ResourceAssignDrawer from './components/ResourceAssignDrawer';
import RoleCreateForm from './components/RoleCreateForm';
import RoleEditForm from './components/RoleEditForm';

const RoleList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const intl = useIntl();
  const { canAccess } = useAccess();

  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const { mutate: updateStatusRun } = useMutation({
    mutationFn: ({
      id,
      status,
      roleCode,
    }: {
      id: number;
      status: number;
      roleCode: string;
    }) => updateRole(id, { status, roleCode } as API.SysRoleDTO),
    onMutate: ({ id }) => setStatusLoadingId(id),
    onSettled: () => setStatusLoadingId(null),
    onSuccess: () => actionRef.current?.reload(),
  });

  const { mutate: deleteRun } = useMutation({
    mutationFn: (id: string | number) => deleteRoles(id),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
      );
      actionRef.current?.reloadAndRest?.();
    },
  });

  const { mutate: batchDeleteRun } = useMutation({
    mutationFn: (ids: string) => deleteRoles(ids),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
      );
      actionRef.current?.clearSelected?.();
      actionRef.current?.reloadAndRest?.();
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
        where[key] = ['roleName', 'roleCode'].includes(key)
          ? { _like: val }
          : { _eq: val };
      }
    }
    const orderBy = Object.entries(sort).map(([field, direction]) => ({
      field,
      direction: direction === 'ascend' ? ('asc' as const) : ('desc' as const),
    }));
    try {
      const response = await queryRoles({
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

  const statusValueEnum = {
    0: {
      text: intl.formatMessage({ id: 'pages.common.dict.status.disabled' }),
      status: 'Error',
    },
    1: {
      text: intl.formatMessage({ id: 'pages.common.dict.status.enabled' }),
      status: 'Success',
    },
  };

  const columns: ProColumns<API.SysRoleVO>[] = [
    {
      title: intl.formatMessage({ id: 'pages.system.role.fields.roleName' }),
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'pages.system.role.fields.roleCode' }),
      dataIndex: 'roleCode',
      key: 'roleCode',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.role.fields.roleDesc' }),
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      search: false,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.role.fields.status' }),
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: statusValueEnum,
      render: (_, record) => {
        if (!canAccess('sys:role:status')) {
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
              updateStatusRun({
                id: record.id,
                status: checked ? 1 : 0,
                roleCode: record.roleCode ?? '',
              })
            }
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.common.fields.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
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
          <RoleEditForm
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
          <ResourceAssignDrawer
            trigger={
              <a>
                <SafetyCertificateOutlined style={{ marginRight: 4 }} />
                {intl.formatMessage({
                  id: 'pages.system.role.action.assignResources',
                })}
              </a>
            }
            record={record}
          />
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.common.action.confirmDelete',
            })}
            description={intl.formatMessage(
              { id: 'pages.common.feedback.delete.confirm' },
              { name: record.roleName },
            )}
            onConfirm={() => deleteRun(record.id)}
            okText={intl.formatMessage({ id: 'pages.common.action.ok' })}
            cancelText={intl.formatMessage({
              id: 'pages.common.action.cancel',
            })}
          >
            <a style={{ color: token.colorError }}>
              <DeleteOutlined style={{ marginRight: 4 }} />
              {intl.formatMessage({ id: 'pages.common.action.delete' })}
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SysRoleVO>
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        toolBarRender={() => [
          <RoleCreateForm
            key="create"
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ]}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={16}>
            {canAccess('sys:role:delete') && (
              <a
                onClick={() => handleBatchDelete(selectedRowKeys)}
                style={{ color: token.colorError }}
              >
                <DeleteOutlined />{' '}
                {intl.formatMessage({ id: 'pages.common.action.batchDelete' })}
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

export default RoleList;
