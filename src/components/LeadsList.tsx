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
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <div className='flex'>
          <svg
            className='h-5 w-5 text-red-400'
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
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-red-800'>
              Error loading leads
            </h3>
            <div className='mt-2 text-sm text-red-700'>
              <p>{error}</p>
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

      <header>
        <h1 className='text-2xl font-bold text-gray-900'>Leads</h1>
        <p className='text-gray-600'>Manage and track your sales leads</p>
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
