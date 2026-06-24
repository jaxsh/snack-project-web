import {
  DrawerForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button, Form } from 'antd';
import type { FC, ReactElement } from 'react';
import IconPicker from '@/components/IconPicker';
import { getResourceTree, updateResource } from '@/services/system/resource';

type ParentTreeNode = {
  value: number;
  title: string;
  children?: ParentTreeNode[];
};

const convertToParentTree = (
  nodes: API.TreeNode<API.SysResourceVO>[],
): ParentTreeNode[] =>
  nodes
    .filter((node) => node.data.type === 0)
    .map((node) => ({
      value: node.data.id,
      title: node.data.name,
      children:
        node.children.length > 0
          ? convertToParentTree(node.children)
          : undefined,
    }));

const excludeNode = (
  nodes: API.TreeNode<API.SysResourceVO>[],
  excludeId: number,
): API.TreeNode<API.SysResourceVO>[] =>
  nodes
    .filter((n) => n.data.id !== excludeId)
    .map((n) => ({ ...n, children: excludeNode(n.children, excludeId) }));

interface Props {
  trigger: ReactElement;
  record: API.SysResourceVO;
  onOk?: () => void;
}

const ResourceEditForm: FC<Props> = ({ trigger, record, onOk }) => {
  const { message } = App.useApp();
  const intl = useIntl();
  const statusOptions = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'pages.common.dict.status.enabled' }),
    },
    {
      value: 0,
      label: intl.formatMessage({ id: 'pages.common.dict.status.disabled' }),
    },
  ];

  const typeOptions = [
    {
      value: 0,
      label: intl.formatMessage({ id: 'pages.system.resource.type.menu' }),
    },
    {
      value: 1,
      label: intl.formatMessage({ id: 'pages.system.resource.type.button' }),
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'pages.system.resource.type.api' }),
    },
  ];

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
  ];

  const visibleOptions = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'pages.common.dict.status.enabled' }),
    },
    {
      value: 0,
      label: intl.formatMessage({ id: 'pages.common.dict.status.disabled' }),
    },
  ];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: any) => {
      const { type: _type, ...rest } = values;
      return updateResource(record.id, {
        ...rest,
        parentId: rest.parentId ?? 0,
      } as API.SysResourceDTO);
    },
    onSuccess: () => {
      message.success(
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
      );
      onOk?.();
    },
  });

  return (
    <DrawerForm
      title={intl.formatMessage({ id: 'pages.common.action.edit' })}
      trigger={trigger}
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
      initialValues={{
        parentId: record.parentId || undefined,
        name: record.name,
        type: record.type,
        permission: record.permission,
        path: record.path,
        component: record.component,
        method: record.method,
        icon: record.icon,
        sortOrder: record.sortOrder,
        visible: record.visible,
        status: record.status ?? 1,
      }}
      onFinish={async (values) => {
        try {
          await mutateAsync(values);
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label={intl.formatMessage({
          id: 'pages.system.resource.fields.parentId',
        })}
        allowClear
        request={async () => {
          const res = await getResourceTree();
          const filtered = excludeNode(res.data || [], record.id);
          return convertToParentTree(filtered);
        }}
        fieldProps={{ treeDefaultExpandAll: true }}
        placeholder={intl.formatMessage(
          { id: 'pages.common.validation.placeholder.select' },
          {
            field: intl.formatMessage({
              id: 'pages.system.resource.fields.parentId',
            }),
          },
        )}
      />
      <ProFormText
        name="name"
        label={intl.formatMessage({ id: 'pages.system.resource.fields.name' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'pages.common.validation.required' },
              {
                field: intl.formatMessage({
                  id: 'pages.system.resource.fields.name',
                }),
              },
            ),
          },
        ]}
      />
      <ProFormRadio.Group
        name="type"
        label={intl.formatMessage({ id: 'pages.system.resource.fields.type' })}
        options={typeOptions}
        disabled
      />
      {record.type === 0 && (
        <>
          <ProFormText
            name="path"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.path',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage(
                  { id: 'pages.common.validation.required' },
                  {
                    field: intl.formatMessage({
                      id: 'pages.system.resource.fields.path',
                    }),
                  },
                ),
              },
            ]}
          />
          <ProFormText
            name="component"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.component',
            })}
          />
          <Form.Item
            name="icon"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.icon',
            })}
          >
            <IconPicker />
          </Form.Item>
          <ProFormDigit
            name="sortOrder"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.sortOrder',
            })}
            min={0}
          />
          <ProFormSelect
            name="visible"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.visible',
            })}
            options={visibleOptions}
          />
        </>
      )}
      {record.type === 1 && (
        <ProFormText
          name="permission"
          label={intl.formatMessage({
            id: 'pages.system.resource.fields.permission',
          })}
        />
      )}
      {record.type === 2 && (
        <>
          <ProFormText
            name="path"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.path',
            })}
          />
          <ProFormSelect
            name="method"
            label={intl.formatMessage({
              id: 'pages.system.resource.fields.method',
            })}
            options={methodOptions}
          />
        </>
      )}
      <ProFormSelect
        name="status"
        label={intl.formatMessage({
          id: 'pages.system.resource.fields.status',
        })}
        options={statusOptions}
      />
    </DrawerForm>
  );
};

export default ResourceEditForm;
