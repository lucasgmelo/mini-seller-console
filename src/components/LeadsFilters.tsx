import { useState, useEffect, useCallback } from 'react';

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

  const debouncedUpdateSearch = useCallback(
    (value: string) => {
      const timeoutId = setTimeout(() => {
        onFiltersChange({ search: value });
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [onFiltersChange]
  );

  useEffect(() => {
    if (searchValue !== filters.search) {
      const cleanup = debouncedUpdateSearch(searchValue);
      return cleanup;
    }
  }, [searchValue, filters.search, debouncedUpdateSearch]);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

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
        <div className='flex-1 min-w-0'>
          <Input
            placeholder='Search by name or company...'
            value={searchValue}
            onChange={handleSearchChange}
            className='w-full'
          />
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
          <span className='text-blue-600'>Filters applied</span>
        )}
      </div>
    </div>
  );
};
