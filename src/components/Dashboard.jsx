import { useState } from 'react';
import { applyView, daysLeft } from '../utils';
import Notification from './Notification';
import Filters from './Filters';
import TaskList from './TaskList';

export default function Dashboard({ tasks, ...actions }) {
  const [view, setView] = useState({ filter: 'all', sort: 'near', query: '' });
  const pending = tasks.filter((t) => !t.done);
  const stats = [
    [tasks.length, 'Tareas totales', 'bi-collection-fill', 'primary'],
    [pending.length, 'Pendientes', 'bi-hourglass-split', 'warning'],
    [tasks.length - pending.length, 'Completadas', 'bi-check-circle-fill', 'success'],
    [pending.filter((t) => daysLeft(t.date) >= 0 && daysLeft(t.date) <= 3).length, 'Próximas a vencer', 'bi-alarm-fill', 'danger'],
  ];
  return (
    <>
      <h2 className="fw-bold mb-3">Resumen</h2>
      <div className="row g-3 mb-4">
        {stats.map(([n, label, icon, cls]) => (
          <div className="col-6 col-lg-3" key={label}>
            <div className="card stat-card shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className={`stat-icon bg-${cls}-subtle text-${cls}`}><i className={`bi ${icon}`}></i></span>
                <div><div className="fs-2 fw-bold lh-1">{n}</div><div className="text-muted small">{label}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Notification tasks={tasks} />
      <Filters view={view} setView={setView} />
      <TaskList tasks={applyView(tasks, view)} {...actions} />
    </>
  );
}
