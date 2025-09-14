import type { Lead, Opportunity } from '../types';
import { simulateApiCall, generateId } from '../utils/dataUtils';

let cachedLeads: Lead[] = [];
let cachedOpportunities: Opportunity[] = [];

const loadLeadsFromJSON = async (): Promise<Lead[]> => {
  if (cachedLeads.length > 0) return cachedLeads;

  try {
    const response = await fetch('/leads.json');
    if (!response.ok) throw new Error('Failed to load leads');
    cachedLeads = await response.json();
    return cachedLeads;
  } catch (error) {
    console.error('Error loading leads:', error);
    throw new Error('Failed to load leads data');
  }
};

const loadOpportunitiesFromJSON = async (): Promise<Opportunity[]> => {
  if (cachedOpportunities.length > 0) return cachedOpportunities;

  try {
    const response = await fetch('/opportunities.json');
    if (!response.ok) throw new Error('Failed to load opportunities');
    cachedOpportunities = await response.json();
    return cachedOpportunities;
  } catch (error) {
    console.error('Error loading opportunities:', error);
    throw new Error('Failed to load opportunities data');
  }
};

export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const leads = await loadLeadsFromJSON();
    return simulateApiCall(leads, 500);
  },

  update: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    const leads = await loadLeadsFromJSON();
    const lead = leads.find(l => l.id === id);
    if (!lead) {
      throw new Error('Lead not found');
    }
    const updatedLead = { ...lead, ...updates };

    const index = cachedLeads.findIndex(l => l.id === id);
    if (index >= 0) {
      cachedLeads[index] = updatedLead;
    }

    return simulateApiCall(updatedLead, 300, 0.2);
  },
};

export const opportunitiesApi = {
  getAll: async (): Promise<Opportunity[]> => {
    const opportunities = await loadOpportunitiesFromJSON();
    return simulateApiCall(opportunities, 300);
  },

  create: async (
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

    cachedOpportunities.push(newOpportunity);

    return simulateApiCall(newOpportunity, 500, 0.15);
  },
};
