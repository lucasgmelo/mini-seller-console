import type { Lead, Opportunity } from '../types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp',
    email: 'john.smith@techcorp.com',
    source: 'Website',
    score: 85,
    status: 'new',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'InnovaTech',
    email: 'sarah@innovatech.com',
    source: 'LinkedIn',
    score: 92,
    status: 'contacted',
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Digital Solutions',
    email: 'michael.brown@digitalsol.com',
    source: 'Referral',
    score: 78,
    status: 'qualified',
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'StartupX',
    email: 'emily@startupx.com',
    source: 'Cold Call',
    score: 65,
    status: 'new',
  },
  {
    id: '5',
    name: 'David Wilson',
    company: 'Enterprise Inc',
    email: 'david.wilson@enterprise.com',
    source: 'Event',
    score: 88,
    status: 'contacted',
  },
  {
    id: '6',
    name: 'Lisa Garcia',
    company: 'MegaCorp',
    email: 'lisa.garcia@megacorp.com',
    source: 'Website',
    score: 95,
    status: 'qualified',
  },
  {
    id: '7',
    name: 'James Miller',
    company: 'SmallBiz',
    email: 'james@smallbiz.com',
    source: 'Social Media',
    score: 72,
    status: 'unqualified',
  },
  {
    id: '8',
    name: 'Jennifer Taylor',
    company: 'FastGrow',
    email: 'jennifer@fastgrow.com',
    source: 'Partner',
    score: 80,
    status: 'new',
  },
  {
    id: '9',
    name: 'Robert Anderson',
    company: 'GlobalTech',
    email: 'robert.anderson@globaltech.com',
    source: 'Advertisement',
    score: 87,
    status: 'contacted',
  },
  {
    id: '10',
    name: 'Amanda White',
    company: 'FutureCorp',
    email: 'amanda@futurecorp.com',
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
