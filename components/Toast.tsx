import { ToastState } from '@/lib/hooks/useToast';

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast.visible) return null;

  const typeStyles = {
    success: 'bg-green-600 dark:bg-green-700',
    error: 'bg-red-600 dark:bg-red-700',
    info: 'bg-blue-600 dark:bg-blue-700',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
        toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${typeStyles[toast.type]}`}
      role="alert"
      aria-live="polite"
    >
      <span className="text-lg font-bold" aria-hidden="true">
        {typeIcons[toast.type]}
      </span>
      <span className="text-sm">{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
