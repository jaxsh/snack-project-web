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

/** 获取业务相关的个人信息 GET /api/upms/user */
export async function getSysUserInfo(options?: Record<string, any>) {
  return request<API.ApiResponse<API.SysUserVO>>('/api/upms/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改当前用户密码 PUT /api/upms/user/password */
export async function changePassword(
  body: API.UpdatePasswordParams,
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/user/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 自助更新当前登录用户的个人资料 PUT /api/upms/user */
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
  return request<API.ApiResponse<void>>('/api/upms/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取 MFA TOTP 密钥和二维码 URI GET /api/upms/user/mfa */
export async function getMfaSetup(options?: Record<string, any>) {
  return request<API.ApiResponse<API.MfaSetupVO>>('/api/upms/user/mfa', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 绑定或解绑当前用户 MFA PUT /api/upms/user/mfa */
export async function updateMfa(
  body: {
    mfaEnabled: number;
    mfaSecret?: string | null;
    mfaCode: string;
  },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<void>>('/api/upms/user/mfa', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** MFA 登录验证 POST /oauth2/account/verify-mfa */
export async function verifyMfa(
  body: { code: string },
  options?: Record<string, any>,
) {
  return request<API.ApiResponse<{ redirectUrl?: string }>>('/oauth2/account/verify-mfa', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}




