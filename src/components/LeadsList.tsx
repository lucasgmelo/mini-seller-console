import { useState } from 'react';

import type { Lead } from '../types';
import { useLeads } from '../hooks/useLeads';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import { SlideOver } from './ui/SlideOver';
import { LeadEditPanel } from './LeadEditPanel';
import { ErrorFallback } from './ui/ErrorFallback';
import { BackToTopButton } from './ui/BackToTopButton';

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
    }
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <header className='mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-primary-600'>
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

        <BackToTopButton threshold={300} />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-custom-white px-4 py-2 rounded-md z-50'
      >
        Skip to main content
      </a>

      <header className='mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold text-primary-600'>
          Leads
        </h1>
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

      <BackToTopButton threshold={300} />
    </div>
  );
};
