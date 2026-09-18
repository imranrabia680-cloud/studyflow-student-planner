import { useState, useMemo } from 'react';
import { Exam } from '../../types';
import { usePlanner } from '../../context/PlannerContext';
import { ExamFormModal } from './ExamFormModal';
import { getSubjectColorStyles } from '../../utils/colors';
import { getRelativeDayDescription, formatNiceDate } from '../../utils/dateUtils';
import {
  Plus,
  AlarmClock,
  Clock,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export function ExamCountdown() {
  const { exams, getSubject, deleteExam, subjects, setActiveTab } = usePlanner();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [filterView, setFilterView] = useState<'upcoming' | 'all'>('upcoming');

  // Decorate exams with relative day info and sort
  const processedExams = useMemo(() => {
    return exams
      .map(exam => {
        const relative = getRelativeDayDescription(exam.date);
        return {
          ...exam,
          relative,
        };
      })
      .filter(e => {
        if (filterView === 'upcoming') return !e.relative.isPast;
        return true;
      })
      .sort((a, b) => a.relative.daysRemaining - b.relative.daysRemaining);
  }, [exams, filterView]);

  const handleEdit = (exam: Exam) => {
    setExamToEdit(exam);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setExamToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (examToDelete) {
      deleteExam(examToDelete.id);
      setExamToDelete(null);
    }
  };

  const upcomingCount = exams.filter(e => !getRelativeDayDescription(e.date).isPast).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Exam Countdown
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Stay ahead of midterms, finals, quizzes, and project evaluations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View filter toggle */}
          <div className="flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterView('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterView === 'upcoming'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setFilterView('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterView === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({exams.length})
            </button>
          </div>

          <button
            id="add-exam-btn"
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {processedExams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
            <AlarmClock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Upcoming Exams Scheduled
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Keep track of your test dates so you never get caught off guard by an exam or presentation deadline.
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule an Exam</span>
          </button>
        </div>
      ) : (
        /* Exams Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedExams.map(exam => {
            const subject = getSubject(exam.subjectId);
            const colorStyles = getSubjectColorStyles(subject?.color);
            const daysLeft = exam.relative.daysRemaining;
            const isPast = exam.relative.isPast;

            // Urgency color logic
            const isCritical = !isPast && daysLeft <= 3;
            const isApproaching = !isPast && daysLeft > 3 && daysLeft <= 7;

            return (
              <div
                key={exam.id}
                className={`group relative rounded-2xl bg-white dark:bg-slate-900 border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isCritical
                    ? 'border-rose-300 dark:border-rose-900 ring-2 ring-rose-500/10'
                    : isApproaching
                    ? 'border-amber-300 dark:border-amber-900/60'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Top Subject Tag & Actions */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {subject ? (
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-md border inline-flex items-center gap-1.5"
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
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">General</span>
                    )}

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleEdit(exam)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Exam"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExamToDelete(exam)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Exam Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {exam.title}
                  </h3>

                  {/* Countdown Highlight Banner */}
                  <div
                    className={`mt-4 p-3 rounded-xl border flex items-center justify-between ${
                      isPast
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        : isCritical
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-900'
                        : isApproaching
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-900'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100 border-indigo-200 dark:border-indigo-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlarmClock
                        className={`w-4 h-4 ${
                          isCritical ? 'text-rose-600 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {isPast ? 'Exam Concluded' : 'Countdown'}
                      </span>
                    </div>

                    <span className="text-sm font-extrabold font-display">
                      {exam.relative.text}
                    </span>
                  </div>

                  {/* Details (Date, Time, Room) */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatNiceDate(exam.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {exam.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{exam.time}</span>
                      </div>
                    )}

                    {exam.room && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{exam.room}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes / Coverage */}
                  {exam.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{exam.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer Quick Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {isPast ? 'Passed' : daysLeft === 0 ? 'Happening today' : `${daysLeft} days to prepare`}
                  </span>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <ExamFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setExamToEdit(null);
        }}
        examToEdit={examToEdit}
      />

      {/* Delete Confirmation Modal */}
      {examToDelete && (
        <Modal
          isOpen={!!examToDelete}
          onClose={() => setExamToDelete(null)}
          title="Delete Exam Schedule?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-white">"{examToDelete.title}"</span> from your exam countdown?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                Delete Exam
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
