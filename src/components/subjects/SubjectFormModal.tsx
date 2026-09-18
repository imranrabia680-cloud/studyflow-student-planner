import React, { useState, useEffect } from 'react';
import { Subject } from '../../types';
import { Modal } from '../common/Modal';
import { usePlanner } from '../../context/PlannerContext';
import { SUBJECT_COLORS, DEFAULT_COLOR } from '../../utils/colors';
import { AlertCircle } from 'lucide-react';

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
}

export function SubjectFormModal({
  isOpen,
  onClose,
  subjectToEdit,
}: SubjectFormModalProps) {
  const { addSubject, updateSubject } = usePlanner();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setCode(subjectToEdit.code || '');
      setColor(subjectToEdit.color || DEFAULT_COLOR);
      setDescription(subjectToEdit.description || '');
    } else {
      setName('');
      setCode('');
      // Cycle a random or next color from palette
      setColor(SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)].hex);
      setDescription('');
    }
    setErrors({});
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Subject name is required' });
      return;
    }

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, {
        name: name.trim(),
        code: code.trim() || undefined,
        color,
        description: description.trim() || undefined,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim() || undefined,
        color,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
      subtitle="Organize your courses and learning tracks"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Name */}
        <div>
          <label htmlFor="subject-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Subject Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="subject-name-input"
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            placeholder="e.g. Molecular Genetics or Calculus II"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
            autoFocus
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Course Code */}
        <div>
          <label htmlFor="subject-code-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Course Code / Short Tag (Optional)
          </label>
          <input
            id="subject-code-input"
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="e.g. BIO-101, MATH-202"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
          />
        </div>

        {/* Color Picker Palette */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Subject Color
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SUBJECT_COLORS.map(c => {
              const isSelected = color.toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  className={`h-9 w-full rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-105'
                      : 'hover:opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description / Instructor notes */}
        <div>
          <label htmlFor="subject-desc-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Description / Focus Area (Optional)
          </label>
          <textarea
            id="subject-desc-input"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Topics covered, instructor name, room or textbook info..."
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
            {subjectToEdit ? 'Update Subject' : 'Save Subject'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
