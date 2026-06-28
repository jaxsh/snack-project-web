import { PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import type { UploadFile, UploadProps } from 'antd';
import { App, Col, Image, Row, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useMemo, useState } from 'react';
import { updateProfile } from '@/services/auth';
import { uploadFile } from '@/services/system/file';

const BaseView: React.FC = () => {
  const { message } = App.useApp();
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const intl = useIntl();
  const fmt = (id: string) => intl.formatMessage({ id });

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
      await setInitialState((s) => {
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

  const handleAvatarUpload = async (file: File): Promise<string> => {
    const uploadRes = await uploadFile(file);
    const fileUrl = uploadRes?.data?.url;
    if (!fileUrl) {
      throw new Error('Upload failed: Empty URL');
    }
    await updateProfile({ avatar: fileUrl });
    await setInitialState((s) => {
      if (!s) return s;
      return {
        ...s,
        currentUser: { ...s.currentUser, avatar: fileUrl } as API.SysUserVO,
      };
    });
    void message.success(fmt('pages.common.feedback.save.success'));
    return fileUrl;
  };

  const handleAvatarDelete = async () => {
    await updateProfile({ avatar: null });
    await setInitialState((s) => {
      if (!s) return s;
      return {
        ...s,
        currentUser: { ...s.currentUser, avatar: undefined } as API.SysUserVO,
      };
    });
    void message.success(fmt('pages.common.feedback.save.success'));
  };

  return (
    <div style={{ paddingTop: 12 }}>
      <Row gutter={[48, 24]}>
        <Col
          xs={{ span: 24, order: 2 }}
          md={{ span: 16, order: 1 }}
          lg={{ span: 12, order: 1 }}
        >
          <ProForm
            layout="vertical"
            onFinish={handleFinish}
            submitter={{
              searchConfig: { submitText: fmt('pages.common.action.save') },
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
        <Col
          xs={{ span: 24, order: 1 }}
          md={{ span: 8, order: 2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              marginBottom: 8,
            }}
          >
            {fmt('pages.system.user.fields.avatar')}
          </div>
          <AvatarView
            avatarUrl={currentUser?.avatar}
            onUpload={handleAvatarUpload}
            onDelete={handleAvatarDelete}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BaseView;

const AvatarView = ({
  avatarUrl,
  onUpload,
  onDelete,
}: {
  avatarUrl?: string;
  onUpload: (file: File) => Promise<string>;
  onDelete: () => Promise<void>;
}) => {
  const { message } = App.useApp();
  const intl = useIntl();
  const fmt = (id: string) => intl.formatMessage({ id });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(
    avatarUrl
      ? [{ uid: '-1', name: 'avatar', status: 'done', url: avatarUrl }]
      : [],
  );

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || '');
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList.filter((f) => f.status !== 'error'));

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      void message.error(fmt('pages.common.validation.imageFormat'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      void message.error(fmt('pages.common.validation.imageSize'));
    }
    return isJpgOrPng && isLt2M;
  };

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      await onUpload(file as File);
      onSuccess?.(null, file);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        {fmt('pages.common.action.changeAvatar')}
      </div>
    </button>
  );

  return (
    <>
      <div
        style={
          { '--ant-upload-picture-card-size': '144px' } as React.CSSProperties
        }
      >
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={onDelete}
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            maxCount={1}
          >
            {fileList.length < 1 ? uploadButton : null}
          </Upload>
        </ImgCrop>
      </div>
      {previewImage && (
        <Image
          alt="avatar"
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
            src: previewImage,
          }}
        />
      )}
    </>
  );
};
