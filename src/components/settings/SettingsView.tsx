import React, { useState, useRef } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import {
  Sun,
  Moon,
  Laptop,
  User,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export function SettingsView() {
  const {
    profile,
    updateProfile,
    resetToDemoData,
    clearAllData,
    exportDataJSON,
    importDataJSON,
    subjects,
    tasks,
    exams,
  } = usePlanner();

  const [name, setName] = useState(profile.name);
  const [institution, setInstitution] = useState(profile.institution || '');
  const [gradeLevel, setGradeLevel] = useState(profile.gradeLevel || 'College Undergrad');
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyStudyGoalHours || 3);
  const [isSaved, setIsSaved] = useState(false);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Student',
      institution: institution.trim(),
      gradeLevel: gradeLevel.trim(),
      dailyStudyGoalHours: Number(dailyGoalHours) || 3,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize display preferences, profile information, and local data storage
        </p>
      </div>

      {/* Appearance / Theme */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Appearance & Theme
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose a visual theme designed for comfortable daytime or late-night study sessions
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light mode */}
          <button
            type="button"
            onClick={() => updateProfile({ theme: 'light' })}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
              profile.theme === 'light'
                ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-100/80 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                Light Mode
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Clean daylight palette with crisp contrast
              </span>
            </div>
          </button>

          {/* Dark mode */}
          <button
            type="button"
            onClick={() => updateProfile({ theme: 'dark' })}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
              profile.theme === 'dark'
                ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-indigo-100/80 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                Dark Mode
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Eye-friendly dark tones for evening focus
              </span>
            </div>
          </button>

          {/* System sync */}
          <button
            type="button"
            onClick={() => updateProfile({ theme: 'system' })}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
              profile.theme === 'system'
                ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                System Default
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sync with your operating system preference
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Student Profile Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Student Profile
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Your personal academic details for personalized greetings and target calculations
        </p>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Student Name
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>

            {/* School / Institution */}
            <div>
              <label htmlFor="student-school-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                School / University
              </label>
              <input
                id="student-school-input"
                type="text"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="e.g. Westlake Academy or State College"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Academic Level */}
            <div>
              <label htmlFor="student-grade-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Academic Level
              </label>
              <select
                id="student-grade-input"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="High School Freshman (Grade 9)">High School Freshman (Grade 9)</option>
                <option value="High School Sophomore (Grade 10)">High School Sophomore (Grade 10)</option>
                <option value="High School Junior (Grade 11)">High School Junior (Grade 11)</option>
                <option value="High School Senior (Grade 12)">High School Senior (Grade 12)</option>
                <option value="College Freshman">College Freshman</option>
                <option value="College Sophomore">College Sophomore</option>
                <option value="College Junior">College Junior</option>
                <option value="College Senior">College Senior</option>
                <option value="Graduate / Post-Grad">Graduate / Post-Grad</option>
                <option value="Independent Self-Learner">Independent Self-Learner</option>
              </select>
            </div>

            {/* Daily Goal in Hours */}
            <div>
              <label htmlFor="daily-goal-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Daily Study Target (Hours)
              </label>
              <input
                id="daily-goal-input"
                type="number"
                step="0.5"
                min="0.5"
                max="14"
                value={dailyGoalHours}
                onChange={e => setDailyGoalHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile saved!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Local Storage & Data Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Data & Local Privacy
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          All your planner data ({subjects.length} subjects, {tasks.length} tasks, {exams.length} exams) is safely stored locally in your browser storage. No account, login, or external server connection is required.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export Backup */}
          <button
            type="button"
            onClick={exportDataJSON}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Export JSON Backup
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Save a copy to your computer
                </span>
              </div>
            </div>
          </button>

          {/* Import Backup */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Restore from Backup
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Load previously exported JSON
                </span>
              </div>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Restore Demo Data
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Load sample subjects & schedule
                </span>
              </div>
            </div>
          </button>

          {/* Clear All Data */}
          <button
            type="button"
            onClick={() => setIsClearConfirmOpen(true)}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block">
                  Clear All Data
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Wipe tasks, subjects, & exams
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* App Info Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300 mb-1">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>StudyFlow – Smart Student Planner</span>
        </div>
        <p>
          Version 1.0.0 • Designed for high school & college academic excellence
        </p>
      </div>

      {/* Confirmation Modals */}
      {isResetConfirmOpen && (
        <Modal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          title="Restore Sample Demo Data?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Reset to original sample data?</p>
                <p>
                  This will reload the initial sample courses, assignments, and test schedules.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isClearConfirmOpen && (
        <Modal
          isOpen={isClearConfirmOpen}
          onClose={() => setIsClearConfirmOpen(false)}
          title="Clear All Study Data?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-200">
                <p className="font-semibold mb-1">Permanently delete all planner data?</p>
                <p>
                  This will remove all subjects, study tasks, and exam dates from local storage.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  setIsClearConfirmOpen(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
