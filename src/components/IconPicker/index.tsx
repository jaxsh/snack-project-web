import {
  ApartmentOutlined,
  ApiOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  BugOutlined,
  BulbOutlined,
  CloseCircleOutlined,
  CloudOutlined,
  ClusterOutlined,
  CodeOutlined,
  CommentOutlined,
  CompassOutlined,
  ContactsOutlined,
  ControlOutlined,
  CopyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  DollarOutlined,
  EditOutlined,
  ExperimentOutlined,
  FallOutlined,
  FileAddOutlined,
  FileOutlined,
  FileTextOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  FundOutlined,
  GiftOutlined,
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LineChartOutlined,
  LockOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  NotificationOutlined,
  PhoneOutlined,
  PieChartOutlined,
  PlusOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RiseOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SlidersOutlined,
  SnippetsOutlined,
  SortAscendingOutlined,
  StarOutlined,
  StockOutlined,
  SyncOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  TransactionOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Flex, Input, Popover, Tooltip } from 'antd';
import React, { useState } from 'react';

export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ApartmentOutlined,
  ApiOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  BugOutlined,
  BulbOutlined,
  ClusterOutlined,
  CloudOutlined,
  CodeOutlined,
  CommentOutlined,
  CompassOutlined,
  ContactsOutlined,
  ControlOutlined,
  CopyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  DollarOutlined,
  EditOutlined,
  ExperimentOutlined,
  FallOutlined,
  FileAddOutlined,
  FileOutlined,
  FileTextOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  FundOutlined,
  GiftOutlined,
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LineChartOutlined,
  LockOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  NotificationOutlined,
  PhoneOutlined,
  PieChartOutlined,
  PlusOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RiseOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SlidersOutlined,
  SnippetsOutlined,
  SortAscendingOutlined,
  StarOutlined,
  StockOutlined,
  SyncOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  TransactionOutlined,
  UserAddOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  WarningOutlined,
};

const ICON_NAMES = Object.keys(ICON_MAP);

type IconPickerProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
};

const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  placeholder = '点击选择图标',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );

  const SelectedIcon = value ? ICON_MAP[value] : null;

  const content = (
    <div style={{ width: 336 }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索图标名称"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 8 }}
        allowClear
      />
      <Flex wrap gap={4} style={{ maxHeight: 256, overflowY: 'auto' }}>
        {filtered.map((name) => {
          const Icon = ICON_MAP[name];
          const isSelected = value === name;
          return (
            <Tooltip key={name} title={name} mouseEnterDelay={0.5}>
              <Button
                type={isSelected ? 'primary' : 'text'}
                ghost={isSelected}
                icon={<Icon />}
                onClick={() => {
                  onChange?.(name);
                  setOpen(false);
                  setSearch('');
                }}
              />
            </Tooltip>
          );
        })}
      </Flex>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSearch('');
      }}
    >
      <Input
        readOnly
        value={value ?? ''}
        placeholder={placeholder}
        style={{ cursor: 'pointer' }}
        prefix={
          SelectedIcon ? (
            <SelectedIcon style={{ color: 'rgba(0,0,0,0.45)' }} />
          ) : undefined
        }
        suffix={
          value ? (
            <CloseCircleOutlined
              style={{ color: 'rgba(0,0,0,0.25)', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(undefined);
              }}
            />
          ) : undefined
        }
      />
    </Popover>
  );
};

export default IconPicker;
