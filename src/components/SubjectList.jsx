import { useState } from 'react';
import TaskList from './TaskList';

export default function SubjectList({ tasks, subjects, onAdd, ...actions }) {
  const [sel, setSel] = useState(null);
  const [name, setName] = useState('');
  const add = (e) => {
    e.preventDefault();
    if (name.trim()) { onAdd(name.trim()); setName(''); }
  };
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="fw-bold mb-0">Mis asignaturas</h2>
        <form className="input-group w-auto" onSubmit={add}>
          <input className="form-control" placeholder="Nueva asignatura" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn btn-primary" type="submit"><i className="bi bi-plus-lg"></i></button>
        </form>
      </div>
      <div className="row g-3 mb-4">
        {subjects.map((s) => {
          const list = tasks.filter((t) => t.subject === s);
          const pend = list.filter((t) => !t.done).length;
          return (
            <div className="col-6 col-md-4 col-lg-3" key={s}>
              <div className={`card subject-card shadow-sm h-100 ${sel === s ? 'active' : ''}`} role="button" onClick={() => setSel(sel === s ? null : s)}>
                <div className="card-body">
                  <i className="bi bi-journal-text fs-3 brand-text"></i>
                  <h6 className="fw-bold mt-2 mb-1">{s}</h6>
                  <small className="text-muted">{list.length} tarea(s) · {pend} pendiente(s)</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {sel ? (
        <>
          <h5 className="fw-bold mb-3">Tareas de {sel}</h5>
          <TaskList tasks={tasks.filter((t) => t.subject === sel)} {...actions} />
        </>
      ) : (
        <p className="text-muted">Selecciona una asignatura para ver sus tareas.</p>
      )}
    </>
  );
}
