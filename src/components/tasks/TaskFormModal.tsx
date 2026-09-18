import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { usePlanner } from '../../context/PlannerContext';
import { getTodayIsoString, formatToIsoDate } from '../../utils/dateUtils';
import { Clock, Calendar, BookOpen, AlertCircle, Plus } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  initialDate?: string;
  initialSubjectId?: string;
}

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

export function TaskFormModal({
  isOpen,
  onClose,
  taskToEdit,
  initialDate,
  initialSubjectId,
}: TaskFormModalProps) {
  const { subjects, addTask, updateTask, setActiveTab } = usePlanner();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(getTodayIsoString());
  const [priority, setPriority] = useState<Priority>('medium');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; subjectId?: string }>({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSubjectId(taskToEdit.subjectId);
      setDate(taskToEdit.date);
      setPriority(taskToEdit.priority);
      setDurationMinutes(taskToEdit.durationMinutes || 45);
      setNotes(taskToEdit.notes || '');
    } else {
      setTitle('');
      setDate(initialDate || getTodayIsoString());
      setPriority('medium');
      setDurationMinutes(45);
      setNotes('');
      // Default to initial subject or first subject in list
      if (initialSubjectId) {
        setSubjectId(initialSubjectId);
      } else if (subjects.length > 0) {
        setSubjectId(subjects[0].id);
      } else {
        setSubjectId('');
      }
    }
    setErrors({});
  }, [taskToEdit, initialDate, initialSubjectId, subjects, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; subjectId?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a task title';
    }
    if (!subjectId) {
      newErrors.subjectId = 'Please select a subject';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        subjectId,
        date,
        priority,
        durationMinutes: Number(durationMinutes) || 30,
        notes: notes.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        date,
        priority,
        durationMinutes: Number(durationMinutes) || 30,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const handleQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(formatToIsoDate(d));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Study Task' : 'New Study Task'}
      subtitle={taskToEdit ? 'Update your study assignment details' : 'Plan your next focused study session'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label htmlFor="task-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
            }}
            placeholder="e.g. Read Chapter 4 & write summary notes"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="task-subject-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Subject <span className="text-rose-500">*</span>
            </label>
            {subjects.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('subjects');
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Subjects First
              </button>
            )}
          </div>
          <div className="relative">
            <select
              id="task-subject-select"
              value={subjectId}
              onChange={e => {
                setSubjectId(e.target.value);
                if (errors.subjectId) setErrors(prev => ({ ...prev, subjectId: undefined }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm appearance-none cursor-pointer pr-10"
            >
              {subjects.length === 0 ? (
                <option value="">No subjects created yet</option>
              ) : (
                subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.code ? `(${s.code})` : ''}
                  </option>
                ))
              )}
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

        {/* Date & Quick Buttons */}
        <div>
          <label htmlFor="task-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Scheduled Date
          </label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleQuickDate(0)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                date === getTodayIsoString()
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(1)}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(2)}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              +2 Days
            </button>
          </div>
          <div className="relative">
            <input
              id="task-date-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
              required
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Priority Radio Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map(p => {
              const isSelected = priority === p;
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? p === 'high'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-xs'
                        : p === 'medium'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p === 'high' ? 'bg-rose-500' : p === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estimated Duration */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Estimated Duration
            </label>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {durationMinutes >= 60
                ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 ? `${durationMinutes % 60}m` : ''}`
                : `${durationMinutes}m`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {DURATION_PRESETS.map(mins => (
              <button
                type="button"
                key={mins}
                onClick={() => setDurationMinutes(mins)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  durationMinutes === mins
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mins < 60 ? `${mins}m` : `${mins / 60}h`}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="5"
            max="480"
            step="5"
            value={durationMinutes}
            onChange={e => setDurationMinutes(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>

        {/* Optional Notes */}
        <div>
          <label htmlFor="task-notes-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Notes / Study Checklist (Optional)
          </label>
          <textarea
            id="task-notes-input"
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Key formulas, textbook pages, links or reminder..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
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
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
