import { PRIO, daysLeft, fmtDate } from '../utils';

export default function TaskCard({ task: t, onEdit, onDelete, onToggle }) {
  const p = PRIO[t.priority];
  const d = daysLeft(t.date);
  const late = !t.done && d < 0;
  return (
    <div className="col-md-6 col-xl-4">
      <div className={`card task-card h-100 shadow-sm prio-${t.priority} ${t.done ? 'done' : ''}`}>
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className={`badge text-bg-${p.cls}`}><i className="bi bi-flag-fill me-1"></i>{p.label}</span>
            <span className={`badge ${t.done ? 'text-bg-success' : 'text-bg-light border'}`}>
              {t.done ? 'Completada' : 'Pendiente'}
            </span>
          </div>
          <h5 className="task-name mb-1">{t.name}</h5>
          <div className="text-primary small mb-2"><i className="bi bi-book me-1"></i>{t.subject}</div>
          {t.desc?.trim() && <p className="text-muted small flex-grow-1">{t.desc.length > 90 ? t.desc.slice(0, 90) + '…' : t.desc}</p>}
          <div className={`small mb-3 ${late ? 'text-danger fw-semibold' : 'text-muted'}`}>
            <i className="bi bi-calendar-event me-1"></i>{fmtDate(t.date)}
            {late && ' · Vencida'}
            {!t.done && d === 0 && ' · Hoy'}
          </div>
          <div className="d-flex gap-2">
            <button className={`btn btn-sm flex-grow-1 ${t.done ? 'btn-outline-secondary' : 'btn-success'}`} onClick={() => onToggle(t.id)}>
              <i className={`bi ${t.done ? 'bi-arrow-counterclockwise' : 'bi-check2-circle'} me-1`}></i>
              {t.done ? 'Reabrir' : 'Completar'}
            </button>
            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(t)} title="Editar"><i className="bi bi-pencil-fill"></i></button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(t.id)} title="Eliminar"><i className="bi bi-trash3-fill"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
}
