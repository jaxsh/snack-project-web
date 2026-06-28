import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Drawer, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { querySchedulerJobLogs } from '@/services/system/scheduler-job';

interface JobLogDrawerProps {
  record: API.SysSchedulerJobVO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobLogDrawer: React.FC<JobLogDrawerProps> = ({
  record,
  open,
  onOpenChange,
}) => {
  const intl = useIntl();

  const handleTableRequest = async (
    params: any & { pageSize?: number; current?: number },
    sort: any,
  ) => {
    const { current, pageSize, ...searchParams } = params;

    const where: Record<string, any> = {
      jobId: { _eq: record.id },
    };
    for (const [key, val] of Object.entries(searchParams)) {
      if (val !== undefined && val !== null && val !== '') {
        where[key] = { _eq: val };
      }
    }

    const orderBy = Object.entries(sort).map(([field, direction]) => ({
      field,
      direction: direction === 'ascend' ? ('asc' as const) : ('desc' as const),
    }));

    if (orderBy.length === 0) {
      orderBy.push({ field: 'createTime', direction: 'desc' });
    }

    try {
      const response = await querySchedulerJobLogs({
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

  const columns: ProColumns<API.SysSchedulerJobLogVO>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.log.fields.status',
      }),
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: intl.formatMessage({ id: 'pages.common.dict.status.fail' }),
          status: 'Error',
        },
        1: {
          text: intl.formatMessage({ id: 'pages.common.dict.status.success' }),
          status: 'Success',
        },
      },
      render: (_, logRecord) => {
        if (logRecord.status === 1) {
          return (
            <Tag color="success">
              {intl.formatMessage({ id: 'pages.common.dict.status.success' })}
            </Tag>
          );
        }
        return (
          <Tag color="error">
            {intl.formatMessage({ id: 'pages.common.dict.status.fail' })}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.log.fields.duration',
      }),
      dataIndex: 'duration',
      key: 'duration',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.log.fields.createTime',
      }),
      dataIndex: 'createTime',
      key: 'createTime',
      search: false,
      render: (_, logRecord) =>
        logRecord.createTime
          ? dayjs(logRecord.createTime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.schedulerJob.log.fields.errorMessage',
      }),
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      search: false,
      render: (_, logRecord) => {
        if (!logRecord.errorMessage) return '-';
        return (
          <Typography.Paragraph
            copyable
            ellipsis={{
              rows: 1,
              expandable: 'collapsible',
            }}
            style={{
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '11px',
              margin: 0,
            }}
          >
            {logRecord.errorMessage}
          </Typography.Paragraph>
        );
      },
    },
  ];

  return (
    <Drawer
      title={intl.formatMessage(
        { id: 'pages.system.schedulerJob.log.drawerTitle' },
        { jobName: record.jobName },
      )}
      size={720}
      open={open}
      onClose={() => onOpenChange(false)}
    >
      {open && (
        <ProTable<API.SysSchedulerJobLogVO>
          rowKey="id"
          search={false}
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          request={handleTableRequest}
          columns={columns}
          cardBordered
        />
      )}
    </Drawer>
  );
};

export default JobLogDrawer;
