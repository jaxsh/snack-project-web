import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC } from 'react';
import { createRole } from '@/services/system/role';

interface Props {
  onSuccess?: () => void;
}

const RoleCreateForm: FC<Props> = ({ onSuccess }) => {
  const { message } = App.useApp();
  const intl = useIntl();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) =>
      createRole({
        roleName: values.roleName,
        roleCode: values.roleCode,
        roleDesc: values.roleDesc,
        status: values.status ? 1 : 0,
      }),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.create.success' }),
      );
      onSuccess?.();
    },
  });

  return (
    <DrawerForm
      title={intl.formatMessage({ id: 'pages.common.action.create' })}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'pages.common.action.create' })}
        </Button>
      }
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
        name="roleName"
        label={intl.formatMessage({ id: 'pages.system.role.fields.roleName' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'pages.common.validation.required' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.role.fields.roleName',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormText
        name="roleCode"
        label={intl.formatMessage({ id: 'pages.system.role.fields.roleCode' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'pages.common.validation.required' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.role.fields.roleCode',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormTextArea
        name="roleDesc"
        label={intl.formatMessage({ id: 'pages.system.role.fields.roleDesc' })}
      />
      <ProFormSwitch
        name="status"
        label={intl.formatMessage({ id: 'pages.system.role.fields.status' })}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
      />
    </DrawerForm>
  );
};

export default RoleCreateForm;
