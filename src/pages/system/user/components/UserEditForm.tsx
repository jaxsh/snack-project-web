import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
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
import { App, Button, Descriptions, Tag } from 'antd';
import {
  cloneElement,
  type FC,
  type ReactElement,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getAllRoles } from '@/services/system/role';
import { updateUser } from '@/services/system/user';

interface Props {
  trigger: ReactElement<{ onClick?: () => void }>;
  record: API.SysUserVO;
  onOk?: () => void;
}

const UserEditForm: FC<Props> = ({ trigger, record, onOk }) => {
  const { message } = App.useApp();
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string; status: number }[]
  >([]);
  const rolesFetchedRef = useRef(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) =>
      updateUser(record.id, {
        ...values,
        status: values.status ? 1 : 0,
        birthday: values.birthday || null,
        remark: values.remark || null,
        expireDate: values.expireDate || null,
      }),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
      );
      onOk?.();
    },
  });

  const initialValues = useMemo(
    () => ({
      username: record.username,
      realName: record.realName,
      nickname: record.nickname,
      gender: record.gender ?? 0,
      birthday: record.birthday,
      mobile: record.mobile,
      email: record.email,
      expireDate: record.expireDate,
      status: (record.status ?? 1) === 1,
      remark: record.remark,
      roleCodes: record.roleCodes,
    }),
    [record.id],
  );

  const handleTriggerClick = async () => {
    if (!rolesFetchedRef.current) {
      rolesFetchedRef.current = true;
      const res = await getAllRoles();
      setRoleOptions(
        res.data?.records?.map((r) => ({
          label: r.roleName ?? r.roleCode ?? '',
          value: r.roleCode ?? '',
          status: r.status ?? 1,
        })) ?? [],
      );
    }
    setOpen(true);
  };

  return (
    <>
      {cloneElement(trigger, { onClick: handleTriggerClick })}
      <DrawerForm
        title={intl.formatMessage({ id: 'pages.common.action.edit' })}
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
        initialValues={initialValues}
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
          label={intl.formatMessage({
            id: 'pages.system.user.fields.username',
          })}
          disabled
        />
        <ProFormText
          name="realName"
          label={intl.formatMessage({
            id: 'pages.system.user.fields.realName',
          })}
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
          label={intl.formatMessage({
            id: 'pages.system.user.fields.nickname',
          })}
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
              label: intl.formatMessage({
                id: 'pages.common.dict.gender.male',
              }),
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
          label={intl.formatMessage({
            id: 'pages.system.user.fields.birthday',
          })}
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
              field: intl.formatMessage({
                id: 'pages.system.user.fields.email',
              }),
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
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
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
          label={intl.formatMessage({
            id: 'pages.system.user.fields.roleCodes',
          })}
          mode="multiple"
          options={roleOptions}
          fieldProps={{
            optionFilterProp: 'label',
            optionRender: (option) => (
              <span style={{ fontWeight: 'normal' }}>
                {option.label}
                {option.data.status === 0 && (
                  <Tag style={{ marginLeft: 6 }}>禁用</Tag>
                )}
              </span>
            ),
          }}
        />
        {record.oauthVO && (
          <Descriptions
            title={intl.formatMessage({
              id: 'pages.system.user.text.authInfoTitle',
            })}
            column={1}
            size="small"
            style={{ marginTop: 8 }}
          >
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.system.user.fields.locked',
              })}
            >
              {record.oauthVO.lockedLabel ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.system.user.fields.initialPassword',
              })}
            >
              {record.oauthVO.initialPasswordLabel ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.system.user.fields.mfaEnabled',
              })}
            >
              {record.oauthVO.mfaEnabled === 1
                ? intl.formatMessage({ id: 'pages.common.dict.yesNo.yes' })
                : intl.formatMessage({ id: 'pages.common.dict.yesNo.no' })}
            </Descriptions.Item>
          </Descriptions>
        )}
      </DrawerForm>
    </>
  );
};

export default UserEditForm;
