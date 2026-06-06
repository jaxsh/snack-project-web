import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';

let _message: MessageInstance | null = null;
let _notification: NotificationInstance | null = null;

export function bindAntdApis(
  msg: MessageInstance,
  notif: NotificationInstance,
): void {
  _message = msg;
  _notification = notif;
}

export function staticMessage(): MessageInstance {
  if (!_message) {
    throw new Error(
      'staticMessage was called before bindAntdApis was executed.',
    );
  }
  return _message;
}

export function staticNotification(): NotificationInstance {
  if (!_notification) {
    throw new Error(
      'staticNotification was called before bindAntdApis was executed.',
    );
  }
  return _notification;
}
