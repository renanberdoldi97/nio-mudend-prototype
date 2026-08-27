'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  sheetId: string;
  title?: string;
  blocking?: boolean;
  children: React.ReactNode;
};

export function BottomSheet({ open, onClose, sheetId, title, blocking = false, children }: BottomSheetProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      trackEvent('bottom_sheet_open', pathname, sheetId);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    trackEvent('bottom_sheet_close', pathname, sheetId);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={blocking ? undefined : handleClose}
            className="absolute inset-0 z-40 bg-overlay"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) handleClose();
            }}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 max-h-[90%] overflow-y-auto no-scrollbar',
              'rounded-t-2xl bg-white shadow-bottom-sheet px-4 pb-6 pt-2'
            )}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
            {title && <h2 className="mb-3 text-lg font-semibold text-verde-escuro">{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
