export default {
  // ==========================================
  // 通用多语言配置 (Common i18n Configuration)
  // ==========================================

  // 動作 (Actions)
  'pages.common.action.ok': '確定',
  'pages.common.action.confirm': '確認',
  'pages.common.action.cancel': 'キャンセル',
  'pages.common.action.columnLabel': '操作',
  'pages.common.action.create': '新規作成',
  'pages.common.action.edit': '編集',
  'pages.common.action.modify': '変更',
  'pages.common.action.delete': '削除',
  'pages.common.action.batchDelete': '一括削除',
  'pages.common.action.clearSelection': '選択解除',
  'pages.common.action.confirmDelete': '削除の確認',
  'pages.common.action.reset': 'リセット',
  'pages.common.action.save': '保存',
  'pages.common.action.backToHome': 'ホームに戻る',
  'pages.common.action.modifyField': '{field}の変更',
  'pages.common.action.bindField': '{field}の登録',
  'pages.common.action.unbindField': '{field}の登録解除',
  'pages.common.action.bind': '登録',
  'pages.common.action.unbind': '解除',
  'pages.common.action.changeAvatar': 'アバター変更',
  'pages.common.action.detail': '詳細',

  // インタラクション結果フィードバック (Interaction Feedback)
  'pages.common.feedback.create.success': '作成に成功しました',
  'pages.common.feedback.update.success': '更新に成功しました',
  'pages.common.feedback.delete.success': '削除に成功しました',
  'pages.common.feedback.save.success': '保存に成功しました',
  'pages.common.feedback.delete.confirm': '{name} を削除してもよろしいですか？',
  'pages.common.feedback.batchDelete.confirm':
    'これら {count} 件のアイテムを削除してもよろしいですか？',

  // 通用フィールド (Common Fields)
  'pages.common.fields.createTime': '作成日時',
  'pages.common.fields.updateTime': '更新日時',
  'pages.common.fields.status': 'ステータス',
  'pages.common.fields.remark': '備考',

  // データ辞書 (Dictionaries)
  'pages.common.dict.status.label': 'ステータス',
  'pages.common.dict.status.enabled': '有効',
  'pages.common.dict.status.disabled': '無効',
  'pages.common.dict.yesNo.yes': 'はい',
  'pages.common.dict.yesNo.no': 'いいえ',
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
  'pages.common.validation.placeholder.select': '{field}を選択してください',
  'pages.common.validation.required': '{field}を入力してください！',
  'pages.common.validation.invalid': '無効な{field}形式です！',
  'pages.common.validation.maxLength': '{field}は最大 {max} 文字です',
  'pages.common.validation.rangeLength':
    '{field}は {min} 文字から {max} 文字の間でなければなりません',
  'pages.common.validation.passwordPattern':
    'パスワードには大文字、小文字、数字、および特殊文字を含める必要があります！',

  // テキスト (Text)
  'pages.common.text.bound': '登録済み',
  'pages.common.text.unbound': '未登録',
  'pages.common.text.themeSwitch': 'テーマ切り替え',
  'pages.common.text.langSwitch': '言語切り替え',
  'pages.common.text.selectedCount': '{count}件選択中',
  'pages.common.text.changePasswordTitle': 'アカウントパスワードの変更',

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
  'pages.login.fields.rememberMe': '次回から自動ログイン',

  // パスワード変更ページ
  'pages.changePassword.text.description':
    '初期パスワードまたは期限切れのパスワードを変更してください。',
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
  'pages.verifyMfa.text.title': 'MFA 認証',
  'pages.verifyMfa.text.description':
    '認証アプリに表示されている 6 桁のコードを入力してください',
  'pages.verifyMfa.action.submit': '認証',
  'pages.verifyMfa.fields.code': '確認コード',
  'pages.verifyMfa.feedback.success': '認証に成功しました。リダイレクト中…',

  // アカウント設定
  'pages.settings.text.menuBase': '基本設定',
  'pages.settings.text.menuSecurity': 'セキュリティ設定',

  // 個人設定 - 基本設定

  // アカウント設定 - セキュリティ設定
  'pages.security.text.mfaTitle': 'MFA デバイス',
  'pages.security.text.mfaDescription':
    '認証アプリでQRコードをスキャンし、6桁の確認コードを入力して紐付けを完了します。すでにこのアカウントの項目がある場合は、スキャンせずにコードを入力してください。',
  'pages.security.text.mfaDisableConfirm':
    '解除するとログイン時に2段階認証が不要になります。本当に解除しますか？',
  'pages.security.validation.mfaCode': '6桁の数字コードを入力してください',

  // システム管理 - ユーザー管理
  'pages.system.user.feedback.resetPassword.success': 'パスワードリセット完了',
  'pages.system.user.feedback.unlock.success': 'ロック解除完了',
  'pages.system.user.feedback.revoke.success': '強制ログアウト完了',
  'pages.system.user.feedback.resetMfa.success': 'MFA リセット完了',
  'pages.system.user.action.unlock': 'アカウントロック解除',
  'pages.system.user.action.revoke': '強制ログアウト',
  'pages.system.user.action.resetPassword': 'パスワードリセット',
  'pages.system.user.action.resetMfa': 'MFA リセット',
  'pages.system.user.text.resetPasswordTitle':
    'パスワードリセット - {username}',
  'pages.system.user.text.resetMfaConfirm':
    '{name} の MFA をリセットしてもよろしいですか？リセット後、ユーザーは認証アプリを再登録する必要があります。',
  'pages.system.user.text.detailTitle': 'ユーザー詳細 - {username}',
  'pages.system.user.text.tabBasic': '基本情報',
  'pages.system.user.text.tabUpms': 'システムと権限',
  'pages.system.user.text.tabSecurity': 'セキュリティとアカウント',
  'pages.system.user.text.expireNever': '無期限',
  'pages.system.user.text.authInfoTitle': '認証情報',

  // ユーザー管理フィールド
  'pages.system.user.fields.username': 'ユーザー名',
  'pages.system.user.fields.password': 'パスワード',
  'pages.system.user.fields.newPassword': '新しいパスワード',
  'pages.system.user.fields.confirmPassword': '新しいパスワード（確認）',
  'pages.system.user.fields.nickname': 'ニックネーム',
  'pages.system.user.fields.realName': '本名',
  'pages.system.user.fields.avatar': 'アバター',
  'pages.system.user.fields.gender': '性別',
  'pages.system.user.fields.birthday': '誕生日',
  'pages.system.user.fields.mobile': '携帯電話番号',
  'pages.system.user.fields.email': 'メールアドレス',
  'pages.system.user.fields.lastActiveTime': '最終アクティブ',
  'pages.system.user.fields.roleCodes': 'ロール',
  'pages.system.user.fields.expireDate': 'アカウント有効期限',
  'pages.system.user.fields.expireDateTip': '未入力の場合は無期限',
  'pages.system.user.fields.locked': 'ロック状態',
  'pages.system.user.fields.initialPassword': '初期パスワード',
  'pages.system.user.fields.mfaEnabled': 'MFA',
  'pages.system.user.fields.credentialStatus': 'パスワード期限切れ',
  'pages.system.user.fields.passwordExpireTime': 'パスワード有効期限',
  'pages.system.user.fields.passwordExpireTime.never': '無期限',
  'pages.system.user.fields.activeSession': 'アクティブなセッション ({id})',
  'pages.system.user.fields.mfaCode': '確認コード',
  'pages.system.user.fields.status': 'ステータス',

  // システム管理 - ロール管理
  'pages.system.role.fields.roleName': 'ロール名',
  'pages.system.role.fields.roleCode': 'ロールコード',
  'pages.system.role.fields.roleDesc': '説明',
  'pages.system.role.fields.status': 'ステータス',
  'pages.system.role.fields.resources': 'リソース権限',
  'pages.system.role.action.assignResources': '権限設定',
  'pages.system.role.text.assignResourcesTitle': '権限設定 - {roleName}',
  'pages.system.role.placeholder.searchResources': 'リソース名で検索',
  'pages.system.role.action.expandAll': '全て展開',
  'pages.system.role.action.collapseAll': '全て折りたたみ',
  'pages.system.role.action.checkAll': '全て選択',
  'pages.system.role.action.uncheckAll': 'クリア',
  'pages.system.role.text.selectedCount': '{count} 件選択中',

  // システム管理 - 権限管理
  'pages.system.resource.fields.parentId': '親ノード',
  'pages.system.resource.fields.name': 'リソース名',
  'pages.system.resource.fields.type': 'タイプ',
  'pages.system.resource.fields.permission': '権限識別子',
  'pages.system.resource.fields.path': 'パス',
  'pages.system.resource.fields.component': 'コンポーネントパス',
  'pages.system.resource.fields.icon': 'アイコン',
  'pages.system.resource.fields.sortOrder': '並び順',
  'pages.system.resource.fields.visible': '表示',
  'pages.system.resource.fields.method': 'HTTPメソッド',
  'pages.system.resource.fields.status': 'ステータス',
  'pages.system.resource.type.menu': 'メニュー',
  'pages.system.resource.type.button': 'ボタン',
  'pages.system.resource.type.api': 'API',
  'pages.system.resource.action.addChild': '下位追加',
  'pages.system.resource.action.deleteWithChildren':
    'すべての下位リソースも削除されます。続行しますか？',
  'pages.system.resource.disableChildren.confirm':
    '無効にすると、すべての下位リソースも無効になります。続行しますか？',
};
