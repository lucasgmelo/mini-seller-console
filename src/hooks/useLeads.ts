import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Lead, FilterState, SortState } from '../types';
import { filterLeads, sortLeads } from '../utils/dataUtils';
import { useLocalStorage } from './useLocalStorage';
import { leadsApi } from '../services/api';

export const useLeads = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useLocalStorage<FilterState>('leads-filters', {
    search: '',
    status: 'all',
  });

  const [sort, setSort] = useLocalStorage<SortState>('leads-sort', {
    field: 'score',
    direction: 'desc',
  });

  const {
    data: leads = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lead> }) =>
      leadsApi.update(id, updates),
    onSuccess: updatedLead => {
      queryClient.setQueryData(['leads'], (oldLeads: Lead[] = []) =>
        oldLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead))
      );
    },
  });

  const processedLeads = useMemo(() => {
    const filtered = filterLeads(leads, filters);
    return sortLeads(filtered, sort);
  }, [leads, filters, sort]);

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    return updateMutation.mutateAsync({ id: leadId, updates });
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateSort = (newSort: Partial<SortState>) => {
    setSort(prev => ({ ...prev, ...newSort }));
  };

  return {
    leads: processedLeads,
    allLeads: leads,
    isLoading: isLoading || updateMutation.isPending,
    error: error?.message || updateMutation.error?.message || null,
    filters,
    sort,
    updateLead,
    updateFilters,
    updateSort,
  };
};
