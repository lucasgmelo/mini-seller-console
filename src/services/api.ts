import type { Lead, Opportunity } from '../types';
import { mockLeads, mockOpportunities } from '../data/mockData';
import { simulateApiCall, generateId } from '../utils/dataUtils';

export const leadsApi = {
  getAll: (): Promise<Lead[]> => {
    return simulateApiCall(mockLeads, 500);
  },

  update: (id: string, updates: Partial<Lead>): Promise<Lead> => {
    const lead = mockLeads.find(l => l.id === id);
    if (!lead) {
      throw new Error('Lead not found');
    }
    const updatedLead = { ...lead, ...updates };
    return simulateApiCall(updatedLead, 300, 0.2);
  },
};

export const opportunitiesApi = {
  getAll: (): Promise<Opportunity[]> => {
    return simulateApiCall(mockOpportunities, 300);
  },

  create: (
    lead: Lead,
    data: { stage: Opportunity['stage']; amount?: number }
  ): Promise<Opportunity> => {
    const newOpportunity: Opportunity = {
      id: generateId(),
      name: `${lead.company} - ${lead.name}`,
      stage: data.stage,
      amount: data.amount,
      accountName: lead.company,
      createdAt: new Date().toISOString(),
    };
    return simulateApiCall(newOpportunity, 500, 0.15);
  },
};
