import { request } from '@umijs/max';

/** 查询用户列表 POST /api/upms/users/query */
export async function queryUsers(
  body: {
    current?: number;
    size?: number;
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.PageResult<API.SysUserVO>>>(
    '/api/upms/users/query',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 查询用户详情(含 oauth 聚合信息) GET /api/upms/users/info */
export async function getUser(
  username: string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.SysUserVO>>('/api/upms/users/info', {
    method: 'GET',
    params: { username },
    ...(options || {}),
  });
}

/** 创建用户 POST /api/upms/users */
export async function createUser(
  body: API.SysUserDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/upms/users/${id} */
export async function updateUser(
  id: number | string,
  body: API.SysUserDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(`/api/upms/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/upms/users/${ids} */
export async function deleteUsers(
  ids: string | number | (string | number)[],
  options?: Record<string, any>,
) {
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  return request<API.ApiResponse<void>>(`/api/upms/users/${idsStr}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 重置用户密码 POST /api/upms/users/${id}/reset-password */
export async function resetUserPassword(
  id: number | string,
  body: { password?: string },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(
    `/api/upms/users/${id}/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 解锁用户 PATCH /api/upms/users/${id}/unlock */
export async function unlockUser(
  id: number | string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(`/api/upms/users/${id}/unlock`, {
    method: 'PATCH',
    ...(options || {}),
  });
}

/** 强制下线用户 DELETE /api/upms/users/${id}/tokens */
export async function revokeUserTokens(
  id: number | string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(`/api/upms/users/${id}/tokens`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
