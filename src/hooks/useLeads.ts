import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Lead, FilterState, SortState } from '../types';
import { filterLeads, sortLeads } from '../utils/dataUtils';
import { useLocalStorage } from './useLocalStorage';
import { leadsApi } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

export const useLeads = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();

  const [filters, setFilters] = useLocalStorage<FilterState>('leads-filters', {
    search: '',
    status: 'all',
  });

  const [sort, setSort] = useLocalStorage<SortState>('leads-sort', {
    field: null,
    direction: 'asc',
  });

  const {
    data: leads = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lead> }) =>
      leadsApi.update(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);

      queryClient.setQueryData<Lead[]>(['leads'], (oldLeads = []) =>
        oldLeads.map(lead => (lead.id === id ? { ...lead, ...updates } : lead))
      );

      return { previousLeads, id, updates };
    },

    onError: (_, __, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(['leads'], context.previousLeads);
      }
      showError('Update Failed', 'Changes were rolled back. Please try again.');
    },

    onSuccess: () => {
      showSuccess('Lead Updated', 'Changes saved successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const processedLeads = useMemo(() => {
    const filtered = filterLeads(leads, filters);
    return sortLeads(filtered, sort);
  }, [leads, filters, sort]);

  const updateLead = useCallback(
    (leadId: string, updates: Partial<Lead>) => {
      return updateMutation.mutateAsync({ id: leadId, updates });
    },
    [updateMutation]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    },
    [setFilters]
  );

  const updateSort = useCallback(
    (newSort: Partial<SortState>) => {
      setSort(prev => ({ ...prev, ...newSort }));
    },
    [setSort]
  );

  return {
    leads: processedLeads,
    allLeads: leads,
    isLoading: isLoading || updateMutation.isPending,
    error,
    refetch,
    filters,
    sort,
    updateLead,
    updateFilters,
    updateSort,
  };
};
