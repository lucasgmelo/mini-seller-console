import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Opportunity, Lead } from '../types';
import { opportunitiesApi } from '../services/api';

export const useOpportunities = () => {
  const queryClient = useQueryClient();

  const {
    data: opportunities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ({
      lead,
      data,
    }: {
      lead: Lead;
      data: { stage: Opportunity['stage']; amount?: number };
    }) => opportunitiesApi.create(lead, data),
    onSuccess: newOpportunity => {
      queryClient.setQueryData(
        ['opportunities'],
        (oldOpportunities: Opportunity[] = []) => [
          ...oldOpportunities,
          newOpportunity,
        ]
      );
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
    error: error?.message || createMutation.error?.message || null,
    createOpportunity,
  };
};
