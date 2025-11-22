import { useState, useCallback } from 'react';

import type { Lead } from '../types';
import { useLeads } from '../hooks/useLeads';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import { SlideOver } from './ui/SlideOver';
import { LeadEditPanel } from './LeadEditPanel';
import { ErrorFallback } from './ui/ErrorFallback';

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

  const handleSort = useCallback(
    (field: keyof Lead) => {
      if (sort.field !== field) {
        updateSort({ field, direction: 'asc' });
      } else if (sort.direction === 'asc') {
        updateSort({ field, direction: 'desc' });
      } else {
        updateSort({ field: null, direction: 'asc' });
      }
    },
    [sort.field, sort.direction, updateSort]
  );

  const handleSelectLead = useCallback((lead: Lead) => {
    setSelectedLead(lead);
  }, []);

  const handleSaveLead = useCallback(
    async (updates: Partial<Lead>) => {
      if (selectedLead) {
        await updateLead(selectedLead.id, updates);
      }
    },
    [selectedLead, updateLead]
  );

  const handleClosePanel = useCallback(() => {
    setSelectedLead(null);
  }, []);

  if (error) {
    return (
      <div className='space-y-6'>
        <header className='mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-primary-800'>
            Leads
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Manage and track your sales leads
          </p>
        </header>

        <ErrorFallback
          title='Failed to Load Leads'
          description='Unable to fetch leads data. Please check your connection and try again.'
          onRetry={() => refetch()}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-300 text-primary-900 px-4 py-2 rounded-md z-50'
      >
        Skip to main content
      </a>

      <header className='mb-6 flex-shrink-0'>
        <h1 className='text-xl sm:text-2xl font-bold text-primary-800'>
          Leads
        </h1>
        <p className='text-sm sm:text-base text-gray-600'>
          Manage and track your sales leads
        </p>
      </header>

      <div className='flex-shrink-0'>
        <LeadsFilters
          filters={filters}
          onFiltersChange={updateFilters}
          resultCount={leads.length}
        />
      </div>

      <main id='main-content' className='flex-1 min-h-0'>
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
        onClose={handleClosePanel}
        title='Edit Lead'
      >
        {selectedLead && (
          <LeadEditPanel
            lead={selectedLead}
            onSave={handleSaveLead}
            onClose={handleClosePanel}
            isLoading={isLoading}
          />
        )}
      </SlideOver>
    </div>
  );
};
