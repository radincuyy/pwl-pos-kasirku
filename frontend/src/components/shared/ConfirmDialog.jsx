import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onClose,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(95vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 rounded-3xl bg-rose-100 px-3 py-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              <Dialog.Title className="text-sm font-semibold">{title}</Dialog.Title>
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <Dialog.Description className="mt-4 text-sm leading-6 text-slate-600">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-3xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              {cancelText}
            </button>
            <button type="button" onClick={onConfirm} className="rounded-3xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};