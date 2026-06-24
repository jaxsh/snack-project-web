import { request } from '@umijs/max';

/** 获取当前用户资源列表 GET /api/upms/user/resources */
export async function getMyResources(options?: Record<string, any>) {
  return request<API.ApiResponse<API.SysResourceVO[]>>('/api/upms/user/resources', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取资源树 GET /api/upms/resources/tree */
export async function getResourceTree(options?: Record<string, any>) {
  return request<API.ApiResponse<API.TreeNode<API.SysResourceVO>[]>>(
    '/api/upms/resources/tree',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 获取角色已分配的资源 GET /api/upms/roles/${roleCode}/resources */
export async function getRoleResources(
  roleCode: string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.SysResourceVO[]>>(
    `/api/upms/roles/${roleCode}/resources`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 查询资源列表 POST /api/upms/resources/query */
export async function queryResources(
  body: {
    current?: number;
    size?: number;
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.PageResult<API.SysResourceVO>>>(
    '/api/upms/resources/query',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
      ...(options || {}),
    },
  );
}

/** 创建资源 POST /api/upms/resources */
export async function createResource(
  body: API.SysResourceDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 更新资源 PUT /api/upms/resources/${id} */
export async function updateResource(
  id: number | string,
  body: API.SysResourceDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(`/api/upms/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  });
}

/** 删除资源 DELETE /api/upms/resources/${ids} */
export async function deleteResources(
  ids: string | number | (string | number)[],
  options?: Record<string, any>,
) {
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  return request<API.ApiResponse<void>>(`/api/upms/resources/${idsStr}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
