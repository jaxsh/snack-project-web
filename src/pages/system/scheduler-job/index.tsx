import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  MoreOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useAccess, useIntl } from '@umijs/max';
import { App, Dropdown, Popconfirm, Space, Switch, Tag, theme } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  deleteSchedulerJobs,
  querySchedulerJobs,
  triggerSchedulerJob,
  updateSchedulerJob,
} from '@/services/system/scheduler-job';

import JobCreateForm from './components/JobCreateForm';
import JobEditForm from './components/JobEditForm';
import JobLogDrawer from './components/JobLogDrawer';

const SchedulerJobList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const intl = useIntl();
  const { canAccess } = useAccess();

  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [currentRecord, setCurrentRecord] =
    useState<API.SysSchedulerJobVO | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);

  const { mutate: updateStatusRun } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      updateSchedulerJob(id, { status } as API.SysSchedulerJobDTO),
    onMutate: ({ id }) => setStatusLoadingId(id),
    onSettled: () => setStatusLoadingId(null),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.save.success' }),
      );
      actionRef.current?.reload();
    },
  });

  const { mutate: deleteRun } = useMutation({
    mutationFn: (id: string | number) => deleteSchedulerJobs(id),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
      );
      actionRef.current?.reloadAndRest?.();
    },
  });

  const { mutate: batchDeleteRun, isPending: batchDeletePending } = useMutation(
    {
      mutationFn: (ids: string) => deleteSchedulerJobs(ids),
      onSuccess: () => {
        void message.success(
          intl.formatMessage({ id: 'pages.common.feedback.delete.success' }),
        );
        actionRef.current?.clearSelected?.();
        actionRef.current?.reloadAndRest?.();
      },
    },
  );

  const { mutate: triggerRun } = useMutation({
    mutationFn: (id: number) => triggerSchedulerJob(id),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({
          id: 'pages.system.schedulerJob.feedback.trigger.success',
        }),
      );
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
        if (key === 'jobName') {
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
      const response = await querySchedulerJobs({
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

  const columns: ProColumns<API.SysSchedulerJobVO>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.fields.jobName',
      }),
      dataIndex: 'jobName',
      key: 'jobName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.fields.cronExpression',
      }),
      dataIndex: 'cronExpression',
      key: 'cronExpression',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.fields.jobData',
      }),
      dataIndex: 'jobData',
      key: 'jobData',
      search: false,
      valueType: 'jsonCode',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.fields.status',
      }),
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
        if (!canAccess('sys:scheduler-job:status')) {
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
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.fields.description',
      }),
      dataIndex: 'description',
      key: 'description',
      search: false,
      ellipsis: true,
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
      render: (_, record) => {
        const dropdownItems = [
          canAccess('sys:scheduler-job:trigger') && {
            key: 'trigger',
            label: intl.formatMessage({
              id: 'pages.system.schedulerJob.action.trigger',
            }),
            icon: <PlayCircleOutlined />,
            onClick: () => {
              modal.confirm({
                title: intl.formatMessage({
                  id: 'pages.system.schedulerJob.trigger.confirm.title',
                }),
                content: intl.formatMessage(
                  {
                    id: 'pages.system.schedulerJob.trigger.confirm.description',
                  },
                  { name: record.jobName },
                ),
                okText: intl.formatMessage({ id: 'pages.common.action.ok' }),
                cancelText: intl.formatMessage({
                  id: 'pages.common.action.cancel',
                }),
                onOk: () => triggerRun(record.id),
              });
            },
          },
          canAccess('sys:scheduler-job:log') && {
            key: 'log',
            label: intl.formatMessage({
              id: 'pages.system.schedulerJob.action.log',
            }),
            icon: <HistoryOutlined />,
            onClick: () => {
              setCurrentRecord(record);
              setLogDrawerOpen(true);
            },
          },
        ].filter(Boolean) as any[];

        return (
          <Space size="middle">
            {canAccess('sys:scheduler-job:update') && (
              <JobEditForm
                trigger={
                  <a>
                    <EditOutlined style={{ marginRight: 4 }} />
                    {intl.formatMessage({ id: 'pages.common.action.edit' })}
                  </a>
                }
                record={record}
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
            )}
            {canAccess('sys:scheduler-job:delete') && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.common.action.confirmDelete',
                })}
                description={intl.formatMessage(
                  { id: 'pages.common.feedback.delete.confirm' },
                  { name: record.jobName },
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
      <ProTable<API.SysSchedulerJobVO>
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        toolBarRender={() =>
          [
            canAccess('sys:scheduler-job:create') && (
              <JobCreateForm
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
            {canAccess('sys:scheduler-job:delete') && (
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
      {logDrawerOpen && currentRecord && (
        <JobLogDrawer
          open={logDrawerOpen}
          onOpenChange={setLogDrawerOpen}
          record={currentRecord}
        />
      )}
    </PageContainer>
  );
};

export default SchedulerJobList;
