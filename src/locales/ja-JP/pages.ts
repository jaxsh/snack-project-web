export default {
  // ==========================================
  // 通用多语言配置 (Common i18n Configuration)
  // ==========================================

  // 動作 (Actions)
  'pages.common.action.ok': '確定',
  'pages.common.action.cancel': 'キャンセル',
  'pages.common.action.columnLabel': '操作',
  'pages.common.action.create': '新規作成',
  'pages.common.action.edit': '編集',
  'pages.common.action.modify': '変更',
  'pages.common.action.delete': '削除',
  'pages.common.action.batchDelete': '一括削除',
  'pages.common.action.confirmDelete': '削除の確認',
  'pages.common.action.save': '保存',
  'pages.common.action.backToHome': 'ホームに戻る',

  // インタラクション結果フィードバック (Interaction Feedback)
  'pages.common.feedback.create.success': '作成に成功しました',
  'pages.common.feedback.update.success': '更新に成功しました',
  'pages.common.feedback.delete.success': '削除に成功しました',
  'pages.common.feedback.save.success': '保存に成功しました',
  'pages.common.feedback.delete.confirm': '{name} を削除してもよろしいですか？',
  'pages.common.feedback.batchDelete.confirm':
    'これら {count} 件のアイテムを削除してもよろしいですか？この操作は取り消せません。',

  // データ辞書 (Dictionaries)
  'pages.common.dict.status.label': 'ステータス',
  'pages.common.dict.status.enabled': '有効',
  'pages.common.dict.status.disabled': '無効',
  'pages.common.dict.gender.label': '性別',
  'pages.common.dict.gender.unknown': '不明',
  'pages.common.dict.gender.male': '男性',
  'pages.common.dict.gender.female': '女性',
  'pages.common.dict.passwordStrength.label': 'パスワード強度：',
  'pages.common.dict.passwordStrength.weak': '弱',
  'pages.common.dict.passwordStrength.medium': '中',
  'pages.common.dict.passwordStrength.strong': '強',
  'pages.common.dict.theme.auto': 'システムに従う',
  'pages.common.dict.theme.light': 'ライトテーマ',
  'pages.common.dict.theme.dark': 'ダークテーマ',

  // バリデーションルールとプレースホルダー (Validation & Placeholders)
  'pages.common.validation.placeholder.input': '{field}を入力してください',
  'pages.common.validation.required': '{field}を入力してください！',
  'pages.common.validation.invalid': '無効な{field}形式です！',
  'pages.common.validation.maxLength': '{field}は最大 {max} 文字です',
  'pages.common.validation.rangeLength':
    '{field}は {min} 文字から {max} 文字の間でなければなりません',
  'pages.common.validation.passwordPattern':
    'パスワードには大文字、小文字、数字、および特殊文字を含める必要があります！',

  // テキスト (Text)
  'pages.common.text.themeSwitch': 'テーマ切り替え',
  'pages.common.text.langSwitch': '言語切り替え',

  // ==========================================
  // 各業務ページ専用設定 (Page Specific Configuration)
  // ==========================================

  // 404/403/500 ページ
  'pages.404.text.subTitle':
    '申し訳ありませんが、アクセスしたページは存在しません。',
  'pages.403.text.subTitle':
    '申し訳ありませんが、このページへのアクセスは許可されていません。',
  'pages.500.text.subTitle':
    '申し訳ありません、サーバーでエラーが発生しました。',

  // ログインページ
  'pages.login.text.layoutTitle':
    'Ant Designは、西湖区で最も影響力のあるWebデザイン仕様です。',
  'pages.login.text.accountLoginTab': 'アカウントログイン',
  'pages.login.text.phoneLoginTab': '電話ログイン',
  'pages.login.text.captchaCountdown': '秒',
  'pages.login.text.loginWith': 'その他のログイン方法：',
  'pages.login.action.getVerificationCode': '確認コードを取得',
  'pages.login.action.forgotPassword': 'パスワードをお忘れですか？',
  'pages.login.action.submit': 'ログイン',
  'pages.login.feedback.success': 'ログイン成功!',
  'pages.login.fields.username': 'ユーザー名',
  'pages.login.fields.password': 'パスワード',
  'pages.login.fields.mobile': '携帯電話番号',
  'pages.login.fields.captcha': '確認コード',
  'pages.login.fields.rememberMe': '自動ログイン',

  // パスワード変更ページ
  'pages.changePassword.text.title': 'パスワードの強制再設定',
  'pages.changePassword.text.modalTitle': 'パスワードの変更',
  'pages.changePassword.text.description':
    '初期パスワードまたは期限切れのパスワードを変更してください。',
  'pages.changePassword.action.submit': '確認',
  'pages.changePassword.feedback.success':
    'パスワードの変更に成功しました。リダイレクト中…',
  'pages.changePassword.fields.newPassword': '新しいパスワード',
  'pages.changePassword.fields.confirmPassword': '新しいパスワード（確認）',
  'pages.changePassword.validation.confirmPassword.placeholder':
    'もう一度新しいパスワードを入力してください',
  'pages.changePassword.validation.confirmPassword.required':
    '確認のため、もう一度新しいパスワードを入力してください！',
  'pages.changePassword.validation.confirmPassword.mismatch':
    '入力されたパスワードが一致しません！',

  // アカウント設定
  'pages.settings.text.menuBase': '基本設定',
  'pages.settings.text.menuSecurity': 'セキュリティ設定',

  // アカウント設定 - 基本設定
  'pages.base.fields.nickname': 'ニックネーム',
  'pages.base.fields.realName': '本名',
  'pages.base.fields.birthday': '誕生日',
  'pages.base.text.avatarTitle': 'アバター',
  'pages.base.action.changeAvatar': 'アバター変更',

  // アカウント設定 - セキュリティ設定
  'pages.security.text.passwordTitle': 'パスワード',
  'pages.security.text.passwordDescription': '現在のパスワード強度：強',
  'pages.security.text.mobileTitle': '携帯電話番号',
  'pages.security.text.mobileBound': '登録済み：{mobile}',
  'pages.security.text.mobileUnbound': '未登録',
  'pages.security.text.mobileModalTitle': '携帯電話番号の変更',
  'pages.security.text.emailTitle': 'メールアドレス',
  'pages.security.text.emailBound': '登録済み：{email}',
  'pages.security.text.emailUnbound': '未登録',
  'pages.security.text.emailModalTitle': 'メールアドレスの変更',
  'pages.security.action.submit': '変更を確認',
  'pages.security.fields.password': 'パスワード',
  'pages.security.fields.mobile': '携帯電話番号',
  'pages.security.fields.email': 'メールアドレス',
  'pages.security.fields.newPassword': '新しいパスワード',
  'pages.security.fields.confirmPassword': '新しいパスワード（確認）',

  // システム管理 - ユーザー管理
  'pages.system.user.feedback.resetPassword.success': 'パスワードリセット完了',
  'pages.system.user.feedback.unlock.success': 'ロック解除完了',
  'pages.system.user.feedback.revoke.success': '強制ログアウト完了',
  'pages.system.user.action.unlock': 'アカウントロック解除',
  'pages.system.user.action.revoke': '強制ログアウト',
  'pages.system.user.action.resetPassword': 'パスワードリセット',
  'pages.system.user.text.resetPasswordTitle':
    'パスワードリセット - {username}',

  // システム管理 - ユーザー管理フィールド
  'pages.system.user.fields.newPassword': '新しいパスワード',
  'pages.system.user.fields.avatar': 'アバター',
  'pages.system.user.fields.username': 'ユーザー名',
  'pages.system.user.fields.realName': '本名',
  'pages.system.user.fields.nickname': 'ニックネーム',
  'pages.system.user.fields.gender': '性別',
  'pages.system.user.fields.birthday': '誕生日',
  'pages.system.user.fields.mobile': '携帯電話',
  'pages.system.user.fields.email': 'メールアドレス',
  'pages.system.user.fields.status': 'ステータス',
  'pages.system.user.fields.remark': '備考',
  'pages.system.user.fields.lastActiveTime': '最終アクティブ',
};
