import { X } from 'lucide-react';
import { ReactNode, useEffect, createContext, useContext } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

const DialogContext = createContext<{ onClose: () => void } | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const handleClose = () => onOpenChange(false);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onClose: handleClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        {children}
      </div>
    </DialogContext.Provider>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div
      className={`relative z-50 bg-white shadow-xl ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return <h2 className={className}>{children}</h2>;
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return <p className={className}>{children}</p>;
}

interface DialogCloseProps {
  className?: string;
  children?: ReactNode;
}

export function DialogClose({ className = '', children }: DialogCloseProps) {
  const context = useContext(DialogContext);

  return (
    <button
      className={className}
      type="button"
      onClick={context?.onClose}
    >
      {children || <X className="w-5 h-5" />}
    </button>
  );
}
