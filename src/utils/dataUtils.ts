import type { Lead, FilterState, SortState } from '../types';

export const filterLeads = (leads: Lead[], filters: FilterState): Lead[] => {
  return leads.filter(lead => {
    const matchesSearch =
      !filters.search ||
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.company.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === 'all' || lead.status === filters.status;

    return matchesSearch && matchesStatus;
  });
};

export const sortLeads = (leads: Lead[], sort: SortState): Lead[] => {
  return [...leads].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (sort.direction === 'asc') {
      return aString < bString ? -1 : aString > bString ? 1 : 0;
    } else {
      return aString > bString ? -1 : aString < bString ? 1 : 0;
    }
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const simulateApiCall = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const simulateApiError = (
  errorMessage = 'Something went wrong',
  delay = 1000
): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), delay);
  });
};
