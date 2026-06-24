import { ApiOutlined, AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { DrawerForm } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { useIntl } from '@umijs/max';
import { App, Button, Input, Space, Spin, Tree, theme } from 'antd';
import type { FC, ReactElement } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getResourceTree, getRoleResources } from '@/services/system/resource';
import { updateRole } from '@/services/system/role';

type ResourceTreeNode = {
  value: number;
  title: string;
  type?: number;
  permission?: string;
  children?: ResourceTreeNode[];
};

type AntdTreeNode = {
  key: number;
  title: string;
  type?: number;
  permission?: string;
  children?: AntdTreeNode[];
};

const convertResourceTree = (
  nodes: API.TreeNode<API.SysResourceVO>[],
): ResourceTreeNode[] =>
  nodes.map((node) => ({
    value: node.data.id,
    title: node.data.name,
    type: node.data.type,
    permission: node.data.permission,
    children:
      node.children.length > 0 ? convertResourceTree(node.children) : undefined,
  }));

const convertToAntdTree = (nodes: ResourceTreeNode[]): AntdTreeNode[] =>
  nodes.map((n) => ({
    key: n.value,
    title: n.title,
    type: n.type,
    permission: n.permission,
    children: n.children ? convertToAntdTree(n.children) : undefined,
  }));

const TYPE_ICON: Record<number, React.ReactNode> = {
  0: <MenuOutlined style={{ color: '#1677ff' }} />,
  1: <AppstoreOutlined style={{ color: '#fa8c16' }} />,
  2: <ApiOutlined style={{ color: '#722ed1' }} />,
};

interface Props {
  trigger: ReactElement;
  record: API.SysRoleVO;
}

