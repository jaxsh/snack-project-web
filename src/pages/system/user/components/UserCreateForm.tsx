import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button } from 'antd';
import type { FC } from 'react';
import { getAllRoles } from '@/services/system/role';
import { createUser } from '@/services/system/user';

interface Props {
  onSuccess?: () => void;
}

const INITIAL_VALUES = { gender: 0, status: true };

const UserCreateForm: FC<Props> = ({ onSuccess }) => {
  const { message } = App.useApp();
  const intl = useIntl();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) =>
      createUser({
        ...values,
        status: values.status ? 1 : 0,
        birthday: values.birthday || null,
        remark: values.remark || null,
        expireDate: values.expireDate || null,
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
      initialValues={INITIAL_VALUES}
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
        name="username"
        label={intl.formatMessage({ id: 'pages.system.user.fields.username' })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.user.fields.username',
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
                  id: 'pages.system.user.fields.username',
                }),
              },
            ),
          },
          {
            min: 2,
            max: 64,
            message: intl.formatMessage(
              { id: 'pages.common.validation.rangeLength' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.username',
                }),
                min: 2,
                max: 64,
              },
            ),
          },
        ]}
      />
      <ProFormText
        name="realName"
        label={intl.formatMessage({ id: 'pages.system.user.fields.realName' })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.user.fields.realName',
            }),
          },
        )}
        rules={[
          {
            max: 50,
            message: intl.formatMessage(
              { id: 'pages.common.validation.maxLength' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.realName',
                }),
                max: 50,
              },
            ),
          },
        ]}
      />
      <ProFormText
        name="nickname"
        label={intl.formatMessage({ id: 'pages.system.user.fields.nickname' })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.user.fields.nickname',
            }),
          },
        )}
        rules={[
          {
            max: 50,
            message: intl.formatMessage(
              { id: 'pages.common.validation.maxLength' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.nickname',
                }),
                max: 50,
              },
            ),
          },
        ]}
      />
      <ProFormRadio.Group
        name="gender"
        label={intl.formatMessage({ id: 'pages.system.user.fields.gender' })}
        options={[
          {
            value: 0,
            label: intl.formatMessage({
              id: 'pages.common.dict.gender.unknown',
            }),
          },
          {
            value: 1,
            label: intl.formatMessage({ id: 'pages.common.dict.gender.male' }),
          },
          {
            value: 2,
            label: intl.formatMessage({
              id: 'pages.common.dict.gender.female',
            }),
          },
        ]}
      />
      <ProFormDatePicker
        name="birthday"
        label={intl.formatMessage({ id: 'pages.system.user.fields.birthday' })}
      />
      <ProFormText
        name="mobile"
        label={intl.formatMessage({ id: 'pages.system.user.fields.mobile' })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.user.fields.mobile',
            }),
          },
        )}
        rules={[
          {
            pattern: /^1[3-9]\d{9}$/,
            message: intl.formatMessage(
              { id: 'pages.common.validation.invalid' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.mobile',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormText
        name="email"
        label={intl.formatMessage({ id: 'pages.system.user.fields.email' })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({ id: 'pages.system.user.fields.email' }),
          },
        )}
        rules={[
          {
            type: 'email',
            message: intl.formatMessage(
              { id: 'pages.common.validation.invalid' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.email',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormSwitch
        name="status"
        label={intl.formatMessage({ id: 'pages.common.fields.status' })}
        checkedChildren={intl.formatMessage({
          id: 'pages.common.dict.status.enabled',
        })}
        unCheckedChildren={intl.formatMessage({
          id: 'pages.common.dict.status.disabled',
        })}
      />
      <ProFormDatePicker
        name="expireDate"
        label={intl.formatMessage({
          id: 'pages.system.user.fields.expireDate',
        })}
        fieldProps={{ allowClear: true }}
        tooltip={intl.formatMessage({
          id: 'pages.system.user.fields.expireDateTip',
        })}
      />
      <ProFormTextArea
        name="remark"
        label={intl.formatMessage({ id: 'pages.common.fields.remark' })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.common.fields.remark',
            }),
          },
        )}
        rules={[
          {
            max: 500,
            message: intl.formatMessage(
              { id: 'pages.common.validation.maxLength' },
              {
                field: intl.formatMessage({
                  id: 'pages.common.fields.remark',
                }),
                max: 500,
              },
            ),
          },
        ]}
      />
      <ProFormSelect
        name="roleCodes"
        label={intl.formatMessage({ id: 'pages.system.user.fields.roleCodes' })}
        mode="multiple"
        fieldProps={{ optionFilterProp: 'label' }}
        request={async () => {
          const res = await getAllRoles();
          return (
            res.data?.records?.map((r) => ({
              label: r.roleName,
              value: r.roleCode,
            })) ?? []
          );
        }}
      />
    </DrawerForm>
  );
};

export default UserCreateForm;
