import { useEffect, useRef, type ReactNode } from "react";

// A native modal <dialog>, shown while mounted. Escape calls onCancel; the
// parent unmounts it to close.
export function Dialog({ onCancel, children }: { onCancel: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => ref.current?.showModal(), []);

  return (
    <dialog
      ref={ref}
      className="dialog"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      {children}
    </dialog>
  );
}
