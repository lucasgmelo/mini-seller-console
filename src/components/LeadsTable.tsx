import type { Lead, SortState } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  getStatusColor,
  getStatusLabel,
  formatScore,
  getScoreColor,
} from '../utils/statusUtils';

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  sort: SortState;
  onSort: (field: keyof Lead) => void;
  onSelectLead: (lead: Lead) => void;
}

export const LeadsTable = ({
  leads,
  loading = false,
  sort,
  onSort,
  onSelectLead,
}: LeadsTableProps) => {
  const getSortIcon = (field: keyof Lead) => {
    if (sort.field !== field) {
      return (
        <svg
          className='w-4 h-4 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
          />
        </svg>
      );
    }

    return sort.direction === 'asc' ? (
      <svg
        className='w-4 h-4 text-blue-600'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5 15l7-7 7 7'
        />
      </svg>
    ) : (
      <svg
        className='w-4 h-4 text-blue-600'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M19 9l-7 7-7-7'
        />
      </svg>
    );
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: keyof Lead;
    children: React.ReactNode;
  }) => {
    const isActive = sort.field === field;
    return (
      <button
        onClick={() => onSort(field)}
        className={`flex items-center space-x-1 text-left font-medium transition-colors focus:outline-none focus:text-blue-600 ${
          isActive ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
        }`}
        title={`Click to sort by ${children}. Current: ${
          isActive
            ? `${sort.direction === 'asc' ? 'ascending' : 'descending'} (click again to ${sort.direction === 'asc' ? 'descending' : 'remove sort'})`
            : 'no sort (click for ascending)'
        }`}
      >
        <span>{children}</span>
        {getSortIcon(field)}
      </button>
    );
  };

  if (loading) {
    return (
      <div className='bg-white shadow rounded-lg'>
        <div className='animate-pulse'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='px-6 py-4 border-b border-gray-200'>
              <div className='flex space-x-4'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                <div className='h-4 bg-gray-200 rounded w-1/6'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className='bg-white shadow rounded-lg p-6'>
        <div className='text-center'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No leads found
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white shadow rounded-lg overflow-hidden'>
      {/* Mobile Cards View */}
      <div className='block sm:hidden'>
        <div className='space-y-4 p-4'>
          {leads.map(lead => (
            <div
              key={lead.id}
              className='border border-gray-200 rounded-lg p-4 space-y-3 cursor-pointer hover:bg-gray-50'
              onClick={() => onSelectLead(lead)}
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {lead.name}
                  </h3>
                  <p className='text-xs text-gray-500'>{lead.email}</p>
                </div>
                <Badge variant={getStatusColor(lead.status)}>
                  {getStatusLabel(lead.status)}
                </Badge>
              </div>

              <div className='flex justify-between items-center text-sm'>
                <div>
                  <p className='text-gray-900 font-medium'>{lead.company}</p>
                  <p className='text-gray-500 text-xs'>{lead.source}</p>
                </div>
                <span className={`font-medium ${getScoreColor(lead.score)}`}>
                  {formatScore(lead.score)}
                </span>
              </div>

              <div className='flex justify-end'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={e => {
                    e.stopPropagation();
                    onSelectLead(lead);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className='hidden sm:block overflow-x-auto'>
        <table
          className='min-w-full divide-y divide-gray-200'
          role='table'
          aria-label='Leads table'
        >
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <SortButton field='name'>Name</SortButton>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <SortButton field='company'>Company</SortButton>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <SortButton field='source'>Source</SortButton>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <SortButton field='score'>Score</SortButton>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <SortButton field='status'>Status</SortButton>
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {leads.map(lead => (
              <tr
                key={lead.id}
                className='hover:bg-gray-50 cursor-pointer focus-within:bg-gray-50'
                onClick={() => onSelectLead(lead)}
                role='button'
                tabIndex={0}
                aria-label={`Edit ${lead.name} from ${lead.company}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectLead(lead);
                  }
                }}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      {lead.name}
                    </div>
                    <div className='text-sm text-gray-500'>{lead.email}</div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {lead.company}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {lead.source}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`text-sm font-medium ${getScoreColor(lead.score)}`}
                  >
                    {formatScore(lead.score)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <Badge variant={getStatusColor(lead.status)}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={e => {
                      e.stopPropagation();
                      onSelectLead(lead);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
