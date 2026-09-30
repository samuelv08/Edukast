import { useState } from 'react';

// Formulario para crear o editar una tarea (con validaciones)
export default function TaskModal({ task, subjects, onSave, onClose }) {
  const [f, setF] = useState({ name: '', subject: subjects[0] || '', date: '', priority: 'media', done: false, ...task, desc: task.desc || '' });
  const [err, setErr] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Escribe el nombre de la tarea.';
    if (!f.subject) er.subject = 'Selecciona una asignatura.';
    if (!f.date) er.date = 'Elige la fecha de entrega.';
    else if (isNaN(new Date(f.date)) || f.date < '2000-01-01' || f.date > '2100-12-31') er.date = 'La fecha no es válida.';
    setErr(er);
    if (!Object.keys(er).length) onSave({ ...f, name: f.name.trim(), desc: f.desc.trim() });
  };
  const bad = (k) => (err[k] ? 'is-invalid' : '');
  const msg = (k) => err[k] && <div className="invalid-feedback">{err[k]}</div>;

  return (
    <>
      <div className="modal d-block fade-in" tabIndex="-1" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <form className="modal-content" onSubmit={submit} noValidate>
            <div className="modal-header brand-bg text-white">
              <h5 className="modal-title">{task.id ? 'Editar tarea' : 'Nueva tarea'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre de la tarea</label>
                <input className={`form-control ${bad('name')}`} value={f.name} onChange={set('name')} autoFocus />
                {msg('name')}
              </div>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="form-label">Asignatura</label>
                  <select className={`form-select ${bad('subject')}`} value={f.subject} onChange={set('subject')}>
                    {subjects.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {msg('subject')}
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label">Fecha de entrega</label>
                  <input type="date" className={`form-control ${bad('date')}`} value={f.date} onChange={set('date')} />
                  {msg('date')}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción (opcional)</label>
                <textarea rows="3" className="form-control" value={f.desc} onChange={set('desc')} />
              </div>
              <div className="row">
                <div className="col-sm-6 mb-2">
                  <label className="form-label">Prioridad</label>
                  <select className="form-select" value={f.priority} onChange={set('priority')}>
                    <option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option>
                  </select>
                </div>
                <div className="col-sm-6 mb-2">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={f.done ? 'done' : 'pending'} onChange={(e) => setF({ ...f, done: e.target.value === 'done' })}>
                    <option value="pending">Pendiente</option><option value="done">Completada</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary"><i className="bi bi-save me-1"></i>Guardar</button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
