import { useScrollToTop } from '../../hooks/useScrollToTop';

interface BackToTopButtonProps {
  threshold?: number;
}

export const BackToTopButton = ({ threshold = 400 }: BackToTopButtonProps) => {
  const { showButton, scrollToTop } = useScrollToTop({ threshold });

  if (!showButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-8 right-8 z-50 bg-primary-500 hover:bg-primary-600 text-custom-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      aria-label='Back to top'
      title='Back to top'
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
          d='M5 10l7-7m0 0l7 7m-7-7v18'
        />
      </svg>
    </button>
  );
};
