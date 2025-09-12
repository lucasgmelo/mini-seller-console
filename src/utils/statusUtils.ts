import type { LeadStatus } from '../types';

export const getStatusColor = (status: LeadStatus) => {
  const colors = {
    new: 'info' as const,
    contacted: 'warning' as const,
    qualified: 'success' as const,
    unqualified: 'danger' as const,
  };
  return colors[status];
};

export const getStatusLabel = (status: LeadStatus) => {
  const labels = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    unqualified: 'Unqualified',
  };
  return labels[status];
};

export const formatScore = (score: number) => {
  return `${score}/100`;
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};
