import { request } from '@umijs/max';

/** 登录接口 POST /auth-api/login */
export async function login(body: API.LoginParams, options?: Record<string, any>) {
  return request<API.ApiResponse<API.LoginResult>>('/auth-api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      username: body.username || '',
      password: body.password || '',
    }).toString(),
    ...(options || {}),
  });
}

/** 退出登录接口 POST /auth-api/logout */
export async function logout(options?: Record<string, any>) {
  return request<{ redirectUrl: string }>('/auth-api/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取业务相关的个人信息 GET /api/upms/users/info */
export async function getSysUserInfo(options?: Record<string, any>) {
  return request<API.ApiResponse<API.SysUserVO>>('/api/upms/users/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改当前用户密码 PUT /api/upms/users/password */
export async function changePassword(
  body: API.UpdatePasswordParams,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/users/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 自助更新当前登录用户的个人资料 PUT /api/upms/users/profile */
export async function updateProfile(
  body: {
    nickname?: string | null;
    realName?: string | null;
    avatar?: string | null;
    gender?: number | null;
    birthday?: string | null;
    email?: string | null;
    mobile?: string | null;
    mfaEnabled?: number | null;
    mfaSecret?: string | null;
    mfaCode?: string | null;
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取 MFA TOTP 密钥和二维码 URI GET /api/upms/users/mfa/setup */
export async function getMfaSetup(options?: Record<string, any>) {
  return request<API.ApiResponse<API.MfaSetupVO>>('/api/upms/users/mfa/setup', {
    method: 'GET',
    ...(options || {}),
  });
}

/** MFA 登录验证 POST /oauth2/account/verify-mfa */
export async function verifyMfa(
  body: { code: string },
  options?: Record<string, any>,
) {
  return request<{ redirectUrl?: string }>('/oauth2/account/verify-mfa', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}




