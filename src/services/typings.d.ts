declare namespace API {
  type ApiResponse<T = any> = {
    code: string | null;
    msg: string;
    data: T;
    success?: boolean;
  };

  type LoginResult = {
    redirectUrl?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type SysUserVO = {
    id: number;
    username: string;
    realName?: string;
    nickname?: string;
    avatar?: string;
    gender?: number;
    genderLabel?: string;
    birthday?: string;
    remark?: string;
    createTime?: string;
    updateTime?: string;
    status: number;
    statusLabel?: string;
    mobile?: string;
    email?: string;
    expireDate?: string;
    lastActiveTime?: string;
    roleCodes?: string[];
    // 认证侧信息(登录/锁定/初始密码/MFA 等), 由 oauth_user 聚合
    oauthVO?: OAuthUserVO;
  };

  type OAuthUserVO = {
    id: number;
    username: string;
    mobile?: string;
    email?: string;
    enabled?: number;
    enabledLabel?: string;
    locked?: number;
    lockedLabel?: string;
    expired?: number;
    expiredLabel?: string;
    createTime?: string;
    updateTime?: string;
    initialPassword?: number;
    initialPasswordLabel?: string;
    mfaEnabled?: number;
  };

  type MfaSetupVO = {
    secret: string;
    otpauthUri: string;
  };

  type CurrentUser = SysUserVO;

  type UpdatePasswordParams = {
    password?: string;
  };

  type SysUserDTO = {
    username?: string;
    realName?: string;
    nickname?: string;
    // 可清空字段(后端 JsonNullable): 传 null 表示清空
    avatar?: string | null;
    gender?: number;
    birthday?: string | null;
    remark?: string | null;
    roleCodes?: string[];
    orgCodes?: string[];
    status?: number;
    mobile?: string;
    email?: string;
    password?: string;
    expireDate?: string | null;
  };

  type PageResult<T> = {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };

  type SysRoleVO = {
    id: number;
    roleName: string;
    roleCode: string;
    roleDesc?: string;
    status: number;
    statusLabel?: string;
    createTime?: string;
  };

  type SysRoleDTO = {
    roleName?: string;
    roleCode?: string;
    roleDesc?: string;
    status?: number;
    resourceIds?: number[];
  };

  type SysResourceVO = {
    id: number;
    parentId?: number;
    name: string;
    type: number;
    typeLabel?: string;
    permission?: string;
    path?: string;
    component?: string;
    method?: string;
    methodLabel?: string;
    icon?: string;
    sortOrder?: number;
    visible?: number;
    visibleLabel?: string;
    status: number;
    statusLabel?: string;
    createTime?: string;
  };

  type SysResourceDTO = {
    parentId?: number;
    name?: string;
    type?: number;
    permission?: string;
    path?: string;
    component?: string;
    method?: string;
    icon?: string;
    sortOrder?: number;
    visible?: number;
    status?: number;
  };

  type TreeNode<T> = {
    data: T;
    children: TreeNode<T>[];
  };
}
