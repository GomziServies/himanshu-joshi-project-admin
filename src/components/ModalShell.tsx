import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Portalled to body so page layout utilities (space-y-*) cannot add margins to the overlay
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-sanctum/70 p-4 backdrop-blur-sm sm:py-10">
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg overflow-hidden rounded-2xl bg-ivory-50 shadow-2xl">
        <div className="jaali flex items-center justify-between bg-sanctum px-5 py-3.5">
          <h2 className="font-title text-xl text-brass-300">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ivory-200 transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalShell;
