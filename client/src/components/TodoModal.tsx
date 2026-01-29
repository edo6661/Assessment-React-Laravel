import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Todo, TodoFormValues } from '../types';
import { Loader2, X } from 'lucide-react';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  descriptions: z.string().optional().nullable(),
  is_done: z.boolean().default(false),
});

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormValues) => void;
  initialData?: Todo | null;
  isSubmitting: boolean;
}

export default function TodoModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TodoModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      descriptions: '',
      is_done: false,
    },
    values: {
      title: initialData?.title ?? '',
      descriptions: initialData?.descriptions ?? '',
      is_done: initialData?.is_done ?? false,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={isSubmitting} className="space-y-5 disabled:opacity-70">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                {...register('title')}
                autoFocus
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:bg-gray-50"
                placeholder="Ex: Meeting with client"
              />
              {errors.title && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea
                {...register('descriptions')}
                rows={4}
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all disabled:bg-gray-50 resize-none"
                placeholder="Add task details..."
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <input
                type="checkbox"
                id="modal_is_done"
                {...register('is_done')}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <label htmlFor="modal_is_done" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Mark as completed
              </label>
            </div>
          </fieldset>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}