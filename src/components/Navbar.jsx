import { useState } from 'react';

const LINKS = [
  ['dashboard', 'bi-grid-1x2-fill', 'Dashboard'],
  ['calendar', 'bi-calendar3', 'Calendario'],
  ['subjects', 'bi-journal-bookmark-fill', 'Asignaturas'],
  ['progress', 'bi-graph-up-arrow', 'Mi progreso'],
];

export default function Navbar({ view, setView, onNew, darkMode, onToggleTheme, remindersEnabled, remindersSupported, remindersPermission, onToggleReminders }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg brand-bg sticky-top border-bottom">
      <div className="container">
        <span className="navbar-brand brand-logo" role="button" onClick={() => setView('dashboard')}>
          <i className="bi bi-mortarboard-fill me-2"></i>EDUKAST
        </span>
        <button className="navbar-toggler" onClick={() => setOpen(!open)} aria-label="Menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            {LINKS.map(([id, icon, label]) => (
              <li className="nav-item" key={id}>
                <button
                  className={`nav-link btn btn-link ${view === id ? 'active fw-semibold' : ''}`}
                  onClick={() => { setView(id); setOpen(false); }}
                >
                  <i className={`bi ${icon} me-1`}></i>{label}
                </button>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-3 my-2 my-lg-0">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onToggleReminders}
              disabled={!remindersSupported}
              aria-label={remindersEnabled ? 'Desactivar recordatorios' : 'Activar recordatorios'}
              aria-pressed={remindersEnabled}
              title={remindersPermission === 'denied' ? 'Notificaciones bloqueadas: revisa Ajustes' : remindersEnabled ? 'Desactivar recordatorios' : 'Activar recordatorios'}
            >
              <i className={`bi ${remindersEnabled ? 'bi-bell-fill' : 'bi-bell'}`} aria-hidden="true"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onToggleTheme}
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`} aria-hidden="true"></i>
            </button>
            <button className="btn btn-primary fw-semibold" onClick={() => { onNew(); setOpen(false); }}>
              <i className="bi bi-plus-lg me-1"></i>Nueva tarea
            </button>
            <span className="navbar-user d-flex align-items-center">
              <i className="bi bi-person-circle fs-4 me-2"></i>Estudiante
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
