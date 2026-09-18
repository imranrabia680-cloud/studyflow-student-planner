import { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import {
  formatGreeting,
  formatFullTodayDate,
  formatMinutes,
  getRelativeDayDescription,
} from '../../utils/dateUtils';
import { getSubjectColorStyles } from '../../utils/colors';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ArrowRight,
  AlarmClock,
  Sparkles,
  BookOpen,
  TrendingUp,
  CheckCheck,
} from 'lucide-react';
import { Task } from '../../types';
import { TaskFormModal } from '../tasks/TaskFormModal';

export function DashboardView() {
  const {
    profile,
    todayTasks,
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    overallProgressPercentage,
    todayEstimatedMinutes,
    todayCompletedMinutes,
    toggleTaskCompleted,
    getSubject,
    openTaskModal,
    exams,
    setActiveTab,
  } = usePlanner();

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { greeting, quote } = formatGreeting(profile.name);

  // Closest upcoming exams (up to 2)
  const upcomingExams = exams
    .map(e => ({
      ...e,
      relative: getRelativeDayDescription(e.date),
    }))
    .filter(e => !e.relative.isPast)
    .sort((a, b) => a.relative.daysRemaining - b.relative.daysRemaining)
    .slice(0, 2);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgressPercentage / 100) * circumference;

  const todayCompletedTasksCount = todayTasks.filter(t => t.completed).length;
  const todayProgressPercent =
    todayTasks.length > 0
      ? Math.round((todayCompletedTasksCount / todayTasks.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-sm">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 rounded-full bg-purple-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold tracking-wide text-indigo-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{formatFullTodayDate()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              {greeting}
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed opacity-95">
              "{quote}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-new-task-btn"
              onClick={() => openTaskModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-indigo-950 hover:bg-indigo-50 shadow-md active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Task</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 active:scale-98 transition-all"
            >
              <span>Weekly View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics & Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Tasks
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalTasksCount}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across all subjects
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {completedTasksCount}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {completedTasksCount > 0 ? 'Consistent progress!' : 'Ready to begin!'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
            <CheckCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending
            </p>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {pendingTasksCount}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {todayTasks.filter(t => !t.completed).length} scheduled for today
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Circular Progress Indicator Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overall Progress
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {overallProgressPercentage}%
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {completedTasksCount} of {totalTasksCount} done
            </p>
          </div>
          {/* Circular progress SVG */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-indigo-600 dark:text-indigo-500 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800 dark:text-slate-200">
              {overallProgressPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Today's Study Schedule</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
                  {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {todayCompletedTasksCount} completed • {formatMinutes(todayEstimatedMinutes)} planned study time
              </p>
            </div>

            <button
              onClick={() => openTaskModal(undefined, undefined)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add for Today</span>
            </button>
          </div>

          {/* Today's Progress Bar */}
          {todayTasks.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                <span>Daily Completion</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {todayProgressPercent}% ({todayCompletedTasksCount}/{todayTasks.length})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${todayProgressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Today's Tasks List */}
          {todayTasks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No tasks scheduled for today!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Enjoy your free time or get ahead by adding a new focused study session.
              </p>
              <button
                onClick={() => openTaskModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Task for Today
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayTasks.map(task => {
                const subject = getSubject(task.subjectId);
                const colorStyles = getSubjectColorStyles(subject?.color);

                return (
                  <div
                    key={task.id}
                    className={`group relative p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      task.completed
                        ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-xs'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 hover:scale-110 transition-transform" />
                      )}
                    </button>

                    {/* Task Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
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

                        {/* Priority Badge */}
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

                        {/* Duration Badge */}
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatMinutes(task.durationMinutes)}
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-semibold text-slate-900 dark:text-white leading-snug break-words ${
                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {/* Quick Edit */}
                    <button
                      type="button"
                      onClick={() => handleEditTask(task)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Exams & Quick Stats */}
        <div className="space-y-6">
          {/* Exam Countdown Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                  <AlarmClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Next Assessments
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Exam countdown tracker
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All
              </button>
            </div>

            {upcomingExams.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                No upcoming exams scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.map(exam => {
                  const subject = getSubject(exam.subjectId);
                  const isUrgent = exam.relative.daysRemaining <= 3;

                  return (
                    <div
                      key={exam.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                          {subject?.name || 'General Exam'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {exam.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {exam.date}
                        </span>
                      </div>

                      <div
                        className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-extrabold text-center ${
                          isUrgent
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ring-1 ring-rose-300 dark:ring-rose-800'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {exam.relative.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Study Goal Tracker */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Daily Target Goal
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {profile.dailyStudyGoalHours}h Goal
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Planned Today:</span>
                <span className="font-semibold">{formatMinutes(todayEstimatedMinutes)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Completed Today:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatMinutes(todayCompletedMinutes)}
                </span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (todayCompletedMinutes / (profile.dailyStudyGoalHours * 60 || 1)) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 text-right">
                {Math.round((todayCompletedMinutes / (profile.dailyStudyGoalHours * 60 || 1)) * 100)}% of daily goal reached
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal if triggered */}
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
    </div>
  );
}
