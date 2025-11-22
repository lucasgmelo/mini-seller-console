import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={selectId}
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-describedby={errorId}
          aria-invalid={!!error}
          className={`w-full px-3 py-2 border border-surface-300 rounded-md shadow-sm bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : ''
          } ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className='mt-1 text-sm text-red-600' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
