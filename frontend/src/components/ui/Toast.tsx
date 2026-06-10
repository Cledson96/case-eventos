export type ToastType = "success" | "error";

export type ToastData = {
  id: number;
  message: string;
  type: ToastType;
};

const toastStyles: Record<ToastType, string> = {
  success: "border-green-600 bg-green-50 text-green-900",
  error: "border-red-600 bg-red-50 text-red-900",
};

type ToastViewportProps = {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
          className={`animate-toast flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-md ${toastStyles[toast.type]}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => onDismiss(toast.id)}
            className="-mr-1 inline-flex size-5 shrink-0 items-center justify-center rounded text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
