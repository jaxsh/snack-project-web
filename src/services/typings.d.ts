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
    nickname?: string;
    avatar?: string;
    email?: string;
    mobile?: string;
    status: number;
    access?: string;
    realName?: string;
    gender?: number;
    birthday?: string;
    initialPassword?: number;
    expired?: number;
  };

  type CurrentUser = SysUserVO;

  type UpdatePasswordParams = {
    password?: string;
  };
}
