import { request } from '@umijs/max';

/** 查询定时任务列表 POST /api/upms/scheduler-jobs/query */
export async function querySchedulerJobs(
  body: {
    current?: number;
    size?: number;
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.PageResult<API.SysSchedulerJobVO>>>(
    '/api/upms/scheduler-jobs/query',
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

/** 创建定时任务 POST /api/upms/scheduler-jobs */
export async function createSchedulerJob(
  body: API.SysSchedulerJobDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/scheduler-jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 按 ID 查询定时任务 GET /api/upms/scheduler-jobs/${id} */
export async function getSchedulerJob(
  id: number | string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.SysSchedulerJobVO>>(
    `/api/upms/scheduler-jobs/${id}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 更新定时任务 PUT /api/upms/scheduler-jobs/${id} */
export async function updateSchedulerJob(
  id: number | string,
  body: API.SysSchedulerJobDTO,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(`/api/upms/scheduler-jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除定时任务 DELETE /api/upms/scheduler-jobs/${ids} */
export async function deleteSchedulerJobs(
  ids: string | number | (string | number)[],
  options?: Record<string, any>,
) {
  const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
  return request<API.ApiResponse<void>>(`/api/upms/scheduler-jobs/${idsStr}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 暂停定时任务 PUT /api/upms/scheduler-jobs/${id}/pause */
export async function pauseSchedulerJob(
  id: number | string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(
    `/api/upms/scheduler-jobs/${id}/pause`,
    {
      method: 'PUT',
      ...(options || {}),
    },
  );
}

/** 恢复定时任务 PUT /api/upms/scheduler-jobs/${id}/resume */
export async function resumeSchedulerJob(
  id: number | string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(
    `/api/upms/scheduler-jobs/${id}/resume`,
    {
      method: 'PUT',
      ...(options || {}),
    },
  );
}

/** 手动触发定时任务 POST /api/upms/scheduler-jobs/${id}/trigger */
export async function triggerSchedulerJob(
  id: number | string,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>(
    `/api/upms/scheduler-jobs/${id}/trigger`,
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 查询任务执行日志 POST /api/upms/scheduler-jobs/logs/query */
export async function querySchedulerJobLogs(
  body: {
    current?: number;
    size?: number;
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.PageResult<API.SysSchedulerJobLogVO>>>(
    '/api/upms/scheduler-jobs/logs/query',
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

/** 按任务 ID 查询执行日志 POST /api/upms/scheduler-jobs/${jobId}/logs/query */
export async function querySchedulerJobLogsByJobId(
  jobId: number | string,
  body: {
    current?: number;
    size?: number;
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<API.PageResult<API.SysSchedulerJobLogVO>>>(
    `/api/upms/scheduler-jobs/${jobId}/logs/query`,
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
