import type { Lead, Opportunity } from '../types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ana Silva',
    company: 'TechCorp',
    email: 'ana.silva@techcorp.com',
    source: 'Website',
    score: 85,
    status: 'new',
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    company: 'InnovaTech',
    email: 'carlos@innovatech.com',
    source: 'LinkedIn',
    score: 92,
    status: 'contacted',
  },
  {
    id: '3',
    name: 'Maria Santos',
    company: 'Digital Solutions',
    email: 'maria.santos@digitalsol.com',
    source: 'Referral',
    score: 78,
    status: 'qualified',
  },
  {
    id: '4',
    name: 'João Pedro',
    company: 'StartupX',
    email: 'joao@startupx.com',
    source: 'Cold Call',
    score: 65,
    status: 'new',
  },
  {
    id: '5',
    name: 'Fernanda Costa',
    company: 'Enterprise Inc',
    email: 'fernanda.costa@enterprise.com',
    source: 'Event',
    score: 88,
    status: 'contacted',
  },
  {
    id: '6',
    name: 'Roberto Lima',
    company: 'MegaCorp',
    email: 'roberto.lima@megacorp.com',
    source: 'Website',
    score: 95,
    status: 'qualified',
  },
  {
    id: '7',
    name: 'Luciana Alves',
    company: 'SmallBiz',
    email: 'luciana@smallbiz.com',
    source: 'Social Media',
    score: 72,
    status: 'unqualified',
  },
  {
    id: '8',
    name: 'Diego Ferreira',
    company: 'FastGrow',
    email: 'diego@fastgrow.com',
    source: 'Partner',
    score: 80,
    status: 'new',
  },
  {
    id: '9',
    name: 'Patricia Rocha',
    company: 'GlobalTech',
    email: 'patricia.rocha@globaltech.com',
    source: 'Advertisement',
    score: 87,
    status: 'contacted',
  },
  {
    id: '10',
    name: 'Alexandre Mendes',
    company: 'FutureCorp',
    email: 'alexandre@futurecorp.com',
    source: 'Website',
    score: 91,
    status: 'qualified',
  },
  // Adding more leads to reach ~100 for testing
  ...Array.from({ length: 90 }, (_, i) => ({
    id: `${i + 11}`,
    name: `Lead ${i + 11}`,
    company: `Company ${i + 11}`,
    email: `lead${i + 11}@company${i + 11}.com`,
    source: ['Website', 'LinkedIn', 'Referral', 'Cold Call', 'Event'][i % 5],
    score: Math.floor(Math.random() * 40) + 60, // 60-100
    status: ['new', 'contacted', 'qualified', 'unqualified'][
      Math.floor(Math.random() * 4)
    ] as Lead['status'],
  })),
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    name: 'TechCorp Implementation',
    stage: 'proposal',
    amount: 50000,
    accountName: 'TechCorp',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'opp-2',
    name: 'Digital Solutions Upgrade',
    stage: 'negotiation',
    amount: 75000,
    accountName: 'Digital Solutions',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];
