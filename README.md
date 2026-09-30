# EDUKAST
Plataforma para organizar, gestionar y hacer seguimiento de las tareas académicas.
React 18 + Bootstrap 5 + localStorage (sin backend).

## Ejecutar
    npm install
    npm run dev      # abre http://localhost:5173
    npm run build    # versión de producción en /dist

## App para iPhone
La compilación de iOS requiere macOS, Xcode y CocoaPods. En un Mac, clona el repositorio y ejecuta:

    npm install
    npm run ios:add  # crea el proyecto nativo la primera vez
    npm run ios:open # abre EDUKAST en Xcode para ejecutar o archivar

Después de cambios en la app web, ejecuta `npm run ios:sync` antes de volver a abrir Xcode. El bundle ID es `com.samuelv08.edukast`.

Los recordatorios nativos se activan desde el botón de campana y pueden avisar a las 9:00, incluso con EDUKAST cerrada. Si se bloquean, habilítalos en Ajustes de iOS > Notificaciones > EDUKAST.

## Estructura
- src/App.jsx: estado global, persistencia y navegación
- src/utils.js: localStorage, datos de ejemplo, filtros y fechas
- src/components/: Navbar, Dashboard, Filters, TaskList, TaskCard, TaskModal, Calendar, SubjectList, Progress, Notification, Footer
