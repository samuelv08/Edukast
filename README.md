# EDUKAST
Plataforma para organizar, gestionar y hacer seguimiento de las tareas académicas.
React 18 + Bootstrap 5 + localStorage (sin backend).

## Ejecutar
    npm install
    npm run dev      # abre http://localhost:5173
    npm run build    # versión de producción en /dist

## Estructura
- src/App.jsx: estado global, persistencia y navegación
- src/utils.js: localStorage, datos de ejemplo, filtros y fechas
- src/components/: Navbar, Dashboard, Filters, TaskList, TaskCard, TaskModal, Calendar, SubjectList, Progress, Notification, Footer
