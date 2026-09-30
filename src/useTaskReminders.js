import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { daysLeft, today } from './utils';

const ENABLED_KEY = 'edukast-reminders-enabled';
const SENT_KEY = 'edukast-reminder-sent';
const REMINDER_MARKER = 'edukastReminder';

function notificationId(taskId, kind) {
  let hash = 0;
  for (const character of String(taskId)) hash = (hash * 31 + character.charCodeAt(0)) % 700_000_000;
  return hash * 3 + ({ tomorrow: 1, today: 2, overdue: 3 }[kind]);
}

function atNine(date) {
  const reminder = new Date(date);
  reminder.setHours(9, 0, 0, 0);
  return reminder;
}

function nativeReminders(tasks) {
  const now = new Date();
  return tasks.flatMap((task) => {
    if (task.done) return [];

    const remaining = daysLeft(task.date);
    const due = new Date(`${task.date}T09:00:00`);
    let kind;
    let schedule;
    let sortAt;
    if (remaining === 1) {
      kind = 'tomorrow';
      due.setDate(due.getDate() - 1);
      schedule = { at: due };
      sortAt = due;
    } else if (remaining === 0) {
      kind = 'today';
      sortAt = due > now ? due : new Date(now.getTime() + 60_000);
      schedule = { at: sortAt };
    } else if (remaining < 0) {
      kind = 'overdue';
      sortAt = atNine(now);
      if (sortAt <= now) sortAt.setDate(sortAt.getDate() + 1);
      schedule = { on: { hour: sortAt.getHours(), minute: sortAt.getMinutes() } };
    } else {
      return [];
    }

    const when = kind === 'tomorrow' ? 'Entrega mañana' : kind === 'today' ? 'Entrega para hoy' : 'Tarea pendiente vencida';
    return [{
      notification: {
        id: notificationId(task.id, kind),
        title: when,
        body: `${task.name} · ${task.subject}`,
        schedule,
        extra: { [REMINDER_MARKER]: true, taskId: String(task.id) },
      },
      sortAt,
    }];
  }).sort((left, right) => left.sortAt - right.sortAt).slice(0, 60).map(({ notification }) => notification);
}

export default function useTaskReminders(tasks) {
  const native = Capacitor.isNativePlatform();
  const browserSupported = typeof window !== 'undefined' && 'Notification' in window;
  const supported = native || browserSupported;
  const [permission, setPermission] = useState(() => native ? 'prompt' : browserSupported ? Notification.permission : 'unsupported');
  const [enabled, setEnabled] = useState(() => localStorage.getItem(ENABLED_KEY) === 'true' && (native || (browserSupported && Notification.permission === 'granted')));
  const registration = useRef(null);

  useEffect(() => {
    if (!native) return undefined;
    let mounted = true;
    LocalNotifications.checkPermissions().then(({ display }) => {
      if (!mounted) return;
      setPermission(display);
      setEnabled(display === 'granted' && localStorage.getItem(ENABLED_KEY) === 'true');
    }).catch(() => {
      if (mounted) setPermission('denied');
    });
    return () => { mounted = false; };
  }, [native]);

  const toggle = async () => {
    if (enabled) {
      localStorage.setItem(ENABLED_KEY, 'false');
      setEnabled(false);
      return;
    }
    if (!supported) return;

    if (native) {
      let result = await LocalNotifications.checkPermissions();
      if (result.display !== 'granted') result = await LocalNotifications.requestPermissions();
      setPermission(result.display);
      if (result.display === 'granted') {
        localStorage.setItem(ENABLED_KEY, 'true');
        setEnabled(true);
      }
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== 'granted') return;

    if ('serviceWorker' in navigator) {
      try {
        registration.current = await navigator.serviceWorker.register('/sw.js');
      } catch {
        registration.current = null;
      }
    }
    localStorage.setItem(ENABLED_KEY, 'true');
    setEnabled(true);
  };

  useEffect(() => {
    if (native) {
      let current = true;
      const syncNativeReminders = async () => {
        try {
          const { notifications: pending } = await LocalNotifications.getPending();
          if (!current) return;
          const managed = pending.filter((notification) => notification.extra?.[REMINDER_MARKER]);
          if (managed.length) await LocalNotifications.cancel({ notifications: managed.map(({ id }) => ({ id })) });
          if (!current || !enabled || permission !== 'granted') return;
          const notifications = nativeReminders(tasks);
          if (notifications.length) await LocalNotifications.schedule({ notifications });
        } catch {
          // The app remains usable when notification scheduling is unavailable.
        }
      };
      syncNativeReminders();
      return () => { current = false; };
    }

    if (!enabled || permission !== 'granted') return undefined;

    const checkReminders = async () => {
      const now = new Date();
      if (now.getHours() < 9) return;

      for (const task of tasks) {
        if (task.done) continue;
        const remaining = daysLeft(task.date);
        const kind = remaining === 1 ? 'tomorrow' : remaining === 0 ? 'today' : remaining < 0 ? 'overdue' : null;
        if (!kind) continue;

        const sentKey = `${SENT_KEY}:${today()}:${task.id}:${kind}`;
        if (localStorage.getItem(sentKey)) continue;
        localStorage.setItem(sentKey, 'true');

        const title = kind === 'tomorrow' ? 'Entrega mañana' : kind === 'today' ? 'Entrega para hoy' : 'Tarea pendiente vencida';
        const body = `${task.name} · ${task.subject}`;
        const options = { body, tag: sentKey, data: { url: '/' } };
        try {
          let activeRegistration = registration.current;
          if (!activeRegistration && 'serviceWorker' in navigator) {
            activeRegistration = await navigator.serviceWorker.ready;
            registration.current = activeRegistration;
          }
          if (activeRegistration) await activeRegistration.showNotification(title, options);
          else new Notification(title, options);
        } catch {
          if ('Notification' in window && Notification.permission === 'granted') new Notification(title, options);
        }
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') checkReminders();
    };
    checkReminders();
    const timer = window.setInterval(checkReminders, 60_000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [enabled, native, permission, tasks]);

  return { enabled, permission, supported, toggle };
}