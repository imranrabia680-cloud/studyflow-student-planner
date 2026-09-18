import { useMemo } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { getWeekDays, formatMinutes } from '../../utils/dateUtils';
import { getSubjectColorStyles } from '../../utils/colors';
import {
  CheckCheck,
  Clock,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function ProgressTracking() {
  const {
    tasks,
    subjects,
    profile,
    completedTasksCount,
    pendingTasksCount,
    totalTasksCount,
    overallProgressPercentage,
  } = usePlanner();

  // Current week statistics
  const currentWeek = useMemo(() => getWeekDays(0), []);

  // Compute daily activity for each day of current week
  const weekActivity = useMemo(() => {
    return currentWeek.days.map(day => {
      const dayTasks = tasks.filter(t => t.date === day.isoDate);
      const completed = dayTasks.filter(t => t.completed);
      const totalMinutes = dayTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
      const completedMinutes = completed.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);

      return {
        ...day,
        totalTasks: dayTasks.length,
        completedTasks: completed.length,
        totalMinutes,
        completedMinutes,
      };
    });
  }, [currentWeek, tasks]);

  const maxMinutesInWeek = useMemo(() => {
    const max = Math.max(...weekActivity.map(d => d.totalMinutes), 60);
    return max;
  }, [weekActivity]);

  const totalWeekMinutes = useMemo(
    () => weekActivity.reduce((acc, d) => acc + d.totalMinutes, 0),
    [weekActivity]
  );
  const totalWeekCompletedMinutes = useMemo(
    () => weekActivity.reduce((acc, d) => acc + d.completedMinutes, 0),
    [weekActivity]
  );
  const totalWeekCompletedTasks = useMemo(
    () => weekActivity.reduce((acc, d) => acc + d.completedTasks, 0),
    [weekActivity]
  );

  // Subject distribution
  const subjectDistribution = useMemo(() => {
    return subjects
      .map(subject => {
        const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
        const completed = subjectTasks.filter(t => t.completed).length;
        const totalMinutes = subjectTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
        return {
          subject,
          taskCount: subjectTasks.length,
          completedCount: completed,
          totalMinutes,
        };
      })
      .filter(s => s.taskCount > 0)
      .sort((a, b) => b.totalMinutes - a.totalMinutes);
  }, [subjects, tasks]);

  const totalAllTasksMinutes = useMemo(
    () => tasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0),
    [tasks]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Progress Tracking & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Review your weekly study efficiency, workload distribution, and milestone completion
        </p>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completion Rate
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {overallProgressPercentage}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedTasksCount} completed / {pendingTasksCount} pending
          </p>
        </div>

        {/* Weekly Completed Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tasks This Week
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {totalWeekCompletedTasks}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Out of {weekActivity.reduce((acc, d) => acc + d.totalTasks, 0)} scheduled
          </p>
        </div>

        {/* Weekly Study Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Week Study Time
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {formatMinutes(totalWeekCompletedMinutes)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planned: {formatMinutes(totalWeekMinutes)}
          </p>
        </div>

        {/* Active Subjects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Courses
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {subjects.length}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            In current academic term
          </p>
        </div>
      </div>

      {/* Main Weekly Activity Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>Study Activity Across This Week</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentWeek.weekLabel} • Daily study minutes scheduled vs completed
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-indigo-600" />
              <span className="text-slate-600 dark:text-slate-300">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-indigo-200 dark:bg-indigo-950" />
              <span className="text-slate-600 dark:text-slate-300">Planned Remaining</span>
            </div>
          </div>
        </div>

        {/* Responsive Bar Chart Canvas */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
          {weekActivity.map(day => {
            const heightPercent = maxMinutesInWeek > 0 ? (day.totalMinutes / maxMinutesInWeek) * 100 : 0;
            const completedPercentOfTotal = day.totalMinutes > 0 ? (day.completedMinutes / day.totalMinutes) * 100 : 0;

            return (
              <div key={day.isoDate} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold bg-slate-900 text-white dark:bg-slate-800 px-2 py-1 rounded-md mb-1 pointer-events-none whitespace-nowrap shadow-md z-10">
                  {formatMinutes(day.totalMinutes)} ({day.completedTasks}/{day.totalTasks} tasks)
                </div>

                {/* Stacked Bar Container */}
                <div className="w-full max-w-[48px] h-full flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-xl overflow-hidden transition-all duration-500 flex flex-col justify-end ${
                      day.totalMinutes === 0
                        ? 'h-2 bg-slate-100 dark:bg-slate-800'
                        : 'bg-indigo-200 dark:bg-indigo-950'
                    }`}
                    style={{
                      height: day.totalMinutes === 0 ? '4px' : `${Math.max(12, heightPercent)}%`,
                    }}
                  >
                    {/* Inner completed portion */}
                    <div
                      className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 transition-all duration-500"
                      style={{ height: `${completedPercentOfTotal}%` }}
                    />
                  </div>
                </div>

                {/* Day Label Below */}
                <div className="mt-3 text-center">
                  <span
                    className={`text-xs font-bold block ${
                      day.isToday
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {day.dayNumber}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend note */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center">
          Peak planned workload this week: {formatMinutes(maxMinutesInWeek)}. Keep up a consistent pace to avoid cramming before exam dates!
        </p>
      </div>

      {/* Bottom 2 Columns: Subject Distribution & Efficiency Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Subject Study Distribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Total planned study hours allocated per course
          </p>

          {subjectDistribution.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No tasks assigned to subjects yet.
            </p>
          ) : (
            <div className="space-y-4">
              {subjectDistribution.map(({ subject, taskCount, completedCount, totalMinutes }) => {
                const colorStyles = getSubjectColorStyles(subject.color);
                const sharePercent =
                  totalAllTasksMinutes > 0 ? Math.round((totalMinutes / totalAllTasksMinutes) * 100) : 0;

                return (
                  <div key={subject.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: colorStyles.color }}
                        />
                        {subject.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {formatMinutes(totalMinutes)} ({sharePercent}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${sharePercent}%`,
                          backgroundColor: colorStyles.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Study Insights & Best Practices */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Study Insights</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Evidence-based strategies for high school and collegiate success
            </p>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  1. Spaced Repetition Beats Cramming
                </span>
                Break heavy subjects like science and history into 30–45 minute daily blocks instead of 4-hour weekend marathons.
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  2. Active Recall
                </span>
                Test yourself with practice problems or flashcards before consulting textbooks or lecture notes.
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  3. Buffer Days Before Exams
                </span>
                Complete first-pass reviews at least 3 days before any major midterm or exam countdown expires.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Daily Target: {profile.dailyStudyGoalHours} hours</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Consistency &gt; Intensity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
