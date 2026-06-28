import { request } from '@umijs/max';

/** 上传文件 POST /api/upms/files */
export async function uploadFile(
  file: File | Blob,
  options?: Record<string, any>,
) {
  const formData = new FormData();
  formData.append('file', file);

  return request<API.ApiResponse<API.SysFileVO>>('/api/upms/files', {
    method: 'POST',
    data: formData,
    ...(options || {}),
  });
}
