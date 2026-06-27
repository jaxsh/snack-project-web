export default {
  // ==========================================
  // 通用多语言配置 (Common i18n Configuration)
  // ==========================================

  // 动作 (Actions)
  'pages.common.action.ok': '确定',
  'pages.common.action.confirm': '确认',
  'pages.common.action.cancel': '取消',
  'pages.common.action.columnLabel': '操作',
  'pages.common.action.create': '新建',
  'pages.common.action.edit': '编辑',
  'pages.common.action.modify': '修改',
  'pages.common.action.delete': '删除',
  'pages.common.action.batchDelete': '批量删除',
  'pages.common.action.clearSelection': '取消选择',
  'pages.common.action.confirmDelete': '确认删除',
  'pages.common.action.reset': '重置',
  'pages.common.action.save': '保存',
  'pages.common.action.backToHome': '返回首页',
  'pages.common.action.modifyField': '修改{field}',
  'pages.common.action.bindField': '绑定{field}',
  'pages.common.action.unbindField': '解绑{field}',
  'pages.common.action.bind': '绑定',
  'pages.common.action.unbind': '解绑',
  'pages.common.action.changeAvatar': '更换头像',
  'pages.common.action.detail': '详情',

  // 交互结果反馈 (Interaction Feedback)
  'pages.common.feedback.create.success': '创建成功',
  'pages.common.feedback.update.success': '修改成功',
  'pages.common.feedback.delete.success': '删除成功',
  'pages.common.feedback.save.success': '保存成功',
  'pages.common.feedback.delete.confirm': '确定要删除 {name} 吗？',
  'pages.common.feedback.batchDelete.confirm': '确定要删除这 {count} 项吗？',

  // 通用字段 (Common Fields)
  'pages.common.fields.createTime': '创建时间',
  'pages.common.fields.updateTime': '更新时间',
  'pages.common.fields.status': '状态',
  'pages.common.fields.remark': '备注',

  // 数据字典 (Dictionaries)
  'pages.common.dict.status.label': '状态',
  'pages.common.dict.status.enabled': '启用',
  'pages.common.dict.status.disabled': '禁用',
  'pages.common.dict.yesNo.yes': '是',
  'pages.common.dict.yesNo.no': '否',
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
  'pages.common.validation.placeholder.select': '请选择{field}',
  'pages.common.validation.required': '{field}是必填项！',
  'pages.common.validation.invalid': '不合法的{field}格式！',
  'pages.common.validation.maxLength': '{field}不能超过 {max} 个字符',
  'pages.common.validation.rangeLength':
    '{field}长度在 {min} 到 {max} 个字符之间',
  'pages.common.validation.passwordPattern':
    '密码必须包含大小写字母、数字和特殊字符！',

  // 文案 (Text)
  'pages.common.text.bound': '已绑定',
  'pages.common.text.unbound': '未绑定',
  'pages.common.text.themeSwitch': '主题切换',
  'pages.common.text.langSwitch': '语言切换',
  'pages.common.text.selectedCount': '已选 {count} 项',
  'pages.common.text.changePasswordTitle': '修改账户密码',

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
  'pages.changePassword.text.description':
    '当前使用的是初始密码或密码已过期，请修改密码后继续使用。',
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
  'pages.security.text.mfaTitle': 'MFA 设备',
  'pages.security.text.mfaDescription':
    '使用验证器 App 扫描二维码，输入 6 位验证码完成绑定。若 App 中已有此账号的条目，无需重新扫码，直接输入验证码即可。',
  'pages.security.text.mfaDisableConfirm':
    '解绑后登录将不再需要二次验证，确定解绑吗？',
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
  'pages.system.user.text.detailTitle': '用户详情 - {username}',
  'pages.system.user.text.tabBasic': '基本信息',
  'pages.system.user.text.tabUpms': '系统与权限',
  'pages.system.user.text.tabSecurity': '安全与账号',
  'pages.system.user.text.expireNever': '永不到期',
  'pages.system.user.text.authInfoTitle': '认证信息',

  // 系统管理 - 用户管理页面字段 label
  'pages.system.user.fields.username': '用户名',
  'pages.system.user.fields.password': '账户密码',
  'pages.system.user.fields.newPassword': '新密码',
  'pages.system.user.fields.confirmPassword': '确认新密码',
  'pages.system.user.fields.nickname': '昵称',
  'pages.system.user.fields.realName': '真实姓名',
  'pages.system.user.fields.avatar': '头像',
  'pages.system.user.fields.gender': '性别',
  'pages.system.user.fields.birthday': '生日',
  'pages.system.user.fields.mobile': '手机号',
  'pages.system.user.fields.email': '邮箱',
  'pages.system.user.fields.lastActiveTime': '最后活跃时间',
  'pages.system.user.fields.roleCodes': '角色',
  'pages.system.user.fields.expireDate': '账户到期日',
  'pages.system.user.fields.expireDateTip': '留空表示永不到期',
  'pages.system.user.fields.locked': '锁定状态',
  'pages.system.user.fields.initialPassword': '初始密码',
  'pages.system.user.fields.mfaEnabled': 'MFA',
  'pages.system.user.fields.credentialStatus': '密码过期',
  'pages.system.user.fields.passwordExpireTime': '密码到期时间',
  'pages.system.user.fields.passwordExpireTime.never': '永不到期',
  'pages.system.user.fields.activeSession': '活跃会话 ({id})',
  'pages.system.user.fields.mfaCode': '验证码',
  'pages.system.user.fields.status': '状态',

  // 系统管理 - 角色管理页面
  'pages.system.role.fields.roleName': '角色名称',
  'pages.system.role.fields.roleCode': '角色编码',
  'pages.system.role.fields.roleDesc': '角色描述',
  'pages.system.role.fields.status': '状态',
  'pages.system.role.fields.resources': '资源权限',
  'pages.system.role.action.assignResources': '权限配置',
  'pages.system.role.text.assignResourcesTitle': '权限配置 - {roleName}',
  'pages.system.role.placeholder.searchResources': '搜索资源名称',
  'pages.system.role.action.expandAll': '展开全部',
  'pages.system.role.action.collapseAll': '折叠全部',
  'pages.system.role.action.checkAll': '全选',
  'pages.system.role.action.uncheckAll': '清空',
  'pages.system.role.text.selectedCount': '已选 {count} 项',

  // 系统管理 - 权限管理页面
  'pages.system.resource.fields.parentId': '父节点',
  'pages.system.resource.fields.name': '资源名称',
  'pages.system.resource.fields.type': '类型',
  'pages.system.resource.fields.permission': '权限标识',
  'pages.system.resource.fields.path': '路径',
  'pages.system.resource.fields.component': '组件路径',
  'pages.system.resource.fields.icon': '图标',
  'pages.system.resource.fields.sortOrder': '排序',
  'pages.system.resource.fields.visible': '是否显示',
  'pages.system.resource.fields.method': '请求方法',
  'pages.system.resource.fields.status': '状态',
  'pages.system.resource.type.menu': '菜单',
  'pages.system.resource.type.button': '按钮',
  'pages.system.resource.type.api': '接口',
  'pages.system.resource.action.addChild': '添加下级',
  'pages.system.resource.action.deleteWithChildren':
    '将同时删除所有下级资源，确认继续？',
  'pages.system.resource.disableChildren.confirm':
    '禁用后，所有下级资源将一并禁用，确认继续？',
};
