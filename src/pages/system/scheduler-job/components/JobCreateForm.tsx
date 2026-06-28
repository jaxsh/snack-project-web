import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormField,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button } from 'antd';
import React, { useState } from 'react';
import { createSchedulerJob } from '@/services/system/scheduler-job';

interface JobCreateFormProps {
  onSuccess: () => void;
}

const JobCreateForm: React.FC<JobCreateFormProps> = ({ onSuccess }) => {
  const intl = useIntl();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const { mutateAsync: createRun, isPending } = useMutation({
    mutationFn: (values: any) =>
      createSchedulerJob({
        ...values,
        status: values.status ? 1 : 0,
      }),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.create.success' }),
      );
      onSuccess();
    },
  });

  const handleFinish = async (values: any) => {
    try {
      await createRun(values);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <DrawerForm
      title={intl.formatMessage({ id: 'pages.common.action.create' })}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'pages.common.action.create' })}
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      submitter={{
        render: (props, defaultDoms) => [
          <Button key="reset" onClick={() => props.reset()}>
            {intl.formatMessage({ id: 'pages.common.action.reset' })}
          </Button>,
          defaultDoms[1],
        ],
        submitButtonProps: { loading: isPending },
      }}
      resize={{ minWidth: 400, maxWidth: window.innerWidth * 0.8 }}
      drawerProps={{ destroyOnHidden: true, closable: { placement: 'end' } }}
      initialValues={{ status: true }}
      onFinish={handleFinish}
    >
      <ProFormText
        name="jobName"
        label={intl.formatMessage({
          id: 'pages.system.schedulerJob.fields.jobName',
        })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.schedulerJob.fields.jobName',
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
                  id: 'pages.system.schedulerJob.fields.jobName',
                }),
              },
            ),
          },
          { max: 100 },
        ]}
      />
      <ProFormText
        name="jobClassName"
        label={intl.formatMessage({
          id: 'pages.system.schedulerJob.fields.jobClassName',
        })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.schedulerJob.fields.jobClassName',
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
                  id: 'pages.system.schedulerJob.fields.jobClassName',
                }),
              },
            ),
          },
          { max: 255 },
        ]}
      />
      <ProFormText
        name="cronExpression"
        label={intl.formatMessage({
          id: 'pages.system.schedulerJob.fields.cronExpression',
        })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.schedulerJob.fields.cronExpression',
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
                  id: 'pages.system.schedulerJob.fields.cronExpression',
                }),
              },
            ),
          },
          { max: 100 },
        ]}
      />
      <ProFormField
        name="jobData"
        valueType="code"
        label={intl.formatMessage({
          id: 'pages.system.schedulerJob.fields.jobData',
        })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.schedulerJob.fields.jobData',
            }),
          },
        )}
        rules={[
          {
            validator: (_: any, value: string) => {
              if (!value) return Promise.resolve();
              try {
                JSON.parse(value);
                return Promise.resolve();
              } catch {
                return Promise.reject(
                  new Error(
                    intl.formatMessage({
                      id: 'pages.common.validation.json',
                    }),
                  ),
                );
              }
            },
          },
        ]}
      />
      <ProFormSwitch
        name="status"
        label={intl.formatMessage({
          id: 'pages.system.schedulerJob.fields.status',
        })}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
      />
      <ProFormTextArea
        name="description"
        label={intl.formatMessage({
          id: 'pages.system.schedulerJob.fields.description',
        })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.schedulerJob.fields.description',
            }),
          },
        )}
        rules={[{ max: 500 }]}
      />
    </DrawerForm>
  );
};

export default JobCreateForm;
