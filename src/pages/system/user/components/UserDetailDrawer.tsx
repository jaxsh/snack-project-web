import {
  PartitionOutlined,
  ProfileOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { DrawerForm, ProDescriptions } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import type { TabsProps } from 'antd';
import { Avatar, Flex, Result, Space, Spin, Tabs, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { getAllRoles } from '@/services/system/role';
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
  const [roleNameMap, setRoleNameMap] = useState<Record<string, string>>({});
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);

  const fmt = (key: string, values?: Record<string, string>) =>
    intl.formatMessage({ id: key }, values);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (fetchedRef.current || loading) {
        return;
      }
      fetchedRef.current = true;
      setLoading(true);
      Promise.all([getUser(record.username), getAllRoles()])
        .then(([userRes, rolesRes]) => {
          setFetchFailed(false);
          if (userRes?.data) {
            setUserDetail(userRes.data);
          }
          if (rolesRes?.data?.records) {
            const map: Record<string, string> = {};
            rolesRes.data.records.forEach((r) => {
              if (r.roleCode && r.roleName) {
                map[r.roleCode] = r.roleName;
              }
            });
            setRoleNameMap(map);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user details:', err);
          setFetchFailed(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUserDetail(null);
      setRoleNameMap({});
      setFetchFailed(false);
      setTimeout(() => {
        fetchedRef.current = false;
      }, 500);
    }
  };

  const defaultAvatar =
    'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  const user = userDetail || record;
  const nameToShow = user.realName || user.nickname || user.username;

  const sessionColumns = (user.sessions || []).map((session, index) => ({
    key: session.sessionId,
    title: fmt('pages.system.user.fields.activeSession', {
      id: session.sessionId.substring(0, 8),
    }),
    dataIndex: ['sessions', index, 'lastRequest'],
    valueType: 'dateTime' as const,
    span: 1,
  }));

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
          column={2}
          layout="vertical"
          dataSource={user}
          emptyText="-"
          columns={[
            {
              title: fmt('pages.system.user.fields.username'),
              dataIndex: 'username',
              span: 1,
            },
            {
              title: fmt('pages.system.user.fields.realName'),
              dataIndex: 'realName',
              span: 1,
            },
            {
              title: fmt('pages.system.user.fields.nickname'),
              dataIndex: 'nickname',
              span: 1,
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
              span: 1,
            },
            {
              title: fmt('pages.system.user.fields.birthday'),
              dataIndex: 'birthday',
              valueType: 'date',
              span: 1,
            },
            {
              title: fmt('pages.system.user.fields.mobile'),
              dataIndex: 'mobile',
              span: 1,
            },
            {
              title: fmt('pages.system.user.fields.email'),
              dataIndex: 'email',
              span: 2,
            },
            {
              title: fmt('pages.common.fields.remark'),
              dataIndex: 'remark',
              span: 2,
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
          column={2}
          layout="vertical"
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
              span: 2,
            },
            {
              title: fmt('pages.system.user.fields.roleCodes'),
              dataIndex: 'roleCodes',
              render: (_, rec) =>
                rec.roleCodes && rec.roleCodes.length > 0 ? (
                  <Space size={[4, 4]} wrap>
                    {rec.roleCodes.map((role) => (
                      <Tag key={role} color="blue">
                        {roleNameMap[role] ?? role}
                      </Tag>
                    ))}
                  </Space>
                ) : null,
              span: 2,
            },
            {
              title: fmt('pages.common.fields.createTime'),
              dataIndex: 'createTime',
              valueType: 'dateTime',
              span: 1,
            },
            {
              title: fmt('pages.common.fields.updateTime'),
              dataIndex: 'updateTime',
              valueType: 'dateTime',
              span: 1,
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
          column={2}
          layout="vertical"
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
              span: 1,
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
              span: 1,
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
              span: 1,
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
              span: 1,
            },
            {
              title: fmt('pages.system.user.fields.passwordExpireTime'),
              dataIndex: ['oauthVO', 'passwordExpireTime'],
              render: (_, rec) => {
                const expireTime = rec.oauthVO?.passwordExpireTime;
                if (!expireTime) {
                  return (
                    <Tag color="success">
                      {fmt('pages.system.user.fields.passwordExpireTime.never')}
                    </Tag>
                  );
                }

                const expireDate = dayjs(expireTime);
                const now = dayjs();

                if (expireDate.isBefore(now)) {
                  return (
                    <Tag color="error">
                      {expireDate.format('YYYY-MM-DD HH:mm:ss')}
                    </Tag>
                  );
                }

                const diffDays = expireDate.diff(now, 'day');
                if (diffDays <= 30) {
                  return (
                    <Tag color="warning">
                      {expireDate.format('YYYY-MM-DD HH:mm:ss')}
                    </Tag>
                  );
                }

                return (
                  <Tag color="success">
                    {expireDate.format('YYYY-MM-DD HH:mm:ss')}
                  </Tag>
                );
              },
              span: 2,
            },
            ...sessionColumns,
          ]}
        />
      ),
    },
  ];

  return (
    <DrawerForm
      title={fmt('pages.common.action.detail')}
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
        {fetchFailed ? (
          <Result
            status="403"
            title="403"
            subTitle={fmt('pages.403.text.subTitle')}
          />
        ) : (
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
        )}
      </Spin>
    </DrawerForm>
  );
};

export default UserDetailDrawer;
