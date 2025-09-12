import { useEffect, useRef } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SlideOver = ({
  isOpen,
  onClose,
  title,
  children,
}: SlideOverProps) => {
  const slideOverRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      slideOverRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50'
      onClick={handleBackdropClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='slide-over-title'
    >
      <div className='fixed inset-y-0 right-0 flex max-w-full pl-10'>
        <div
          ref={slideOverRef}
          className='pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-300'
          tabIndex={-1}
        >
          <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
              <h2
                id='slide-over-title'
                className='text-lg font-semibold text-gray-900'
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1'
                aria-label='Close panel'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='flex-1 px-6 py-6'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
