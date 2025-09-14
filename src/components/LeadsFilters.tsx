import { useState, useEffect } from 'react';

import type { FilterState, LeadStatus } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface LeadsFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  resultCount: number;
}

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
];

export const LeadsFilters = ({
  filters,
  onFiltersChange,
  resultCount,
}: LeadsFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchValue !== filters.search) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        onFiltersChange({ search: searchValue });
        setIsSearching(false);
      }, 300);
      return () => {
        clearTimeout(timeoutId);
        setIsSearching(false);
      };
    }
  }, [searchValue, filters.search, onFiltersChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ status: e.target.value as LeadStatus | 'all' });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFiltersChange({ search: '', status: 'all' });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all';

  return (
    <div className='bg-white p-6 rounded-lg shadow mb-6'>
      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-end'>
        <div className='flex-1 min-w-0 relative'>
          <Input
            placeholder='Search by name or company...'
            value={searchValue}
            onChange={handleSearchChange}
            className='w-full'
          />
          {isSearching && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              <svg
                className='animate-spin h-4 w-4 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            </div>
          )}
        </div>

        <div className='w-full lg:w-64'>
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant='ghost'
            onClick={handleClearFilters}
            className='whitespace-nowrap'
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className='mt-4 flex items-center justify-between text-sm text-gray-600'>
        <span>
          {resultCount === 1 ? '1 lead found' : `${resultCount} leads found`}
        </span>

        {hasActiveFilters && (
          <span className='text-primary-600'>Filters applied</span>
        )}
      </div>
    </div>
  );
};
