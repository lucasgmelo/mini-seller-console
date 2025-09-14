import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Opportunity, Lead } from '../types';
import { opportunitiesApi } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

export const useOpportunities = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToastContext();

  const {
    data: opportunities = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.getAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: ({
      lead,
      data,
    }: {
      lead: Lead;
      data: { stage: Opportunity['stage']; amount?: number };
    }) => opportunitiesApi.create(lead, data),
    onMutate: async ({ lead, data }) => {
      await queryClient.cancelQueries({ queryKey: ['opportunities'] });

      const previousOpportunities = queryClient.getQueryData<Opportunity[]>([
        'opportunities',
      ]);

      const optimisticOpportunity: Opportunity = {
        id: `temp-${Date.now()}`,
        name: `${lead.company} - ${lead.name}`,
        stage: data.stage,
        amount: data.amount,
        accountName: lead.company,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Opportunity[]>(
        ['opportunities'],
        (oldOpportunities = []) => [...oldOpportunities, optimisticOpportunity]
      );

      return { previousOpportunities, optimisticOpportunity };
    },

    onError: (_, __, context) => {
      if (context?.previousOpportunities) {
        queryClient.setQueryData(
          ['opportunities'],
          context.previousOpportunities
        );
      }
      showError(
        'Conversion Failed',
        'Lead conversion was rolled back. Please try again.'
      );
    },

    onSuccess: (newOpportunity, _, context) => {
      queryClient.setQueryData<Opportunity[]>(
        ['opportunities'],
        (oldOpportunities = []) =>
          oldOpportunities.map(opp =>
            opp.id === context?.optimisticOpportunity?.id ? newOpportunity : opp
          )
      );
      showSuccess(
        'Opportunity Created',
        'Lead successfully converted to opportunity'
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });

  const createOpportunity = (
    lead: Lead,
    data: { stage: Opportunity['stage']; amount?: number }
  ) => {
    return createMutation.mutateAsync({ lead, data });
  };

  return {
    opportunities,
    isLoading: isLoading || createMutation.isPending,
    error,
    refetch,
    createOpportunity,
  };
};
