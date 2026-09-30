import { useState } from 'react';
import { daysLeft } from '../utils';

// Avisos dentro de la app: tareas vencidas o próximas a vencer (0 a 2 días)
export default function Notification({ tasks }) {
  const [hidden, setHidden] = useState([]);
  const alerts = tasks
    .filter((t) => !t.done && daysLeft(t.date) <= 2 && !hidden.includes(t.id))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => {
      const d = daysLeft(t.date);
      if (d < 0) return { t, cls: 'danger', icon: 'bi-exclamation-circle', msg: `La tarea de ${t.subject} "${t.name}" está vencida desde hace ${-d} día(s).` };
      const when = d === 0 ? 'vence hoy' : d === 1 ? 'vence mañana' : 'vence en 2 días';
      return { t, cls: 'warning', icon: 'bi-clock', msg: `La tarea de ${t.subject} "${t.name}" ${when}.` };
    });
  if (!alerts.length) return null;
  return (
    <div className="mb-4">
      {alerts.map(({ t, cls, icon, msg }) => (
        <div key={t.id} className={`alert alert-${cls} alert-dismissible fade show py-2 mb-2`} role="alert">
          <i className={`bi ${icon} me-2`} aria-hidden="true"></i>{msg}
          <button type="button" className="btn-close py-2" onClick={() => setHidden([...hidden, t.id])} aria-label="Cerrar"></button>
        </div>
      ))}
    </div>
  );
}
