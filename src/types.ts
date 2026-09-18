export type Priority = 'low' | 'medium' | 'high';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string; // Hex color code
  description?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  priority: Priority;
  durationMinutes: number; // e.g., 30, 45, 60, 90, 120
  completed: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // e.g., "09:00"
  room?: string; // e.g., "Hall B" or "Online"
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  institution: string;
  gradeLevel: string;
  dailyStudyGoalHours: number;
  theme: 'light' | 'dark' | 'system';
}

export type TabType = 'dashboard' | 'tasks' | 'subjects' | 'planner' | 'exams' | 'progress' | 'settings';
