import { Subject, Task, Exam, UserProfile } from '../types';
import { formatToIsoDate } from './dateUtils';

export function getInitialDemoData(): {
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  profile: UserProfile;
} {
  const now = new Date();

  // Offset date helper
  const addDays = (offset: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    return formatToIsoDate(d);
  };

  const todayIso = addDays(0);
  const tomorrowIso = addDays(1);
  const dayAfterIso = addDays(2);
  const inThreeDaysIso = addDays(3);
  const inFourDaysIso = addDays(4);
  const yesterdayIso = addDays(-1);

  const subjects: Subject[] = [
    {
      id: 'sub-1',
      name: 'AP Biology & Genetics',
      code: 'BIO-101',
      color: '#059669', // Emerald
      description: 'Cellular respiration, molecular genetics, and biotechnology',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub-2',
      name: 'Calculus & Linear Algebra',
      code: 'MATH-202',
      color: '#4F46E5', // Indigo
      description: 'Derivatives, integrals, matrix transformations, and series',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub-3',
      name: 'Computer Science II',
      code: 'CS-150',
      color: '#0284C7', // Sky Blue
      description: 'Data structures, algorithms, and object-oriented systems',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub-4',
      name: 'World History & Civilizations',
      code: 'HIST-110',
      color: '#D97706', // Amber
      description: 'Modern historical revolutions, trade routes, and treaties',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sub-5',
      name: 'Organic Chemistry',
      code: 'CHEM-230',
      color: '#E11D48', // Rose
      description: 'Reaction mechanisms, stereochemistry, and synthesis',
      createdAt: new Date().toISOString(),
    },
  ];

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Review Chapter 8: Cellular Respiration Notes & Diagrams',
      subjectId: 'sub-1',
      date: todayIso,
      priority: 'high',
      durationMinutes: 60,
      completed: true,
      completedAt: new Date().toISOString(),
      notes: 'Focus on glycolysis, Krebs cycle, and ATP synthesis pathways.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Complete Problem Set 4: Integration by Parts',
      subjectId: 'sub-2',
      date: todayIso,
      priority: 'high',
      durationMinutes: 90,
      completed: false,
      notes: 'Odd problems 15 through 35 on page 240.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Debug Binary Search Tree & Traversal Methods',
      subjectId: 'sub-3',
      date: todayIso,
      priority: 'medium',
      durationMinutes: 45,
      completed: false,
      notes: 'Fix in-order recursive method and test boundary cases.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: 'Read Essay on Enlightenment Philosophers',
      subjectId: 'sub-4',
      date: todayIso,
      priority: 'low',
      durationMinutes: 30,
      completed: false,
      notes: 'Prepare 3 discussion questions for seminar.',
      createdAt: new Date().toISOString(),
    },
    // Tomorrow
    {
      id: 'task-5',
      title: 'Organic Chemistry: Mechanism Flashcard Drill',
      subjectId: 'sub-5',
      date: tomorrowIso,
      priority: 'high',
      durationMinutes: 75,
      completed: false,
      notes: 'SN1 vs SN2 reaction condition drills with solvent effects.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-6',
      title: 'Calculus Practice Quiz #2',
      subjectId: 'sub-2',
      date: tomorrowIso,
      priority: 'medium',
      durationMinutes: 45,
      completed: false,
      notes: 'Timed 45-minute simulation without formula sheet.',
      createdAt: new Date().toISOString(),
    },
    // In 2 days
    {
      id: 'task-7',
      title: 'Draft History Research Proposal Outline',
      subjectId: 'sub-4',
      date: dayAfterIso,
      priority: 'medium',
      durationMinutes: 60,
      completed: false,
      notes: 'Include primary sources and preliminary bibliography.',
      createdAt: new Date().toISOString(),
    },
    // In 3 days
    {
      id: 'task-8',
      title: 'Implement Dijkstra Algorithm & Graph Tests',
      subjectId: 'sub-3',
      date: inThreeDaysIso,
      priority: 'high',
      durationMinutes: 90,
      completed: false,
      notes: 'Benchmark priority queue performance.',
      createdAt: new Date().toISOString(),
    },
    // In 4 days
    {
      id: 'task-9',
      title: 'Biology Lab Report: Enzyme Kinetics writeup',
      subjectId: 'sub-1',
      date: inFourDaysIso,
      priority: 'medium',
      durationMinutes: 60,
      completed: false,
      notes: 'Plot Michaelis-Menten curve and calculate Vmax.',
      createdAt: new Date().toISOString(),
    },
    // Yesterday (completed past task for statistics)
    {
      id: 'task-10',
      title: 'Calculus Chapter 3 Homework Review',
      subjectId: 'sub-2',
      date: yesterdayIso,
      priority: 'medium',
      durationMinutes: 60,
      completed: true,
      completedAt: new Date().toISOString(),
      notes: 'All questions checked with solutions manual.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-11',
      title: 'World History Timeline Flashcards',
      subjectId: 'sub-4',
      date: yesterdayIso,
      priority: 'low',
      durationMinutes: 30,
      completed: true,
      completedAt: new Date().toISOString(),
      notes: '18th century treaty dates memorized.',
      createdAt: new Date().toISOString(),
    },
  ];

  const exams: Exam[] = [
    {
      id: 'exam-1',
      subjectId: 'sub-2',
      title: 'Calculus Midterm Examination',
      date: addDays(4),
      time: '10:00 AM',
      room: 'Science Hall 302',
      notes: 'Covers Chapters 1–4. Bring graphing calculator and student ID.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exam-2',
      subjectId: 'sub-1',
      title: 'AP Biology Unit 3 Assessment',
      date: addDays(8),
      time: '01:30 PM',
      room: 'Bio Lab A',
      notes: 'Includes lab practical on photosynthesis & spectrophotometry.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exam-3',
      subjectId: 'sub-3',
      title: 'Computer Science Practical Lab Exam',
      date: addDays(14),
      time: '02:00 PM',
      room: 'Turing Computer Lab',
      notes: 'Live coding test on trees, graphs, and dynamic programming.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exam-4',
      subjectId: 'sub-5',
      title: 'Organic Chemistry Comprehensive Quiz',
      date: addDays(21),
      time: '11:15 AM',
      room: 'Auditorium 101',
      notes: 'Spectroscopy IR & NMR analysis.',
      createdAt: new Date().toISOString(),
    },
  ];

  const profile: UserProfile = {
    name: 'Alex Rivera',
    institution: 'Westlake Academy / College of Science',
    gradeLevel: 'College Sophomore',
    dailyStudyGoalHours: 3.5,
    theme: 'light',
  };

  return { subjects, tasks, exams, profile };
}
