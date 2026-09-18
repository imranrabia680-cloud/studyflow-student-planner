import { useState } from 'react';
import { Subject } from '../../types';
import { usePlanner } from '../../context/PlannerContext';
import { SubjectFormModal } from './SubjectFormModal';
import { getSubjectColorStyles } from '../../utils/colors';
import { formatMinutes } from '../../utils/dateUtils';
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlarmClock,
  ListFilter,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export function SubjectManagement() {
  const { subjects, tasks, exams, deleteSubject, openTaskModal } = usePlanner();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const handleEdit = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSubjectToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete.id);
      setSubjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Subject Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize coursework, custom subject colors, and syllabus tracks
          </p>
        </div>

        <button
          id="add-subject-btn"
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Empty State */}
      {subjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Subjects Added Yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Add your academic subjects (e.g. Calculus, Biology, World History) to organize tasks, track exams, and plan study time.
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Subject</span>
          </button>
        </div>
      ) : (
        /* Organized Subject Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map(subject => {
            const colorStyles = getSubjectColorStyles(subject.color);

            // Calculate stats for this subject
            const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
            const completedCount = subjectTasks.filter(t => t.completed).length;
            const totalDurationMinutes = subjectTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
            const subjectExams = exams.filter(e => e.subjectId === subject.id);
            const progressPercent =
              subjectTasks.length > 0 ? Math.round((completedCount / subjectTasks.length) * 100) : 0;

            return (
              <div
                key={subject.id}
                className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Subject Color Bar & Code */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs"
                        style={{ backgroundColor: colorStyles.color }}
                      />
                      {subject.code && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {subject.code}
                        </span>
                      )}
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleEdit(subject)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Subject"
                        aria-label="Edit Subject"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubjectToDelete(subject)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete Subject"
                        aria-label="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {subject.name}
                  </h3>
                  {subject.description ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                      {subject.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1.5">
                      No additional description
                    </p>
                  )}
                </div>

                {/* Subject Metrics / Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <span>Tasks Completion</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {completedCount}/{subjectTasks.length} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: colorStyles.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Badges / Counters */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5" title="Total Study Time">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatMinutes(totalDurationMinutes)}
                    </span>

                    {subjectExams.length > 0 && (
                      <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold" title="Scheduled Exams">
                        <AlarmClock className="w-3.5 h-3.5" />
                        {subjectExams.length} {subjectExams.length === 1 ? 'Exam' : 'Exams'}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => openTaskModal(undefined, subject.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Task
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <SubjectFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSubjectToEdit(null);
        }}
        subjectToEdit={subjectToEdit}
      />

      {/* Delete Confirmation Modal */}
      {subjectToDelete && (
        <Modal
          isOpen={!!subjectToDelete}
          onClose={() => setSubjectToDelete(null)}
          title="Delete Subject?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-200">
                <p className="font-semibold mb-1">
                  Are you sure you want to delete "{subjectToDelete.name}"?
                </p>
                <p>
                  This action will also remove all associated study tasks and exams assigned to this subject.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                Yes, Delete Subject
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
