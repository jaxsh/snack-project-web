import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button, Form } from 'antd';
import type { FC, ReactElement } from 'react';
import { useState } from 'react';
import IconPicker from '@/components/IconPicker';
import { createResource } from '@/services/system/resource';

interface Props {
  trigger?: ReactElement;
  parentId?: number;
  onSuccess?: () => void;
}

const ResourceCreateForm: FC<Props> = ({ trigger, parentId, onSuccess }) => {
  const { message } = App.useApp();
  const intl = useIntl();

  const isRoot = parentId === undefined;
  const [formType, setFormType] = useState<number | undefined>(
    isRoot ? 0 : undefined,
  );

  const typeOptions = [
    {
      value: 0,
      label: intl.formatMessage({ id: 'pages.system.resource.type.menu' }),
    },
    {
      value: 1,
      label: intl.formatMessage({ id: 'pages.system.resource.type.button' }),
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'pages.system.resource.type.api' }),
    },
  ];

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
  ];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) =>
      createResource({
        ...values,
        parentId: parentId ?? 0,
        type: isRoot ? 0 : values.type,
        status: values.status ? 1 : 0,
        visible: values.visible ? 1 : 0,
      } as API.SysResourceDTO),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.create.success' }),
      );
      onSuccess?.();
    },
  });

  const defaultTrigger = (
    <Button type="primary" icon={<PlusOutlined />}>
      {intl.formatMessage({ id: 'pages.common.action.create' })}
    </Button>
  );

  return (
    <DrawerForm
      title={intl.formatMessage({ id: 'pages.common.action.create' })}
      trigger={trigger ?? defaultTrigger}
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
      drawerProps={{
        destroyOnHidden: true,
        closable: { placement: 'end' },
      }}
      initialValues={{ status: true, visible: true }}
      onOpenChange={(open) => {
        if (!open) setFormType(isRoot ? 0 : undefined);
      }}
      onFinish={async (values) => {
        try {
          await mutateAsync(values);
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label={intl.formatMessage({ id: 'pages.system.resource.fields.name' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'pages.common.validation.required' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.resource.fields.name',
                }),
              },
            ),
          },
        ]}
      />
      {!isRoot && (
        <ProFormRadio.Group
          name="type"
          label={intl.formatMessage({
            id: 'pages.system.resource.fields.type',
          })}
          options={typeOptions}
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: 'pages.common.validation.required' },
                {
                  field: intl.formatMessage({
                    id: 'pages.system.resource.fields.type',
                  }),
                },
              ),
            },
          ]}
          fieldProps={{
            onChange: (e) => setFormType(e.target.value as number),
          }}
        />
      )}
      {formType === 0 && (
        <>
          <ProFormText
            name="path"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.path',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pages.common.validation.required' },
                  {
                    field: intl.formatMessage({
                      id: 'pages.system.resource.fields.path',
                    }),
                  },
                ),
              },
            ]}
          />
          <ProFormText
            name="component"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.component',
            })}
          />
          <Form.Item
            name="icon"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.icon',
            })}
          >
            <IconPicker />
          </Form.Item>
          <ProFormDigit
            name="sortOrder"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.sortOrder',
            })}
            min={0}
          />
          <ProFormSwitch
            name="visible"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.visible',
            })}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        </>
      )}
      {formType === 1 && (
        <ProFormText
          name="permission"
          label={intl.formatMessage({
            id: 'pages.system.resource.fields.permission',
          })}
        />
      )}
      {formType === 2 && (
        <>
          <ProFormText
            name="path"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.path',
            })}
          />
          <ProFormSelect
            name="method"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.method',
            })}
            options={methodOptions}
          />
        </>
      )}
      <ProFormSwitch
        name="status"
        label={intl.formatMessage({
          id: 'pages.system.resource.fields.status',
        })}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
      />
    </DrawerForm>
  );
};

export default ResourceCreateForm;
