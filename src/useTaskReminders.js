import { useEffect, useRef, useState } from 'react';
import { daysLeft, today } from './utils';

const ENABLED_KEY = 'edukast-reminders-enabled';
const SENT_KEY = 'edukast-reminder-sent';

export default function useTaskReminders(tasks) {
  const supported = typeof window !== 'undefined' && 'Notification' in window;
  const [permission, setPermission] = useState(() => supported ? Notification.permission : 'unsupported');
  const [enabled, setEnabled] = useState(() => supported && Notification.permission === 'granted' && localStorage.getItem(ENABLED_KEY) === 'true');
  const registration = useRef(null);

  const toggle = async () => {
    if (enabled) {
      localStorage.setItem(ENABLED_KEY, 'false');
      setEnabled(false);
      return;
    }
    if (!supported) return;

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
  }, [enabled, permission, tasks]);

  return { enabled, permission, supported, toggle };
}