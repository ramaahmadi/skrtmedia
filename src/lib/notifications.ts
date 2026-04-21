// Browser notification utilities

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return Promise.resolve('denied');
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }

  return Promise.resolve('denied');
}

export function showNotification(title: string, body: string, icon?: string) {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'skrt-notification',
      requireInteraction: true,
    });
  }
}

export function checkNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}
