import { TabType } from '../../types';
import { usePlanner } from '../../context/PlannerContext';
import {
  LayoutDashboard,
  CheckSquare,
  BookMarked,
  CalendarDays,
  AlarmClock,
  BarChart3,
  Settings,
  Target,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const {
    activeTab,
    setActiveTab,
    pendingTasksCount,
    subjects,
    exams,
    overallProgressPercentage,
    todayTasks,
  } = usePlanner();

  const navItems: { id: TabType; label: string; icon: typeof LayoutDashboard; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'tasks',
      label: 'Study Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'planner',
      label: 'Weekly Planner',
      icon: CalendarDays,
      badge: todayTasks.length > 0 ? `${todayTasks.length} today` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookMarked,
      badge: subjects.length,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'exams',
      label: 'Exam Countdown',
      icon: AlarmClock,
      badge: exams.length > 0 ? exams.length : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
    { id: 'progress', label: 'Progress Tracking', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: TabType) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 flex flex-col justify-between py-6 px-4 bg-white/70 dark:bg-slate-900/70 border-r border-slate-200/80 dark:border-slate-800 h-full select-none">
      <div>
        <div className="px-3 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Study Workspace
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Motivational progress widget at bottom of sidebar */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 px-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Completion Rate
            </span>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              {overallProgressPercentage}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-indigo-200/60 dark:bg-indigo-950 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPercentage}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              Study Streak
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
