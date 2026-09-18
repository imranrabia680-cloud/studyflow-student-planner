import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Subject, Task, Exam, UserProfile, TabType } from '../types';
import { getInitialDemoData } from '../utils/demoData';
import { getTodayIsoString } from '../utils/dateUtils';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface PlannerContextType {
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  profile: UserProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  // Subject actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  getSubject: (id: string) => Subject | undefined;
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  // Exam actions
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => Exam;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  // Profile / Settings actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  // Computed stats
  todayTasks: Task[];
  completedTasksCount: number;
  pendingTasksCount: number;
  totalTasksCount: number;
  overallProgressPercentage: number;
  todayEstimatedMinutes: number;
  todayCompletedMinutes: number;
  // Quick task modal state (for opening from header or planner day)
  isTaskModalOpen: boolean;
  openTaskModal: (initialDate?: string, initialSubjectId?: string) => void;
  closeTaskModal: () => void;
  taskModalInitialDate?: string;
  taskModalInitialSubjectId?: string;
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  SUBJECTS: 'studyflow_subjects_v1',
  TASKS: 'studyflow_tasks_v1',
  EXAMS: 'studyflow_exams_v1',
  PROFILE: 'studyflow_profile_v1',
};

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return getInitialDemoData().subjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return getInitialDemoData().tasks;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return getInitialDemoData().exams;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return getInitialDemoData().profile;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Task modal trigger
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalInitialDate, setTaskModalInitialDate] = useState<string | undefined>(undefined);
  const [taskModalInitialSubjectId, setTaskModalInitialSubjectId] = useState<string | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to save subjects', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch (e) {
      console.error('Failed to save exams', e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Handle dark mode theme class
  useEffect(() => {
    const isDark =
      profile.theme === 'dark' ||
      (profile.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openTaskModal = (initialDate?: string, initialSubjectId?: string) => {
    setTaskModalInitialDate(initialDate);
    setTaskModalInitialSubjectId(initialSubjectId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalInitialDate(undefined);
    setTaskModalInitialSubjectId(undefined);
  };

  // Subject methods
  const addSubject = (data: Omit<Subject, 'id' | 'createdAt'>): Subject => {
    const newSubject: Subject = {
      ...data,
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    setSubjects(prev => [newSubject, ...prev]);
    showToast(`Subject "${newSubject.name}" created.`);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Subject updated.');
  };

  const deleteSubject = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Cascade or retain tasks? Let's keep tasks or remove them? Better to inform and remove or reassign.
    // Let's remove tasks belonging to deleted subject or mark them
    setTasks(prev => prev.filter(t => t.subjectId !== id));
    setExams(prev => prev.filter(e => e.subjectId !== id));
    showToast(subject ? `Deleted "${subject.name}" and associated tasks.` : 'Subject deleted.', 'info');
  };

  const getSubject = (id: string) => {
    return subjects.find(s => s.id === id);
  };

  // Task methods
  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task => {
    const newTask: Task = {
      ...data,
      id: 'task-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Task added: "${newTask.title.slice(0, 30)}${newTask.title.length > 30 ? '...' : ''}"`);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Task updated.');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task deleted.', 'info');
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
    const target = tasks.find(t => t.id === id);
    if (target && !target.completed) {
      showToast('Great job! Task completed.', 'success');
    }
  };

  // Exam methods
  const addExam = (data: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const newExam: Exam = {
      ...data,
      id: 'exam-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    setExams(prev => [...prev, newExam].sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`Exam scheduled: "${newExam.title}"`);
    return newExam;
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e)).sort((a, b) => a.date.localeCompare(b.date))
    );
    showToast('Exam updated.');
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('Exam removed.', 'info');
  };

  // Profile / Settings
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile updated.');
  };

  const toggleTheme = () => {
    const next = profile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: next });
  };

  const resetToDemoData = () => {
    const demo = getInitialDemoData();
    setSubjects(demo.subjects);
    setTasks(demo.tasks);
    setExams(demo.exams);
    setProfile(demo.profile);
    showToast('Reset to default demo data.');
  };

  const clearAllData = () => {
    setSubjects([]);
    setTasks([]);
    setExams([]);
    showToast('All data cleared.', 'info');
  };

  const exportDataJSON = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      subjects,
      tasks,
      exams,
      profile,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyFlow_Backup_${getTodayIsoString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data backup exported successfully!');
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.subjects) && Array.isArray(parsed.tasks)) {
        setSubjects(parsed.subjects);
        setTasks(parsed.tasks);
        if (Array.isArray(parsed.exams)) setExams(parsed.exams);
        if (parsed.profile) setProfile(parsed.profile);
        showToast('Backup restored successfully!');
        return true;
      }
      showToast('Invalid backup file format.', 'error');
      return false;
    } catch {
      showToast('Could not parse JSON file.', 'error');
      return false;
    }
  };

  // Computed statistics
  const todayIso = getTodayIsoString();

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.date === todayIso);
  }, [tasks, todayIso]);

  const totalTasksCount = tasks.length;
  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const overallProgressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const todayEstimatedMinutes = useMemo(
    () => todayTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0),
    [todayTasks]
  );
  const todayCompletedMinutes = useMemo(
    () => todayTasks.filter(t => t.completed).reduce((acc, t) => acc + (t.durationMinutes || 0), 0),
    [todayTasks]
  );

  return (
    <PlannerContext.Provider
      value={{
        subjects,
        tasks,
        exams,
        profile,
        activeTab,
        setActiveTab,
        addSubject,
        updateSubject,
        deleteSubject,
        getSubject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        addExam,
        updateExam,
        deleteExam,
        updateProfile,
        toggleTheme,
        resetToDemoData,
        clearAllData,
        exportDataJSON,
        importDataJSON,
        todayTasks,
        completedTasksCount,
        pendingTasksCount,
        totalTasksCount,
        overallProgressPercentage,
        todayEstimatedMinutes,
        todayCompletedMinutes,
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        taskModalInitialDate,
        taskModalInitialSubjectId,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
