// Barra de búsqueda + filtros + orden
const FILTERS = [['all', 'Todas'], ['pending', 'Pendientes'], ['done', 'Completadas'], ['alta', 'Alta'], ['media', 'Media'], ['baja', 'Baja']];

export default function Filters({ view, setView }) {
  const set = (k) => (v) => setView({ ...view, [k]: v });
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="row g-2 align-items-center">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input className="form-control" placeholder="Buscar por nombre o asignatura…" value={view.query} onChange={(e) => set('query')(e.target.value)} />
            </div>
          </div>
          <div className="col-md-5">
            <select className="form-select" value={view.sort} onChange={(e) => set('sort')(e.target.value)} aria-label="Ordenar">
              <option value="near">Entrega más cercana</option>
              <option value="far">Entrega más lejana</option>
              <option value="prio">Prioridad</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-3">
          {FILTERS.map(([id, label]) => (
            <button key={id} className={`btn btn-sm filter-option ${view.filter === id ? 'active' : ''}`} onClick={() => set('filter')(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
