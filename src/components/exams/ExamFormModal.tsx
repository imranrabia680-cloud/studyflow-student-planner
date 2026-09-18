import React, { useState, useEffect } from 'react';
import { Exam } from '../../types';
import { Modal } from '../common/Modal';
import { usePlanner } from '../../context/PlannerContext';
import { getTodayIsoString, formatToIsoDate } from '../../utils/dateUtils';
import { Calendar, Clock, MapPin, AlertCircle, BookOpen } from 'lucide-react';

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  examToEdit?: Exam | null;
}

export function ExamFormModal({
  isOpen,
  onClose,
  examToEdit,
}: ExamFormModalProps) {
  const { subjects, addExam, updateExam } = usePlanner();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatToIsoDate(d);
  });
  const [time, setTime] = useState('09:00 AM');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; subjectId?: string }>({});

  useEffect(() => {
    if (examToEdit) {
      setTitle(examToEdit.title);
      setSubjectId(examToEdit.subjectId);
      setDate(examToEdit.date);
      setTime(examToEdit.time || '');
      setRoom(examToEdit.room || '');
      setNotes(examToEdit.notes || '');
    } else {
      setTitle('');
      if (subjects.length > 0) {
        setSubjectId(subjects[0].id);
      } else {
        setSubjectId('');
      }
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDate(formatToIsoDate(d));
      setTime('09:00 AM');
      setRoom('');
      setNotes('');
    }
    setErrors({});
  }, [examToEdit, subjects, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; subjectId?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Exam title is required';
    }
    if (!subjectId) {
      newErrors.subjectId = 'Please select a subject';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (examToEdit) {
      updateExam(examToEdit.id, {
        title: title.trim(),
        subjectId,
        date,
        time: time.trim() || undefined,
        room: room.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addExam({
        title: title.trim(),
        subjectId,
        date,
        time: time.trim() || undefined,
        room: room.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={examToEdit ? 'Edit Exam' : 'Add Upcoming Exam'}
      subtitle="Track midterms, finals, quizzes, and assessments"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exam Title */}
        <div>
          <label htmlFor="exam-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Exam / Assessment Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="exam-title-input"
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
            }}
            placeholder="e.g. Midterm Examination 1 or Chemistry Final"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Subject Selection */}
        <div>
          <label htmlFor="exam-subject-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Subject <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              id="exam-subject-select"
              value={subjectId}
              onChange={e => {
                setSubjectId(e.target.value);
                if (errors.subjectId) setErrors(prev => ({ ...prev, subjectId: undefined }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none cursor-pointer pr-10"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.code ? `(${s.code})` : ''}
                </option>
              ))}
            </select>
            <BookOpen className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.subjectId && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.subjectId}
            </p>
          )}
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="exam-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Exam Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="exam-date-input"
                type="date"
                value={date}
                min={getTodayIsoString()}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                required
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="exam-time-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Time (Optional)
            </label>
            <div className="relative">
              <input
                id="exam-time-input"
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Location / Room */}
        <div>
          <label htmlFor="exam-room-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Location / Room (Optional)
          </label>
          <div className="relative">
            <input
              id="exam-room-input"
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="e.g. Room 402, Main Auditorium, or Online LMS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="exam-notes-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Coverage / Notes (Optional)
          </label>
          <textarea
            id="exam-notes-input"
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Key topics, what to bring (calculator, ID), cheat sheet rules..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all resize-none"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-xs transition-colors"
          >
            {examToEdit ? 'Save Changes' : 'Schedule Exam'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
