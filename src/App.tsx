import { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { TaskManager } from './components/tasks/TaskManager';
import { SubjectManagement } from './components/subjects/SubjectManagement';
import { WeeklyPlanner } from './components/planner/WeeklyPlanner';
import { ExamCountdown } from './components/exams/ExamCountdown';
import { ProgressTracking } from './components/progress/ProgressTracking';
import { SettingsView } from './components/settings/SettingsView';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { motion, AnimatePresence } from 'motion/react';

function PlannerAppContent() {
  const {
    activeTab,
    isTaskModalOpen,
    closeTaskModal,
    taskModalInitialDate,
    taskModalInitialSubjectId,
  } = usePlanner();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer & Bottom Bar */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content View with Animation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 min-w-0 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'tasks' && <TaskManager />}
              {activeTab === 'subjects' && <SubjectManagement />}
              {activeTab === 'planner' && <WeeklyPlanner />}
              {activeTab === 'exams' && <ExamCountdown />}
              {activeTab === 'progress' && <ProgressTracking />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Task Modal (can be triggered from anywhere: Header "+ New Task", Weekly day "+", etc.) */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        initialDate={taskModalInitialDate}
        initialSubjectId={taskModalInitialSubjectId}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <PlannerAppContent />
    </PlannerProvider>
  );
}
