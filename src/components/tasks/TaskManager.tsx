import { useState, useMemo } from 'react';
import { Task, Priority } from '../../types';
import { usePlanner } from '../../context/PlannerContext';
import { TaskFormModal } from './TaskFormModal';
import { getSubjectColorStyles } from '../../utils/colors';
import { formatNiceDate, formatMinutes, getTodayIsoString } from '../../utils/dateUtils';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Modal } from '../common/Modal';

type FilterStatus = 'all' | 'pending' | 'completed' | 'today';

export function TaskManager() {
  const {
    tasks,
    subjects,
    toggleTaskCompleted,
    deleteTask,
    getSubject,
    openTaskModal,
  } = usePlanner();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const todayIso = getTodayIsoString();

  // Filter logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        // Status filter
        if (statusFilter === 'pending' && t.completed) return false;
        if (statusFilter === 'completed' && !t.completed) return false;
        if (statusFilter === 'today' && t.date !== todayIso) return false;

        // Subject filter
        if (selectedSubjectId !== 'all' && t.subjectId !== selectedSubjectId) return false;

        // Priority filter
        if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchNotes = t.notes ? t.notes.toLowerCase().includes(q) : false;
          const subject = getSubject(t.subjectId);
          const matchSubject = subject ? subject.name.toLowerCase().includes(q) : false;
          return matchTitle || matchNotes || matchSubject;
        }

        return true;
      })
      .sort((a, b) => {
        // Incomplete first, then by date, then priority
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.date.localeCompare(b.date);
      });
  }, [tasks, statusFilter, selectedSubjectId, selectedPriority, searchQuery, todayIso, getSubject]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Study Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Plan assignments, problem sets, chapter readings, and review sessions
          </p>
        </div>

        <button
          id="add-task-page-btn"
          type="button"
          onClick={() => openTaskModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
        {/* Top row: Status Tabs & Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 self-start">
            {(
              [
                { id: 'all', label: `All (${tasks.length})` },
                { id: 'pending', label: `Pending (${pendingCount})` },
                { id: 'completed', label: `Completed (${completedCount})` },
                { id: 'today', label: 'Today' },
              ] as { id: FilterStatus; label: string }[]
            ).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, or notes..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Secondary Filters: Subject & Priority */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Filters:</span>
          </div>

          {/* Subject dropdown */}
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Priority dropdown */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {(selectedSubjectId !== 'all' || selectedPriority !== 'all' || searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedSubjectId('all');
                setSelectedPriority('all');
                setSearchQuery('');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No study tasks match this view
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Try resetting your filters, or create a new task to continue building your study plan.
          </p>
          <button
            onClick={() => openTaskModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Study Task
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map(task => {
            const subject = getSubject(task.subjectId);
            const colorStyles = getSubjectColorStyles(subject?.color);
            const isToday = task.date === todayIso;

            return (
              <div
                key={task.id}
                className={`group relative p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  task.completed
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-xs'
                }`}
              >
                {/* Complete Toggle Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 hover:scale-110 transition-transform" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Subject badge */}
                    {subject && (
                      <span
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1.5"
                        style={{
                          backgroundColor: colorStyles.bgStyle.backgroundColor,
                          borderColor: colorStyles.borderStyle.borderColor,
                          color: colorStyles.color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colorStyles.color }}
                        />
                        {subject.name}
                      </span>
                    )}

                    {/* Priority badge */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Date */}
                    <span
                      className={`text-[11px] font-medium flex items-center gap-1 ${
                        isToday
                          ? 'font-bold text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {isToday ? 'Today' : formatNiceDate(task.date)}
                    </span>

                    {/* Duration */}
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatMinutes(task.durationMinutes)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-sm font-semibold text-slate-900 dark:text-white leading-snug break-words ${
                      task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Notes */}
                  {task.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {task.notes}
                    </p>
                  )}
                </div>

                {/* Edit and Delete Buttons */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleEdit(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskToDelete(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Task Modal */}
      {taskToEdit && (
        <TaskFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setTaskToEdit(null);
          }}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Delete Task Confirmation */}
      {taskToDelete && (
        <Modal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          title="Delete Study Task?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-white">"{taskToDelete.title}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
