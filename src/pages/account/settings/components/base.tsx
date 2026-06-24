import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { App, Button, Upload } from 'antd';
import React from 'react';
import { updateProfile } from '@/services/auth';
import useStyles from './index.style';

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const intl = useIntl();
  const fmt = (id: string) => intl.formatMessage({ id });

  const getAvatarURL = () => {
    if (currentUser?.avatar) {
      return currentUser.avatar;
    }
    return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  };

  const handleFinish = async (values: any) => {
    if (!currentUser?.id) {
      return;
    }
    try {
      await updateProfile({
        nickname: values.nickname,
        realName: values.realName,
        gender: values.gender,
        birthday: values.birthday || null,
      });
      setInitialState((s) => {
        if (!s) return s;
        return {
          ...s,
          currentUser: {
            ...s.currentUser,
            nickname: values.nickname,
            realName: values.realName,
            gender: values.gender,
            birthday: values.birthday,
          } as API.SysUserVO,
        };
      });
      message.success(fmt('pages.common.feedback.save.success'));
    } catch {
      return;
    }
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <ProForm
          layout="vertical"
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: fmt('pages.common.action.save'),
            },
            render: (_, dom) => dom[1],
          }}
          request={async () => ({
            nickname: currentUser?.nickname || currentUser?.username,
            realName: currentUser?.realName,
            gender: currentUser?.gender ?? 0,
            birthday: currentUser?.birthday,
          })}
          requiredMark={false}
        >
          <ProFormText
            width="md"
            name="nickname"
            label={fmt('pages.base.fields.nickname')}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pages.common.validation.required' },
                  { field: fmt('pages.base.fields.nickname') },
                ),
              },
            ]}
          />
          <ProFormText
            width="md"
            name="realName"
            label={fmt('pages.base.fields.realName')}
          />
          <ProFormSelect
            width="md"
            name="gender"
            label={fmt('pages.common.dict.gender.label')}
            options={[
              { value: 0, label: fmt('pages.common.dict.gender.unknown') },
              { value: 1, label: fmt('pages.common.dict.gender.male') },
              { value: 2, label: fmt('pages.common.dict.gender.female') },
            ]}
          />
          <ProFormDatePicker
            width="md"
            name="birthday"
            label={fmt('pages.base.fields.birthday')}
          />
        </ProForm>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
};

export default BaseView;

const AvatarView = ({ avatar }: { avatar: string }) => {
  const { styles } = useStyles();
  const intl = useIntl();
  const fmt = (id: string) => intl.formatMessage({ id });

  return (
    <>
      <div className={styles.avatar_title}>
        {fmt('pages.base.text.avatarTitle')}
      </div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            {fmt('pages.base.action.changeAvatar')}
          </Button>
        </div>
      </Upload>
    </>
  );
};
