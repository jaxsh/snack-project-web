import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App } from 'antd';
import type { FC, ReactElement } from 'react';
import { resetUserPassword } from '@/services/system/user';

interface Props {
  trigger: ReactElement;
  record: API.SysUserVO;
}

const ResetPasswordForm: FC<Props> = ({ trigger, record }) => {
  const { message } = App.useApp();
  const intl = useIntl();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: { password?: string }) =>
      resetUserPassword(record.id, { password: values.password }),
    onSuccess: () => {
      void message.success(
        intl.formatMessage({
          id: 'pages.system.user.feedback.resetPassword.success',
        }),
      );
    },
  });

  return (
    <ModalForm
      title={intl.formatMessage(
        { id: 'pages.system.user.text.resetPasswordTitle' },
        { username: record.username },
      )}
      trigger={trigger}
      modalProps={{
        destroyOnHidden: true,
        mask: { closable: false },
        width: 400,
      }}
      submitter={{ submitButtonProps: { loading: isPending } }}
      onFinish={async (values) => {
        try {
          await mutateAsync(values);
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormText.Password
        name="password"
        label={intl.formatMessage({
          id: 'pages.system.user.fields.newPassword',
        })}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.input' },
          {
            field: intl.formatMessage({
              id: 'pages.system.user.fields.newPassword',
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
                  id: 'pages.system.user.fields.newPassword',
                }),
              },
            ),
          },
          {
            min: 8,
            max: 255,
            message: intl.formatMessage(
              { id: 'pages.common.validation.rangeLength' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.user.fields.newPassword',
                }),
                min: 8,
                max: 255,
              },
            ),
          },
          {
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/,
            message: intl.formatMessage({
              id: 'pages.common.validation.passwordPattern',
            }),
          },
        ]}
      />
    </ModalForm>
  );
};

export default ResetPasswordForm;
