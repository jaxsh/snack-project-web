import {
  PartitionOutlined,
  ProfileOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { DrawerForm, ProDescriptions } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Avatar, Flex, Space, Spin, Tabs, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { getUser } from '@/services/system/user';

interface Props {
  record: API.SysUserVO;
  trigger: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
}

const UserDetailDrawer: React.FC<Props> = ({ record, trigger }) => {
  const { Title, Text } = Typography;
  const intl = useIntl();
  const fetchedRef = useRef(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<API.SysUserVO | null>(null);

  const fmt = (key: string, values?: Record<string, string>) =>
    intl.formatMessage({ id: key }, values);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (fetchedRef.current || loading) {
        return;
      }
      fetchedRef.current = true;
      setLoading(true);
      getUser(record.username)
        .then((res) => {
          if (res?.data) {
            setUserDetail(res.data);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUserDetail(null);
      setTimeout(() => {
        fetchedRef.current = false;
      }, 500);
    }
  };

  const defaultAvatar =
    'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  const user = userDetail || record;
  const nameToShow = user.realName || user.nickname || user.username;

  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: (
        <span>
          <ProfileOutlined />
          {fmt('pages.system.user.text.tabBasic')}
        </span>
      ),
      children: (
        <ProDescriptions<API.SysUserVO>
          column={1}
          dataSource={user}
          emptyText="-"
          columns={[
            {
              title: fmt('pages.system.user.fields.username'),
              dataIndex: 'username',
            },
            {
              title: fmt('pages.system.user.fields.realName'),
              dataIndex: 'realName',
            },
            {
              title: fmt('pages.system.user.fields.nickname'),
              dataIndex: 'nickname',
            },
            {
              title: fmt('pages.system.user.fields.gender'),
              dataIndex: 'gender',
              valueType: 'select',
              valueEnum: {
                0: { text: fmt('pages.common.dict.gender.unknown') },
                1: { text: fmt('pages.common.dict.gender.male') },
                2: { text: fmt('pages.common.dict.gender.female') },
              },
            },
            {
              title: fmt('pages.system.user.fields.birthday'),
              dataIndex: 'birthday',
              valueType: 'date',
            },
            {
              title: fmt('pages.system.user.fields.mobile'),
              dataIndex: 'mobile',
            },
            {
              title: fmt('pages.system.user.fields.email'),
              dataIndex: 'email',
            },
            {
              title: fmt('pages.common.fields.remark'),
              dataIndex: 'remark',
            },
          ]}
        />
      ),
    },
    {
      key: 'upms',
      label: (
        <span>
          <PartitionOutlined />
          {fmt('pages.system.user.text.tabUpms')}
        </span>
      ),
      children: (
        <ProDescriptions<API.SysUserVO>
          column={1}
          dataSource={user}
          emptyText="-"
          columns={[
            {
              title: fmt('pages.common.fields.status'),
              dataIndex: 'status',
              render: (_, rec) => (
                <Tag color={rec.status === 1 ? 'success' : 'error'}>
                  {rec.statusLabel ||
                    (rec.status === 1
                      ? fmt('pages.common.dict.status.enabled')
                      : fmt('pages.common.dict.status.disabled'))}
                </Tag>
              ),
            },
            {
              title: fmt('pages.system.user.fields.roleCodes'),
              dataIndex: 'roleCodes',
              render: (_, rec) =>
                rec.roleCodes && rec.roleCodes.length > 0 ? (
                  <Space size={[0, 4]} wrap>
                    {rec.roleCodes.map((role) => (
                      <Tag key={role} color="blue">
                        {role}
                      </Tag>
                    ))}
                  </Space>
                ) : null,
            },
            {
              title: fmt('pages.common.fields.createTime'),
              dataIndex: 'createTime',
              valueType: 'dateTime',
            },
            {
              title: fmt('pages.common.fields.updateTime'),
              dataIndex: 'updateTime',
              valueType: 'dateTime',
            },
          ]}
        />
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SafetyOutlined />
          {fmt('pages.system.user.text.tabSecurity')}
        </span>
      ),
      children: (
        <ProDescriptions<API.SysUserVO>
          column={1}
          dataSource={user}
          emptyText="-"
          columns={[
            {
              title: fmt('pages.system.user.fields.locked'),
              dataIndex: ['oauthVO', 'locked'],
              valueType: 'select',
              valueEnum: {
                0: {
                  text: fmt('pages.common.dict.yesNo.no'),
                  status: 'Success',
                },
                1: {
                  text: fmt('pages.common.dict.yesNo.yes'),
                  status: 'Error',
                },
              },
            },
            {
              title: fmt('pages.system.user.fields.credentialStatus'),
              dataIndex: ['oauthVO', 'expired'],
              valueType: 'select',
              valueEnum: {
                0: {
                  text: fmt('pages.common.dict.yesNo.no'),
                  status: 'Success',
                },
                1: {
                  text: fmt('pages.common.dict.yesNo.yes'),
                  status: 'Error',
                },
              },
            },
            {
              title: fmt('pages.system.user.fields.initialPassword'),
              dataIndex: ['oauthVO', 'initialPassword'],
              valueType: 'select',
              valueEnum: {
                0: {
                  text: fmt('pages.common.dict.yesNo.no'),
                  status: 'Default',
                },
                1: {
                  text: fmt('pages.common.dict.yesNo.yes'),
                  status: 'Warning',
                },
              },
            },
            {
              title: fmt('pages.system.user.fields.mfaEnabled'),
              dataIndex: ['oauthVO', 'mfaEnabled'],
              valueType: 'select',
              valueEnum: {
                0: {
                  text: fmt('pages.common.dict.yesNo.no'),
                  status: 'Default',
                },
                1: {
                  text: fmt('pages.common.dict.yesNo.yes'),
                  status: 'Success',
                },
              },
            },
            {
              title: fmt('pages.system.user.fields.expireDate'),
              dataIndex: 'expireDate',
              render: (_, rec) =>
                rec.expireDate ? (
                  <Tag color="warning">{rec.expireDate}</Tag>
                ) : (
                  <Tag color="success">
                    {fmt('pages.system.user.text.expireNever')}
                  </Tag>
                ),
            },
            {
              title: fmt('pages.system.user.fields.lastActiveTime'),
              dataIndex: 'lastActiveTime',
              valueType: 'dateTime',
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DrawerForm
      title={
        record.username
          ? fmt('pages.system.user.text.detailTitle', {
              username: record.username,
            })
          : 'User Details'
      }
      trigger={trigger}
      onOpenChange={handleOpenChange}
      submitter={false}
      resize={{ minWidth: 400, maxWidth: window.innerWidth * 0.8 }}
      drawerProps={{
        destroyOnHidden: true,
        closable: { placement: 'end' },
      }}
    >
      <Spin spinning={loading}>
        <Flex vertical gap="middle">
          <Flex align="center" gap="middle">
            <Avatar
              src={user.avatar || defaultAvatar}
              size={64}
              style={{ flexShrink: 0 }}
            />
            <Flex vertical>
              <Space align="center">
                <Title level={4} style={{ margin: 0 }}>
                  {nameToShow}
                </Title>
                <Tag color={user.status === 1 ? 'success' : 'error'}>
                  {user.statusLabel ||
                    (user.status === 1
                      ? fmt('pages.common.dict.status.enabled')
                      : fmt('pages.common.dict.status.disabled'))}
                </Tag>
              </Space>
              <Text type="secondary">@{user.username}</Text>
            </Flex>
          </Flex>
          <Tabs defaultActiveKey="basic" items={tabItems} />
        </Flex>
      </Spin>
    </DrawerForm>
  );
};

export default UserDetailDrawer;
