export default {
  // ==========================================
  // 通用多语言配置 (Common i18n Configuration)
  // ==========================================

  // 动作 (Actions)
  'pages.common.action.ok': 'OK',
  'pages.common.action.cancel': 'Cancel',
  'pages.common.action.columnLabel': 'Actions',
  'pages.common.action.create': 'Create',
  'pages.common.action.edit': 'Edit',
  'pages.common.action.modify': 'Modify',
  'pages.common.action.delete': 'Delete',
  'pages.common.action.batchDelete': 'Batch Delete',
  'pages.common.action.confirmDelete': 'Confirm Delete',
  'pages.common.action.save': 'Save',
  'pages.common.action.backToHome': 'Back Home',

  // 交互结果反馈 (Interaction Feedback)
  'pages.common.feedback.create.success': 'Created successfully',
  'pages.common.feedback.update.success': 'Updated successfully',
  'pages.common.feedback.delete.success': 'Deleted successfully',
  'pages.common.feedback.save.success': 'Saved successfully',
  'pages.common.feedback.delete.confirm':
    'Are you sure you want to delete {name}?',
  'pages.common.feedback.batchDelete.confirm':
    'Are you sure you want to delete these {count} items? This action cannot be undone.',

  // 数据字典 (Dictionaries)
  'pages.common.dict.status.label': 'Status',
  'pages.common.dict.status.enabled': 'Enabled',
  'pages.common.dict.status.disabled': 'Disabled',
  'pages.common.dict.gender.label': 'Gender',
  'pages.common.dict.gender.unknown': 'Unknown',
  'pages.common.dict.gender.male': 'Male',
  'pages.common.dict.gender.female': 'Female',
  'pages.common.dict.passwordStrength.label': 'Strength: ',
  'pages.common.dict.passwordStrength.weak': 'Weak',
  'pages.common.dict.passwordStrength.medium': 'Medium',
  'pages.common.dict.passwordStrength.strong': 'Strong',
  'pages.common.dict.theme.auto': 'Follow system',
  'pages.common.dict.theme.light': 'Light Theme',
  'pages.common.dict.theme.dark': 'Dark Theme',

  // 校验规则与占位符 (Validation & Placeholders)
  'pages.common.validation.placeholder.input': 'Please enter {field}',
  'pages.common.validation.required': '{field} is required!',
  'pages.common.validation.invalid': 'Invalid {field} format!',
  'pages.common.validation.maxLength': '{field} cannot exceed {max} characters',
  'pages.common.validation.rangeLength':
    '{field} length must be between {min} and {max} characters',
  'pages.common.validation.passwordPattern':
    'Password must contain uppercase and lowercase letters, numbers, and special characters!',

  // 文案 (Text)
  'pages.common.text.themeSwitch': 'Switch Theme',
  'pages.common.text.langSwitch': 'Switch Language',

  // ==========================================
  // 各业务页面专属配置 (Page Specific Configuration)
  // ==========================================

  // 404/403/500 Pages
  'pages.404.text.subTitle': 'Sorry, the page you visited does not exist.',
  'pages.403.text.subTitle':
    'Sorry, you are not authorized to access this page.',
  'pages.500.text.subTitle': 'Sorry, something went wrong on the server.',

  // Login Page
  'pages.login.text.layoutTitle':
    'Ant Design is the most influential web design specification in Xihu district',
  'pages.login.text.accountLoginTab': 'Account Login',
  'pages.login.text.phoneLoginTab': 'Phone Login',
  'pages.login.text.captchaCountdown': 's later',
  'pages.login.text.loginWith': 'Login with :',
  'pages.login.action.getVerificationCode': 'Get Captcha',
  'pages.login.action.forgotPassword': 'Forgot Password ?',
  'pages.login.action.submit': 'Login',
  'pages.login.feedback.success': 'Login successfully!',
  'pages.login.fields.username': 'Username',
  'pages.login.fields.password': 'Password',
  'pages.login.fields.mobile': 'Mobile',
  'pages.login.fields.captcha': 'Captcha',
  'pages.login.fields.rememberMe': 'Remember me',

  // Change Password Page
  'pages.changePassword.text.title': 'Force Reset Password',
  'pages.changePassword.text.modalTitle': 'Change Password',
  'pages.changePassword.text.description':
    'Your password is temporary or has expired. Please update it to continue.',
  'pages.changePassword.action.submit': 'Confirm and Re-login',
  'pages.changePassword.feedback.success':
    'Password changed successfully, please log in again with your new password',
  'pages.changePassword.fields.newPassword': 'New Password',
  'pages.changePassword.fields.confirmPassword': 'Confirm New Password',
  'pages.changePassword.validation.confirmPassword.placeholder':
    'Please confirm your new password',
  'pages.changePassword.validation.confirmPassword.required':
    'Please confirm your new password!',
  'pages.changePassword.validation.confirmPassword.mismatch':
    'The passwords entered twice do not match!',

  // Account Settings
  'pages.settings.text.menuBase': 'Basic Settings',
  'pages.settings.text.menuSecurity': 'Security Settings',

  // Account Settings - Basic
  'pages.base.fields.nickname': 'Nickname',
  'pages.base.fields.realName': 'Real Name',
  'pages.base.fields.birthday': 'Birthday',
  'pages.base.text.avatarTitle': 'Avatar',
  'pages.base.action.changeAvatar': 'Change Avatar',

  // Account Settings - Security
  'pages.security.text.passwordTitle': 'Account Password',
  'pages.security.text.passwordDescription':
    'Current password strength: Strong',
  'pages.security.text.mobileTitle': 'Mobile Number',
  'pages.security.text.mobileBound': 'Bound: {mobile}',
  'pages.security.text.mobileUnbound': 'Not bound',
  'pages.security.text.mobileModalTitle': 'Change Mobile Number',
  'pages.security.text.emailTitle': 'Email Address',
  'pages.security.text.emailBound': 'Bound: {email}',
  'pages.security.text.emailUnbound': 'Not bound',
  'pages.security.text.emailModalTitle': 'Change Email Address',
  'pages.security.action.submit': 'Confirm Modify',
  'pages.security.fields.password': 'Password',
  'pages.security.fields.mobile': 'Mobile',
  'pages.security.fields.email': 'Email',
  'pages.security.fields.newPassword': 'New Password',
  'pages.security.fields.confirmPassword': 'Confirm New Password',

  // User Management
  'pages.system.user.feedback.resetPassword.success': 'Password reset',
  'pages.system.user.feedback.unlock.success': 'Account unlocked',
  'pages.system.user.feedback.revoke.success': 'Forced offline',
  'pages.system.user.action.unlock': 'Unlock',
  'pages.system.user.action.revoke': 'Force Offline',
  'pages.system.user.action.resetPassword': 'Reset Password',
  'pages.system.user.text.resetPasswordTitle': 'Reset Password - {username}',

  // User Management fields label
  'pages.system.user.fields.newPassword': 'New Password',
  'pages.system.user.fields.avatar': 'Avatar',
  'pages.system.user.fields.username': 'Username',
  'pages.system.user.fields.realName': 'Real Name',
  'pages.system.user.fields.nickname': 'Nickname',
  'pages.system.user.fields.gender': 'Gender',
  'pages.system.user.fields.birthday': 'Birthday',
  'pages.system.user.fields.mobile': 'Mobile',
  'pages.system.user.fields.email': 'Email',
  'pages.system.user.fields.status': 'Status',
  'pages.system.user.fields.remark': 'Remark',
  'pages.system.user.fields.lastActiveTime': 'Last Active',
};