const ResourceAssignDrawer: FC<Props> = ({ trigger, record }) => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const intl = useIntl();

  const fetchedRef = useRef(false);
  const [resourceTreeData, setResourceTreeData] = useState<ResourceTreeNode[]>(
    [],
  );
  const [checkedResourceIds, setCheckedResourceIds] = useState<number[]>([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<React.Key[]>([]);
  const [treeSearch, setTreeSearch] = useState('');

  const antdTreeData = useMemo(
    () => convertToAntdTree(resourceTreeData),
    [resourceTreeData],
  );

  const { parentMap, childrenMap, allNodeIds } = useMemo(() => {
    const pm = new Map<number, number>();
    const cm = new Map<number, number[]>();
    const ids: number[] = [];

    const build = (nodes: ResourceTreeNode[], pid?: number) => {
      nodes.forEach((n) => {
        ids.push(n.value);
        if (pid !== undefined) pm.set(n.value, pid);
        if (n.children?.length) {
          cm.set(
            n.value,
            n.children.map((c) => c.value),
          );
          build(n.children, n.value);
        }
      });
    };
    build(resourceTreeData);
    return { parentMap: pm, childrenMap: cm, allNodeIds: ids };
  }, [resourceTreeData]);

  const allParentIds = useMemo(() => [...childrenMap.keys()], [childrenMap]);

  const getAllDescendants = useCallback(
    (id: number): number[] => {
      const result: number[] = [];
      const queue = [id];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (cur === undefined) break;
        (childrenMap.get(cur) || []).forEach((c) => {
          result.push(c);
          queue.push(c);
        });
      }
      return result;
    },
    [childrenMap],
  );

  const getAllAncestors = useCallback(
    (id: number): number[] => {
      const result: number[] = [];
      let cur = parentMap.get(id);
      while (cur !== undefined) {
        result.push(cur);
        cur = parentMap.get(cur);
      }
      return result;
    },
    [parentMap],
  );

  const handleTreeCheck = useCallback(
    (_: any, info: { checked: boolean; node: { key: React.Key } }) => {
      const { checked: isChecked, node } = info;
      const nodeKey = node.key as number;
      setCheckedResourceIds((prev) => {
        const set = new Set<number>(prev);
        if (isChecked) {
          set.add(nodeKey);
          for (const k of getAllAncestors(nodeKey)) set.add(k);
        } else {
          set.delete(nodeKey);
          for (const k of getAllDescendants(nodeKey)) set.delete(k);
        }
        return [...set];
      });
    },
    [getAllDescendants, getAllAncestors],
  );

  const displayCheckedKeys = useMemo(() => {
    const checkedSet = new Set(checkedResourceIds);
    const checked: number[] = [];
    const halfChecked: number[] = [];

    const allDescendantsChecked = (id: number): boolean => {
      const children = childrenMap.get(id);
      if (!children?.length) return true;
      return children.every(
        (c) => checkedSet.has(c) && allDescendantsChecked(c),
      );
    };

    checkedSet.forEach((id) => {
      if (allDescendantsChecked(id)) {
        checked.push(id);
      } else {
        halfChecked.push(id);
      }
    });
    return { checked, halfChecked };
  }, [checkedResourceIds, childrenMap]);

  const renderTreeTitle = useCallback(
    (nodeData: any) => {
      const node = nodeData as AntdTreeNode;
      const icon = TYPE_ICON[node.type ?? 0];
      const name = node.title;

      let nameEl: React.ReactNode = name;
      if (treeSearch) {
        const lower = name.toLowerCase();
        const idx = lower.indexOf(treeSearch.toLowerCase());
        if (idx >= 0) {
          nameEl = (
            <>
              {name.slice(0, idx)}
              <span
                style={{
                  color: token.colorWarning,
                  background: token.colorWarningBg,
                }}
              >
                {name.slice(idx, idx + treeSearch.length)}
              </span>
              {name.slice(idx + treeSearch.length)}
            </>
          );
        }
      }

      return (
        <span>
          <span style={{ marginRight: 6 }}>{icon}</span>
          {nameEl}
          {node.permission && (
            <span
              style={{
                marginLeft: 8,
                color: token.colorTextTertiary,
                fontSize: 11,
              }}
            >
              {node.permission}
            </span>
          )}
        </span>
      );
    },
    [treeSearch],
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => {
      const withAncestors = new Set(checkedResourceIds);
      for (const id of checkedResourceIds) {
        for (const pid of getAllAncestors(id)) withAncestors.add(pid);
      }
      return updateRole(record.id, {
        roleCode: record.roleCode,
        resourceIds: [...withAncestors],
      });
    },
    onSuccess: () => {
      message.success(
        intl.formatMessage({ id: 'pages.common.feedback.update.success' }),
      );
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open && !fetchedRef.current) {
      fetchedRef.current = true;
      setTreeSearch('');
      setResourceLoading(true);
      Promise.all([getResourceTree(), getRoleResources(record.roleCode)])
        .then(([treeRes, roleRes]) => {
          const freshTree = convertResourceTree(treeRes.data || []);
          setResourceTreeData(freshTree);
          setTreeExpandedKeys(freshTree.map((n) => n.value));
          setCheckedResourceIds((roleRes.data || []).map((r) => r.id));
        })
        .catch(() => {
          setCheckedResourceIds([]);
        })
        .finally(() => {
          setResourceLoading(false);
        });
    } else if (!open) {
      fetchedRef.current = false;
      setCheckedResourceIds([]);
      setTreeSearch('');
    }
  };

  return (
    <DrawerForm
      title={intl.formatMessage(
        { id: 'pages.system.role.text.assignResourcesTitle' },
        { roleName: record.roleName },
      )}
      trigger={trigger}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({ id: 'pages.common.action.save' }),
        },
        render: (_, defaultDoms) => [defaultDoms[1]],
        submitButtonProps: { loading: isPending },
      }}
      resize={{ minWidth: 480, maxWidth: window.innerWidth * 0.8 }}
      drawerProps={{ destroyOnHidden: true, closable: { placement: 'end' } }}
      onOpenChange={handleOpenChange}
      onFinish={async () => {
        try {
          await mutateAsync();
          return true;
        } catch {
          return false;
        }
      }}
    >
      <Input
        allowClear
        placeholder={intl.formatMessage({
          id: 'pages.system.role.placeholder.searchResources',
        })}
        value={treeSearch}
        onChange={(e) => setTreeSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Space size="small">
          <Button
            size="small"
            onClick={() => setTreeExpandedKeys(allParentIds)}
          >
            {intl.formatMessage({ id: 'pages.system.role.action.expandAll' })}
          </Button>
          <Button size="small" onClick={() => setTreeExpandedKeys([])}>
            {intl.formatMessage({ id: 'pages.system.role.action.collapseAll' })}
          </Button>
        </Space>
        <Space size="small" align="center">
          <Button
            size="small"
            onClick={() => setCheckedResourceIds([...allNodeIds])}
          >
            {intl.formatMessage({ id: 'pages.system.role.action.checkAll' })}
          </Button>
          <Button size="small" onClick={() => setCheckedResourceIds([])}>
            {intl.formatMessage({ id: 'pages.system.role.action.uncheckAll' })}
          </Button>
          <span style={{ fontSize: 12, color: '#1677ff', minWidth: 60 }}>
            {intl.formatMessage(
              { id: 'pages.system.role.text.selectedCount' },
              { count: checkedResourceIds.length },
            )}
          </span>
        </Space>
      </div>

      <Spin spinning={resourceLoading}>
        <Tree
          checkable
          checkStrictly
          checkedKeys={displayCheckedKeys}
          expandedKeys={treeSearch ? allParentIds : treeExpandedKeys}
          onExpand={(keys) => {
            if (!treeSearch) setTreeExpandedKeys(keys as React.Key[]);
          }}
          onCheck={handleTreeCheck}
          treeData={antdTreeData}
          titleRender={renderTreeTitle}
          blockNode
        />
      </Spin>
    </DrawerForm>
  );
};

export default ResourceAssignDrawer;
