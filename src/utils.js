// Utilidades: almacenamiento local, datos de ejemplo y helpers de fechas/filtros.
export const KEY = 'edukast-v1';

export const PRIO = {
  alta: { label: 'Alta', cls: 'danger', w: 0 },
  media: { label: 'Media', cls: 'warning', w: 1 },
  baja: { label: 'Baja', cls: 'secondary', w: 2 },
};

const iso = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const today = () => iso(0);

// Días que faltan para una fecha (negativo = vencida)
export const daysLeft = (date) =>
  Math.round((new Date(date + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 864e5);

export const fmtDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

const seed = {
  subjects: ['Matemáticas', 'Español', 'Inglés', 'Ciencias', 'Tecnología', 'Sociales'],
  tasks: [
    { id: 1, name: 'Resolver ejercicios de límites', subject: 'Matemáticas', desc: 'Guía de la página 45, ejercicios del 1 al 20.', date: iso(7), priority: 'alta', done: false },
    { id: 2, name: 'Realizar ensayo', subject: 'Español', desc: 'Ensayo de una página sobre la lectura del mes.', date: iso(3), priority: 'media', done: false },
    { id: 3, name: 'Proyecto de desarrollo web', subject: 'Tecnología', desc: 'Página web con HTML, CSS y JavaScript.', date: iso(-2), priority: 'alta', done: true },
    { id: 4, name: 'Vocabulario unidad 5', subject: 'Inglés', desc: 'Estudiar 30 palabras para el quiz.', date: iso(1), priority: 'media', done: false },
    { id: 5, name: 'Informe de laboratorio', subject: 'Ciencias', desc: 'Informe del experimento de densidad.', date: iso(-1), priority: 'baja', done: false },
  ],
};

export function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.tasks) && Array.isArray(s.subjects)) return s;
  } catch { /* datos corruptos: usar ejemplo */ }
  return seed;
}
export function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* almacenamiento lleno o bloqueado */ }
}

// Aplica filtro, búsqueda y orden a la lista de tareas
export function applyView(tasks, { filter = 'all', sort = 'near', query = '' }) {
  const q = query.trim().toLowerCase();
  const ok = (t) =>
    (filter === 'all' || (filter === 'pending' && !t.done) || (filter === 'done' && t.done) || t.priority === filter) &&
    (!q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  const by = {
    near: (a, b) => a.date.localeCompare(b.date),
    far: (a, b) => b.date.localeCompare(a.date),
    prio: (a, b) => PRIO[a.priority].w - PRIO[b.priority].w || a.date.localeCompare(b.date),
  }[sort];
  return tasks.filter(ok).sort(by);
}
