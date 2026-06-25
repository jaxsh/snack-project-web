import { useIntl } from '@umijs/max';
import { Avatar, Descriptions, Drawer, Space, Spin, Tabs, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUser } from '@/services/system/user';

interface Props {
  id?: number;
  open: boolean;
  onClose: () => void;
}

const UserDetailDrawer: React.FC<Props> = ({ id, open, onClose }) => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<API.SysUserVO | null>(null);

  const fmt = (key: string, values?: Record<string, string>) =>
    intl.formatMessage({ id: key }, values);

  useEffect(() => {
    if (open && id) {
      setLoading(true);
      getUser(id)
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
    }
  }, [open, id]);

  const defaultAvatar =
    'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  const tabItems = [
    {
      key: 'basic',
      label: fmt('pages.system.user.text.tabBasic'),
      children: userDetail && (
        <Descriptions column={1} size="middle" style={{ marginTop: 8 }}>
          <Descriptions.Item label={fmt('pages.system.user.fields.username')}>
            <strong>{userDetail.username}</strong>
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.realName')}>
            {userDetail.realName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.nickname')}>
            {userDetail.nickname || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.avatar')}>
            <Avatar src={userDetail.avatar || defaultAvatar} size="large" />
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.gender')}>
            {userDetail.genderLabel || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.birthday')}>
            {userDetail.birthday || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.mobile')}>
            {userDetail.mobile || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.email')}>
            {userDetail.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.remark')}>
            {userDetail.remark || '-'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'upms',
      label: fmt('pages.system.user.text.tabUpms'),
      children: userDetail && (
        <Descriptions column={1} size="middle" style={{ marginTop: 8 }}>
          <Descriptions.Item label={fmt('pages.system.user.fields.status')}>
            <Tag color={userDetail.status === 1 ? 'success' : 'error'}>
              {userDetail.statusLabel ||
                (userDetail.status === 1
                  ? fmt('pages.common.dict.status.enabled')
                  : fmt('pages.common.dict.status.disabled'))}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.roleCodes')}>
            {userDetail.roleCodes && userDetail.roleCodes.length > 0 ? (
              <Space size={[0, 4]} wrap>
                {userDetail.roleCodes.map((role) => (
                  <Tag key={role} color="blue">
                    {role}
                  </Tag>
                ))}
              </Space>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.common.fields.createTime')}>
            {userDetail.createTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {userDetail.updateTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'security',
      label: fmt('pages.system.user.text.tabSecurity'),
      children: userDetail && (
        <Descriptions column={1} size="middle" style={{ marginTop: 8 }}>
          <Descriptions.Item label={fmt('pages.system.user.fields.expireDate')}>
            {userDetail.expireDate ? (
              <Tag color="warning">{userDetail.expireDate}</Tag>
            ) : (
              <Tag color="success">
                {fmt('pages.system.user.text.expireNever')}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={fmt('pages.system.user.fields.lastActiveTime')}
          >
            {userDetail.lastActiveTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.locked')}>
            {userDetail.oauthVO ? (
              <Tag
                color={userDetail.oauthVO.locked === 1 ? 'error' : 'success'}
              >
                {userDetail.oauthVO.lockedLabel ||
                  (userDetail.oauthVO.locked === 1 ? '已锁定' : '正常')}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="凭证过期状态">
            {userDetail.oauthVO ? (
              <Tag
                color={userDetail.oauthVO.expired === 1 ? 'error' : 'success'}
              >
                {userDetail.oauthVO.expiredLabel ||
                  (userDetail.oauthVO.expired === 1 ? '已过期' : '正常')}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={fmt('pages.system.user.fields.initialPassword')}
          >
            {userDetail.oauthVO ? (
              <Tag
                color={
                  userDetail.oauthVO.initialPassword === 1
                    ? 'warning'
                    : 'default'
                }
              >
                {userDetail.oauthVO.initialPasswordLabel ||
                  (userDetail.oauthVO.initialPassword === 1
                    ? '需强制修改'
                    : '已修改')}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label={fmt('pages.system.user.fields.mfaEnabled')}>
            {userDetail.oauthVO ? (
              <Tag
                color={
                  userDetail.oauthVO.mfaEnabled === 1 ? 'success' : 'default'
                }
              >
                {userDetail.oauthVO.mfaEnabled === 1 ? '已启用' : '未启用'}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return (
    <Drawer
      title={fmt('pages.system.user.text.detailTitle', {
        username: userDetail?.username || '',
      })}
      open={open}
      onClose={onClose}
      size={500}
      destroyOnHidden
    >
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: '200px',
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        userDetail && <Tabs defaultActiveKey="basic" items={tabItems} />
      )}
    </Drawer>
  );
};

export default UserDetailDrawer;
