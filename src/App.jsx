import { useState, useEffect } from 'react';
import { load, save } from './utils';
import useTaskReminders from './useTaskReminders';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import SubjectList from './components/SubjectList';
import Progress from './components/Progress';
import TaskModal from './components/TaskModal';
import Footer from './components/Footer';

export default function App() {
  const [data, setData] = useState(load);
  const [view, setView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('edukast-theme') === 'dark');
  const [modal, setModal] = useState(null); // null = cerrado, {} = nueva, tarea = editar
  const { tasks, subjects } = data;
  const reminders = useTaskReminders(tasks);

  useEffect(() => save(data), [data]); // persistencia en localStorage
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.bsTheme = theme;
    localStorage.setItem('edukast-theme', theme);
  }, [darkMode]);

  const setTasks = (fn) => setData((d) => ({ ...d, tasks: fn(d.tasks) }));
  const saveTask = (t) => {
    setTasks((ts) => (t.id ? ts.map((x) => (x.id === t.id ? t : x)) : [{ ...t, id: Date.now() }, ...ts]));
    setModal(null);
  };
  const actions = {
    onEdit: setModal,
    onDelete: (id) => window.confirm('¿Eliminar esta tarea?') && setTasks((ts) => ts.filter((t) => t.id !== id)),
    onToggle: (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
  };
  const addSubject = (name) =>
    setData((d) => (d.subjects.some((s) => s.toLowerCase() === name.toLowerCase()) ? d : { ...d, subjects: [...d.subjects, name] }));

  return (
    <div className="app d-flex flex-column min-vh-100">
      <Navbar
        view={view}
        setView={setView}
        onNew={() => setModal({})}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((mode) => !mode)}
        remindersEnabled={reminders.enabled}
        remindersSupported={reminders.supported}
        remindersPermission={reminders.permission}
        onToggleReminders={reminders.toggle}
      />
      <main className="container py-4 flex-grow-1 fade-in" key={view}>
        {view === 'dashboard' && <Dashboard tasks={tasks} {...actions} />}
        {view === 'calendar' && <Calendar tasks={tasks} {...actions} />}
        {view === 'subjects' && <SubjectList tasks={tasks} subjects={subjects} onAdd={addSubject} {...actions} />}
        {view === 'progress' && <Progress tasks={tasks} subjects={subjects} />}
      </main>
      <Footer />
      {modal && <TaskModal task={modal} subjects={subjects} onSave={saveTask} onClose={() => setModal(null)} />}
    </div>
  );
}
