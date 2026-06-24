import { request } from '@umijs/max';

/** 查询角色列表 POST /api/upms/roles/query */
export async function queryRoles(
  body: {
    current?: number;
    size?: number;
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.PageResult<API.SysRoleVO>>>(
    '/api/upms/roles/query',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
      ...(options || {}),
    },
  );
}

/** 获取所有角色（用于下拉选项） */
export async function getAllRoles(options?: Record<string, any>) {
  return request<API.ApiResponse<API.PageResult<API.SysRoleVO>>>(
    '/api/upms/roles/query',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { size: 1000 },
      ...(options || {}),
    },
  );
}

/** 创建角色 POST /api/upms/roles */
export async function createRole(
  body: API.SysRoleDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新角色 PUT /api/upms/roles/${id} */
export async function updateRole(
  id: number | string,
  body: API.SysRoleDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(`/api/upms/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /api/upms/roles/${ids} */
export async function deleteRoles(
  ids: string | number | (string | number)[],
  options?: Record<string, any>,
) {
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  return request<API.ApiResponse<void>>(`/api/upms/roles/${idsStr}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
