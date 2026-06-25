import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC, ReactElement } from 'react';
import { updateRole } from '@/services/system/role';

interface Props {
  trigger: ReactElement;
  record: API.SysRoleVO;
  onOk?: () => void;
}

const RoleEditForm: FC<Props> = ({ trigger, record, onOk }) => {
  const { message } = App.useApp();
  const intl = useIntl();

  const statusOptions = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'pages.common.dict.status.enabled' }),
    },
    {
      value: 0,
      label: intl.formatMessage({ id: 'pages.common.dict.status.disabled' }),
    },
  ];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) =>
      updateRole(record.id, {
        roleName: values.roleName,
        roleCode: record.roleCode,
        roleDesc: values.roleDesc,
        status: values.status,
      }),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
      );
      onOk?.();
    },
  });

  return (
    <DrawerForm
      title={intl.formatMessage({ id: 'pages.common.action.edit' })}
      trigger={trigger}
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
      initialValues={{
        roleName: record.roleName,
        roleCode: record.roleCode,
        roleDesc: record.roleDesc,
        status: record.status ?? 1,
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
        disabled
      />
      <ProFormTextArea
        name="roleDesc"
        label={intl.formatMessage({ id: 'pages.system.role.fields.roleDesc' })}
      />
      <ProFormSelect
        name="status"
        label={intl.formatMessage({ id: 'pages.system.role.fields.status' })}
        options={statusOptions}
      />
    </DrawerForm>
  );
};

export default RoleEditForm;
