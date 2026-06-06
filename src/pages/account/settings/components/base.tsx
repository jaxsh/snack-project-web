import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { App, Button, Upload } from 'antd';
import React from 'react';
import { updateProfile } from '@/services/auth';
import useStyles from './index.style';

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

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
        birthday: values.birthday,
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
      message.success('更新基本信息成功');
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
              submitText: '更新基本信息',
            },
            render: (_, dom) => dom[1],
          }}
          initialValues={{
            nickname: currentUser?.nickname || currentUser?.username,
            realName: currentUser?.realName,
            gender: currentUser?.gender ?? 0,
            birthday: currentUser?.birthday,
          }}
          requiredMark={false}
        >
          <ProFormText
            width="md"
            name="nickname"
            label="昵称"
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          />
          <ProFormText width="md" name="realName" label="真实姓名" />
          <ProFormSelect
            width="md"
            name="gender"
            label="性别"
            options={[
              { value: 0, label: '未知' },
              { value: 1, label: '男' },
              { value: 2, label: '女' },
            ]}
          />
          <ProFormDatePicker width="md" name="birthday" label="生日" />
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

  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
};
