import { useState } from 'react';
import { today, daysLeft, fmtDate } from '../utils';
import TaskList from './TaskList';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Estado visual de cada tarea en el calendario
const status = (t) => (t.done ? 'done' : daysLeft(t.date) < 0 ? 'late' : daysLeft(t.date) <= 3 ? 'soon' : 'pend');

export default function Calendar({ tasks, ...actions }) {
  const now = new Date();
  const [[y, m], setYm] = useState([now.getFullYear(), now.getMonth()]);
  const [sel, setSel] = useState(today());
  const first = (new Date(y, m, 1).getDay() + 6) % 7; // semana inicia en lunes
  const total = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const iso = (d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const move = (k) => { const d = new Date(y, m + k, 1); setYm([d.getFullYear(), d.getMonth()]); };

  return (
    <>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => move(-1)}><i className="bi bi-chevron-left"></i></button>
            <h4 className="mb-0 fw-bold">{MONTHS[m]} {y}</h4>
            <button className="btn btn-outline-primary btn-sm" onClick={() => move(1)}><i className="bi bi-chevron-right"></i></button>
          </div>
          <div className="cal-grid text-center small text-muted fw-semibold mb-1">{DAYS.map((d) => <div key={d}>{d}</div>)}</div>
          <div className="cal-grid">
            {cells.map((d, i) => {
              if (!d) return <div key={i}></div>;
              const date = iso(d);
              const dayTasks = tasks.filter((t) => t.date === date);
              return (
                <button key={i} className={`cal-cell ${date === sel ? 'sel' : ''} ${date === today() ? 'today' : ''}`} onClick={() => setSel(date)}>
                  <span>{d}</span>
                  <span className="dots">{dayTasks.slice(0, 4).map((t) => <i key={t.id} className={`dot ${status(t)}`}></i>)}</span>
                </button>
              );
            })}
          </div>
          <div className="d-flex flex-wrap gap-3 small text-muted mt-3">
            <span><i className="dot pend"></i> Pendiente</span>
            <span><i className="dot soon"></i> Próxima a vencer</span>
            <span><i className="dot late"></i> Vencida</span>
            <span><i className="dot done"></i> Completada</span>
          </div>
        </div>
      </div>
      <h5 className="fw-bold mb-3">Tareas del {fmtDate(sel)}</h5>
      <TaskList tasks={tasks.filter((t) => t.date === sel)} {...actions} />
    </>
  );
}
