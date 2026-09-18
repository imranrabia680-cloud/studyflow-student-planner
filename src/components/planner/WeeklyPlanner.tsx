import { useState, useMemo } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getWeekDays, formatMinutes } from '../../utils/dateUtils';
import { getSubjectColorStyles } from '../../utils/colors';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlarmClock,
} from 'lucide-react';

export function WeeklyPlanner() {
  const { tasks, exams, getSubject, toggleTaskCompleted, openTaskModal } = usePlanner();

  const [weekOffset, setWeekOffset] = useState(0);

  const { days, weekLabel } = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const goToPreviousWeek = () => setWeekOffset(prev => prev - 1);
  const goToNextWeek = () => setWeekOffset(prev => prev + 1);
  const goToCurrentWeek = () => setWeekOffset(0);

  // Group tasks by isoDate
  const tasksByDay = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    days.forEach(day => map.set(day.isoDate, []));

    tasks.forEach(task => {
      if (map.has(task.date)) {
        map.get(task.date)!.push(task);
      }
    });

    return map;
  }, [tasks, days]);

  // Group exams by isoDate
  const examsByDay = useMemo(() => {
    const map = new Map<string, typeof exams>();
    days.forEach(day => map.set(day.isoDate, []));

    exams.forEach(exam => {
      if (map.has(exam.date)) {
        map.get(exam.date)!.push(exam);
      }
    });

    return map;
  }, [exams, days]);

  // Week total metrics
  const weekTasks = useMemo(() => {
    const all: typeof tasks = [];
    tasksByDay.forEach(dayTasks => all.push(...dayTasks));
    return all;
  }, [tasksByDay]);

  const weekTotalMinutes = useMemo(
    () => weekTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0),
    [weekTasks]
  );
  const weekCompletedTasks = useMemo(
    () => weekTasks.filter(t => t.completed).length,
    [weekTasks]
  );

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Weekly Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize your study workload, schedule time blocks, and prepare ahead
          </p>
        </div>

        {/* Navigation Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 shadow-xs">
            <button
              type="button"
              onClick={goToPreviousWeek}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Previous Week"
              aria-label="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goToCurrentWeek}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                weekOffset === 0
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={goToNextWeek}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Next Week"
              aria-label="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{weekLabel}</span>
          </div>
        </div>
      </div>

      {/* Week Overview Metric Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-4">
          <span>
            <strong>{weekTasks.length}</strong> tasks scheduled
          </span>
          <span>•</span>
          <span>
            <strong>{weekCompletedTasks}</strong> completed
          </span>
          <span>•</span>
          <span>
            <strong>{formatMinutes(weekTotalMinutes)}</strong> total study planned
          </span>
        </div>

        <button
          onClick={() => openTaskModal(days[0].isoDate)}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Plan New Session
        </button>
      </div>

      {/* 7-Day Grid: Responsive horizontally on desktop, cleanly stacked on small screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
        {days.map(day => {
          const dayTasks = tasksByDay.get(day.isoDate) || [];
          const dayExams = examsByDay.get(day.isoDate) || [];
          const dayTotalMins = dayTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
          const dayCompletedCount = dayTasks.filter(t => t.completed).length;

          return (
            <div
              key={day.isoDate}
              className={`flex flex-col justify-between rounded-2xl p-3.5 border transition-all min-h-[320px] ${
                day.isToday
                  ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      {day.dayName}
                    </span>
                    <span
                      className={`text-base font-extrabold ${
                        day.isToday
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {day.isToday && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
                        Today
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => openTaskModal(day.isoDate)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={`Add task for ${day.fullDayName}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Exams on this day */}
                {dayExams.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {dayExams.map(exam => (
                      <div
                        key={exam.id}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 text-[11px] text-rose-800 dark:text-rose-200"
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <AlarmClock className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{exam.title}</span>
                        </div>
                        {exam.time && (
                          <span className="text-[10px] text-rose-600 dark:text-rose-300 block mt-0.5">
                            {exam.time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tasks container */}
                <div className="space-y-2">
                  {dayTasks.length === 0 && dayExams.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 dark:text-slate-600 text-xs">
                      No tasks
                    </div>
                  ) : (
                    dayTasks.map(task => {
                      const subject = getSubject(task.subjectId);
                      const colorStyles = getSubjectColorStyles(subject?.color);

                      return (
                        <div
                          key={task.id}
                          className={`p-2.5 rounded-xl border text-xs transition-all relative group ${
                            task.completed
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleTaskCompleted(task.id)}
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 hover:scale-110 transition-transform" />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`font-semibold text-slate-900 dark:text-white leading-tight break-words ${
                                  task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                }`}
                              >
                                {task.title}
                              </p>

                              <div className="flex items-center gap-1.5 mt-1.5">
                                {subject && (
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: colorStyles.color }}
                                    title={subject.name}
                                  />
                                )}
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {formatMinutes(task.durationMinutes)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Day footer stats */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <span>
                  {dayCompletedCount}/{dayTasks.length} done
                </span>
                {dayTotalMins > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatMinutes(dayTotalMins)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
