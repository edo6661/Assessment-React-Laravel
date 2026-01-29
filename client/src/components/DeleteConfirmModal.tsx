import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 ring-4 ring-red-50/50">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="w-full">
            <h2 className="text-xl font-bold text-gray-900">Delete Task?</h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to delete the task <span className="font-semibold text-gray-900">"{title}"</span>?
              <br className="hidden sm:block" /> This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Deleting...</span>
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}