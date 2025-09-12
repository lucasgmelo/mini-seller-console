import { useState } from 'react';

import type { Lead } from '../types';
import { useLeads } from '../hooks/useLeads';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import { SlideOver } from './ui/SlideOver';
import { LeadEditPanel } from './LeadEditPanel';

export const LeadsList = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const {
    leads,
    isLoading,
    error,
    refetch,
    filters,
    sort,
    updateFilters,
    updateSort,
    updateLead,
  } = useLeads();

  const handleSort = (field: keyof Lead) => {
    if (sort.field !== field) {
      updateSort({ field, direction: 'asc' });
    } else if (sort.direction === 'asc') {
      updateSort({ field, direction: 'desc' });
    } else {
      updateSort({ field: null, direction: 'asc' });
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleSaveLead = async (updates: Partial<Lead>) => {
    if (selectedLead) {
      await updateLead(selectedLead.id, updates);
      setSelectedLead(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <header className='mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>Leads</h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Manage and track your sales leads
          </p>
        </header>

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
              <h3 className='text-sm font-medium text-red-800'>
                Failed to Load Leads
              </h3>
              <div className='mt-2 text-sm text-red-700'>
                <p>
                  Unable to fetch leads data. Please check your connection and
                  try again.
                </p>
              </div>
              <div className='mt-4'>
                <button
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className='bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50'
      >
        Skip to main content
      </a>

      <header className='mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>Leads</h1>
        <p className='text-sm sm:text-base text-gray-600'>
          Manage and track your sales leads
        </p>
      </header>

      <LeadsFilters
        filters={filters}
        onFiltersChange={updateFilters}
        resultCount={leads.length}
      />

      <main id='main-content'>
        <LeadsTable
          leads={leads}
          loading={isLoading}
          sort={sort}
          onSort={handleSort}
          onSelectLead={handleSelectLead}
        />
      </main>

      <SlideOver
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title='Edit Lead'
      >
        {selectedLead && (
          <LeadEditPanel
            lead={selectedLead}
            onSave={handleSaveLead}
            onClose={() => setSelectedLead(null)}
            isLoading={isLoading}
          />
        )}
      </SlideOver>
    </div>
  );
};
