interface ErrorFallbackProps {
  title: string;
  description: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export const ErrorFallback = ({
  title,
  description,
  onRetry,
  isRetrying,
}: ErrorFallbackProps) => {
  return (
    <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
      <div className='flex items-start'>
        <svg
          className='h-6 w-6 text-red-400 mt-0.5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <div className='ml-3 flex-1'>
          <h3 className='text-sm font-medium text-red-800'>{title}</h3>
          <div className='mt-2 text-sm text-red-700'>
            <p>{description}</p>
          </div>
          <div className='mt-4'>
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className='bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors'
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
