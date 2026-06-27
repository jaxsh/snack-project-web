import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { App, Avatar, Button, Col, Flex, Row, Typography, Upload } from 'antd';
import React, { useMemo } from 'react';
import { updateProfile } from '@/services/auth';

const BaseView: React.FC = () => {
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

  const initialValues = useMemo(
    () => ({
      nickname: currentUser?.nickname || currentUser?.username,
      realName: currentUser?.realName,
      gender: currentUser?.gender ?? 0,
      birthday: currentUser?.birthday,
    }),
    [currentUser?.id],
  );

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
      void message.success(fmt('pages.common.feedback.save.success'));
    } catch {
      return;
    }
  };

  return (
    <div style={{ paddingTop: 12 }}>
      <Row gutter={[48, 24]}>
        <Col xs={24} md={16} lg={12}>
          <ProForm
            layout="vertical"
            onFinish={handleFinish}
            submitter={{
              searchConfig: {
                submitText: fmt('pages.common.action.save'),
              },
              render: (_, dom) => dom[1],
            }}
            initialValues={initialValues}
            requiredMark={false}
          >
            <ProFormText
              width="md"
              name="nickname"
              label={fmt('pages.system.user.fields.nickname')}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage(
                    { id: 'pages.common.validation.required' },
                    { field: fmt('pages.system.user.fields.nickname') },
                  ),
                },
              ]}
            />
            <ProFormText
              width="md"
              name="realName"
              label={fmt('pages.system.user.fields.realName')}
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
              label={fmt('pages.system.user.fields.birthday')}
            />
          </ProForm>
        </Col>
        <Col xs={24} md={8}>
          <AvatarView avatar={getAvatarURL()} />
        </Col>
      </Row>
    </div>
  );
};

export default BaseView;

const AvatarView = ({ avatar }: { avatar: string }) => {
  const intl = useIntl();
  const fmt = (id: string) => intl.formatMessage({ id });

  return (
    <Flex vertical align="center" style={{ maxWidth: 144 }}>
      <Typography.Paragraph
        strong
        style={{ marginBottom: 8, alignSelf: 'flex-start' }}
      >
        {fmt('pages.system.user.fields.avatar')}
      </Typography.Paragraph>
      <Avatar
        shape="square"
        size={144}
        src={avatar}
        alt="avatar"
        style={{ marginBottom: 12 }}
      />
      <Upload showUploadList={false}>
        <Button>
          <UploadOutlined />
          {fmt('pages.common.action.changeAvatar')}
        </Button>
      </Upload>
    </Flex>
  );
};
