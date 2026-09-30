export default function Progress({ tasks, subjects }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <>
      <h2 className="fw-bold mb-3">Mi progreso</h2>
      <div className="row g-3 mb-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <div className="donut mx-auto mb-3" style={{ '--pct': pct }}><span>{pct}%</span></div>
              <h5 className="fw-bold">Progreso general: {pct}%</h5>
              <div className="row mt-3">
                <div className="col"><div className="fs-3 fw-bold text-success">{done}</div><small className="text-muted">Completadas ({pct}%)</small></div>
                <div className="col"><div className="fs-3 fw-bold text-warning">{total - done}</div><small className="text-muted">Pendientes ({total ? 100 - pct : 0}%)</small></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Resumen por asignatura</h5>
              {subjects.map((s) => {
                const list = tasks.filter((t) => t.subject === s);
                const d = list.filter((t) => t.done).length;
                const p = list.length ? Math.round((d / list.length) * 100) : 0;
                return (
                  <div className="mb-3" key={s}>
                    <div className="d-flex justify-content-between small">
                      <span className="fw-semibold">{s}</span>
                      <span className="text-muted">{list.length} tarea(s) · {d} completada(s)</span>
                    </div>
                    <div className="progress" style={{ height: 10 }}>
                      <div className="progress-bar bg-success" style={{ width: `${p}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
