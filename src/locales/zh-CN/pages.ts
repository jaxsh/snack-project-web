export default {
  // ==========================================
  // 通用多语言配置 (Common i18n Configuration)
  // ==========================================

  // 动作 (Actions)
  'pages.common.action.ok': '确定',
  'pages.common.action.cancel': '取消',
  'pages.common.action.columnLabel': '操作',
  'pages.common.action.create': '新建',
  'pages.common.action.edit': '编辑',
  'pages.common.action.modify': '修改',
  'pages.common.action.delete': '删除',
  'pages.common.action.batchDelete': '批量删除',
  'pages.common.action.confirmDelete': '确认删除',
  'pages.common.action.save': '保存',
  'pages.common.action.backToHome': '返回首页',

  // 交互结果反馈 (Interaction Feedback)
  'pages.common.feedback.create.success': '创建成功',
  'pages.common.feedback.update.success': '修改成功',
  'pages.common.feedback.delete.success': '删除成功',
  'pages.common.feedback.save.success': '保存成功',
  'pages.common.feedback.delete.confirm': '确定要删除 {name} 吗？',
  'pages.common.feedback.batchDelete.confirm':
    '确定要删除这 {count} 项吗？此操作无法撤销。',

  // 数据字典 (Dictionaries)
  'pages.common.dict.status.label': '状态',
  'pages.common.dict.status.enabled': '启用',
  'pages.common.dict.status.disabled': '禁用',
  'pages.common.dict.gender.label': '性别',
  'pages.common.dict.gender.unknown': '未知',
  'pages.common.dict.gender.male': '男',
  'pages.common.dict.gender.female': '女',
  'pages.common.dict.passwordStrength.label': '密码强度：',
  'pages.common.dict.passwordStrength.weak': '弱',
  'pages.common.dict.passwordStrength.medium': '中',
  'pages.common.dict.passwordStrength.strong': '强',
  'pages.common.dict.theme.auto': '跟随系统',
  'pages.common.dict.theme.light': '浅色主题',
  'pages.common.dict.theme.dark': '暗黑主题',

  // 校验规则与占位符 (Validation & Placeholders)
  'pages.common.validation.placeholder.input': '请输入{field}',
  'pages.common.validation.required': '{field}是必填项！',
  'pages.common.validation.invalid': '不合法的{field}格式！',
  'pages.common.validation.maxLength': '{field}不能超过 {max} 个字符',
  'pages.common.validation.rangeLength':
    '{field}长度在 {min} 到 {max} 个字符之间',
  'pages.common.validation.passwordPattern':
    '密码必须包含大小写字母、数字和特殊字符！',

  // 文案 (Text)
  'pages.common.text.themeSwitch': '主题切换',
  'pages.common.text.langSwitch': '语言切换',

  // ==========================================
  // 各业务页面专属配置 (Page Specific Configuration)
  // ==========================================

  // 404/403/500 页面
  'pages.404.text.subTitle': '抱歉，您访问的页面不存在。',
  'pages.403.text.subTitle': '抱歉，您无权访问此页面。',
  'pages.500.text.subTitle': '抱歉，服务器出错了。',

  // 登录页面
  'pages.login.text.layoutTitle':
    'Ant Design 是西湖区最具影响力的 Web 设计规范',
  'pages.login.text.accountLoginTab': '账户密码登录',
  'pages.login.text.phoneLoginTab': '手机号登录',
  'pages.login.text.captchaCountdown': '秒后重新获取',
  'pages.login.text.loginWith': '其他登录方式 :',
  'pages.login.action.getVerificationCode': '获取验证码',
  'pages.login.action.forgotPassword': '忘记密码 ?',
  'pages.login.action.submit': '登录',
  'pages.login.feedback.success': '登录成功！',
  'pages.login.fields.username': '用户名',
  'pages.login.fields.password': '密码',
  'pages.login.fields.mobile': '手机号',
  'pages.login.fields.captcha': '验证码',
  'pages.login.fields.rememberMe': '自动登录',

  // 强制/修改密码页面
  'pages.changePassword.text.title': '强制重置密码',
  'pages.changePassword.text.modalTitle': '修改密码',
  'pages.changePassword.text.description':
    '当前使用的是初始密码或密码已过期，请修改密码后继续使用。',
  'pages.changePassword.action.submit': '确认修改',
  'pages.changePassword.feedback.success': '密码修改成功，正在跳转…',
  'pages.changePassword.fields.newPassword': '新密码',
  'pages.changePassword.fields.confirmPassword': '确认新密码',
  'pages.changePassword.validation.confirmPassword.placeholder':
    '请再次输入新密码',
  'pages.changePassword.validation.confirmPassword.required':
    '请再次输入新密码以进行确认！',
  'pages.changePassword.validation.confirmPassword.mismatch':
    '两次输入的密码不一致！',
  'pages.verifyMfa.text.title': 'MFA 验证',
  'pages.verifyMfa.text.description': '请输入验证器 App 中显示的 6 位验证码',
  'pages.verifyMfa.action.submit': '验证',
  'pages.verifyMfa.fields.code': '验证码',
  'pages.verifyMfa.feedback.success': '验证成功，正在跳转…',

  // 个人中心/设置
  'pages.settings.text.menuBase': '基本设置',
  'pages.settings.text.menuSecurity': '安全设置',

  // 个人中心/设置 - 基本设置
  'pages.base.fields.nickname': '昵称',
  'pages.base.fields.realName': '真实姓名',
  'pages.base.fields.birthday': '生日',
  'pages.base.text.avatarTitle': '头像',
  'pages.base.action.changeAvatar': '更换头像',

  // 个人中心/设置 - 安全设置
  'pages.security.text.passwordTitle': '账户密码',
  'pages.security.text.passwordDescription': '当前密码强度：强',
  'pages.security.text.mobileTitle': '手机号',
  'pages.security.text.mobileBound': '已绑定：{mobile}',
  'pages.security.text.mobileUnbound': '未绑定',
  'pages.security.text.mobileModalTitle': '修改手机号',
  'pages.security.text.emailTitle': '邮箱',
  'pages.security.text.emailBound': '已绑定：{email}',
  'pages.security.text.emailUnbound': '未绑定',
  'pages.security.text.emailModalTitle': '修改邮箱',
  'pages.security.action.submit': '确认修改',
  'pages.security.fields.password': '账户密码',
  'pages.security.fields.mobile': '手机号',
  'pages.security.fields.email': '邮箱',
  'pages.security.fields.newPassword': '新密码',
  'pages.security.fields.confirmPassword': '确认新密码',
  'pages.security.text.mfaTitle': 'MFA 设备',
  'pages.security.text.mfaEnabled': '已绑定',
  'pages.security.text.mfaDisabled':
    '未绑定 MFA 设备，绑定后，可以进行二次确认',
  'pages.security.text.mfaModalTitle': '绑定 MFA 设备',
  'pages.security.text.mfaDescription':
    '使用验证器 App 扫描二维码，输入 6 位验证码完成绑定',
  'pages.security.text.mfaSecret': '手动输入密钥',
  'pages.security.text.mfaDisableConfirm':
    '解绑后登录将不再需要二次验证，确定解绑吗？',
  'pages.security.action.mfaEnable': '绑定',
  'pages.security.action.mfaDisable': '解绑',
  'pages.security.action.mfaConfirm': '确认绑定',
  'pages.security.fields.mfaCode': '验证码',
  'pages.security.validation.mfaCode': '请输入 6 位数字验证码',

  // 系统管理 - 用户管理页面
  'pages.system.user.feedback.resetPassword.success': '密码重置成功',
  'pages.system.user.feedback.unlock.success': '解锁成功',
  'pages.system.user.feedback.revoke.success': '强制下线成功',
  'pages.system.user.feedback.resetMfa.success': 'MFA 重置成功',
  'pages.system.user.action.unlock': '解锁账号',
  'pages.system.user.action.revoke': '强制下线',
  'pages.system.user.action.resetPassword': '重置密码',
  'pages.system.user.action.resetMfa': '重置 MFA',
  'pages.system.user.text.resetPasswordTitle': '重置密码 - {username}',
  'pages.system.user.text.resetMfaConfirm':
    '确定要重置 {name} 的 MFA 绑定吗？重置后用户需重新绑定验证器才能使用 MFA。',

  // 系统管理 - 用户管理页面字段 label
  'pages.system.user.fields.newPassword': '新密码',
  'pages.system.user.fields.avatar': '头像',
  'pages.system.user.fields.username': '用户名',
  'pages.system.user.fields.realName': '真实姓名',
  'pages.system.user.fields.nickname': '昵称',
  'pages.system.user.fields.gender': '性别',
  'pages.system.user.fields.birthday': '生日',
  'pages.system.user.fields.mobile': '手机',
  'pages.system.user.fields.email': '邮箱',
  'pages.system.user.fields.status': '状态',
  'pages.system.user.fields.remark': '备注',
  'pages.system.user.fields.lastActiveTime': '最后活跃时间',
};
