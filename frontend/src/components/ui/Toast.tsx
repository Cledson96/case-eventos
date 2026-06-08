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
};

export function ToastViewport({ toasts }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`rounded-md border px-4 py-3 text-sm shadow-md ${toastStyles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
