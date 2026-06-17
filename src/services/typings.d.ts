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
    lastActiveTime?: string;
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
    avatar?: string;
    gender?: number;
    birthday?: string;
    remark?: string;
    roleCodes?: string[];
    orgCodes?: string[];
    status?: number;
    mobile?: string;
    email?: string;
    password?: string;
    expireDate?: string;
  };

  type PageResult<T> = {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}
