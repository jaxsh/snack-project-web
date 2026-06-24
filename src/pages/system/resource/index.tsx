import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useAccess, useIntl } from '@umijs/max';
import { App, Button, Popconfirm, Space, Switch, Tag, theme } from 'antd';
import React, { useRef } from 'react';
import { ICON_MAP } from '@/components/IconPicker';
import {
  deleteResources,
  getResourceTree,
  updateResource,
} from '@/services/system/resource';
import ResourceCreateForm from './components/ResourceCreateForm';
import ResourceEditForm from './components/ResourceEditForm';

const flattenTree = (
  nodes: API.TreeNode<API.SysResourceVO>[],
): (API.SysResourceVO & { children?: any[] })[] =>
  nodes.map((node) => ({
    ...node.data,
    children: node.children.length > 0 ? flattenTree(node.children) : undefined,
  }));

const ResourceList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const intl = useIntl();
  const { canAccess } = useAccess();

  const { mutate: updateStatusRun } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateResource(id, { status } as API.SysResourceDTO),
    onSuccess: () => {
      actionRef.current?.reload();
    },
  });

  const { mutate: deleteRun } = useMutation({
    mutationFn: (id: number) => deleteResources(id),
    onSuccess: () => {
      message.success(
        intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
      );
      actionRef.current?.reloadAndRest?.();
    },
  });

  const { mutate: batchDeleteRun, isPending: batchDeletePending } = useMutation(
    {
      mutationFn: (rows: (API.SysResourceVO & { children?: any[] })[]) => {
        const selectedIds = new Set(rows.map((r) => r.id));
        const topLevel = rows.filter(
          (r) => !selectedIds.has(r.parentId as number),
        );
        return deleteResources(topLevel.map((r) => r.id));
      },
      onSuccess: () => {
        actionRef.current?.clearSelected?.();
        actionRef.current?.reloadAndRest?.();
      },
    },
  );

  const typeTagMap: Record<number, { color: string; text: string }> = {
    0: {
      color: 'blue',
      text: intl.formatMessage({ id: 'pages.system.resource.type.menu' }),
    },
    1: {
      color: 'orange',
      text: intl.formatMessage({ id: 'pages.system.resource.type.button' }),
    },
    2: {
      color: 'purple',
      text: intl.formatMessage({ id: 'pages.system.resource.type.api' }),
    },
  };

  const columns: ProColumns<API.SysResourceVO & { children?: any[] }>[] = [
    {
      title: intl.formatMessage({ id: 'pages.system.resource.fields.name' }),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        const Icon = record.icon ? ICON_MAP[record.icon] : undefined;
        return (
          <Space size={4}>
            {Icon && React.createElement(Icon)}
            {record.name}
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.resource.fields.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (_, record) => {
        const tag = typeTagMap[record.type];
        return tag ? <Tag color={tag.color}>{tag.text}</Tag> : null;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.resource.fields.path' }),
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.resource.fields.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        if (!canAccess('sys:resource:status')) {
          const isEnabled = record.status === 1;
          return (
            <Tag color={isEnabled ? 'success' : 'error'}>
              {isEnabled
                ? intl.formatMessage({ id: 'pages.common.dict.status.enabled' })
                : intl.formatMessage({
                    id: 'pages.common.dict.status.disabled',
                  })}
            </Tag>
          );
        }
        return (
          <Switch
            size="small"
            checked={record.status === 1}
            onChange={(checked) => {
              if (!checked && record.children?.length) {
                modal.confirm({
                  title: intl.formatMessage({
                    id: 'pages.common.action.confirm',
                  }),
                  content: intl.formatMessage({
                    id: 'pages.system.resource.disableChildren.confirm',
                  }),
                  onOk: () => updateStatusRun({ id: record.id, status: 0 }),
                });
              } else {
                updateStatusRun({ id: record.id, status: checked ? 1 : 0 });
              }
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.common.action.columnLabel' }),
      valueType: 'option',
      key: 'option',
      onHeaderCell: () => ({ style: { whiteSpace: 'nowrap' as const } }),
      onCell: () => ({ style: { whiteSpace: 'nowrap' as const } }),
      render: (_, record) => (
        <Space size="middle">
          <ResourceEditForm
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
          {record.type === 0 && !record.component && (
            <ResourceCreateForm
              trigger={
                <a>
                  <PlusCircleOutlined style={{ marginRight: 4 }} />
                  {intl.formatMessage({
                    id: 'pages.system.resource.action.addChild',
                  })}
                </a>
              }
              parentId={record.id}
              onSuccess={() => {
                actionRef.current?.reloadAndRest?.();
              }}
            />
          )}
          {canAccess('sys:resource:delete') && (
            <Popconfirm
              title={intl.formatMessage({
                id: 'pages.common.action.confirmDelete',
              })}
              description={
                record.children?.length
                  ? intl.formatMessage({
                      id: 'pages.system.resource.action.deleteWithChildren',
                    })
                  : intl.formatMessage(
                      { id: 'pages.common.feedback.delete.confirm' },
                      { name: record.name },
                    )
              }
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
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SysResourceVO & { children?: any[] }>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={false}
        rowSelection={{ checkStrictly: false }}
        tableAlertOptionRender={({ selectedRows: rows, onCleanSelected }) => (
          <Space size={16}>
            {canAccess('sys:resource:delete') && (
              <a
                onClick={() =>
                  batchDeleteRun(
                    rows as (API.SysResourceVO & { children?: any[] })[],
                  )
                }
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
        toolBarRender={() => [
          <ResourceCreateForm
            key="create"
            onSuccess={() => {
              actionRef.current?.reloadAndRest?.();
            }}
          />,
        ]}
        request={async () => {
          try {
            const res = await getResourceTree();
            return {
              data: flattenTree(res.data || []),
              success: true,
              total: 0,
            };
          } catch {
            return { data: [], success: false, total: 0 };
          }
        }}
        columns={columns}
        scroll={{ x: 'max-content' }}
        cardBordered
        style={{ borderRadius: 8, overflow: 'hidden' }}
      />
    </PageContainer>
  );
};

export default ResourceList;
