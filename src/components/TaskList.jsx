import TaskCard from './TaskCard';

export default function TaskList({ tasks, ...actions }) {
  if (!tasks.length)
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1"></i>
        <p className="mt-2">No hay tareas para mostrar.</p>
      </div>
    );
  return (
    <div className="row g-3">
      {tasks.map((t) => <TaskCard key={t.id} task={t} {...actions} />)}
    </div>
  );
}
