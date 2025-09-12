import { useOpportunities } from '../hooks/useOpportunities';
import { Badge } from './ui/Badge';

const getStageColor = (
  stage: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  switch (stage) {
    case 'prospecting':
      return 'info';
    case 'qualification':
      return 'warning';
    case 'proposal':
      return 'default';
    case 'negotiation':
      return 'warning';
    case 'closed-won':
      return 'success';
    case 'closed-lost':
      return 'danger';
    default:
      return 'default';
  }
};

const getStageLabel = (stage: string) => {
  return stage
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatCurrency = (amount?: number) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const OpportunitiesList = () => {
  const { opportunities, isLoading, error, refetch } = useOpportunities();

  if (error) {
    return (
      <div className='space-y-6'>
        <header>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
            Opportunities
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Track your sales pipeline and deals
          </p>
        </header>

        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <div className='flex items-start'>
            <svg
              className='h-6 w-6 text-red-400 mt-0.5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <div className='ml-3 flex-1'>
              <h3 className='text-sm font-medium text-red-800'>
                Failed to Load Opportunities
              </h3>
              <div className='mt-2 text-sm text-red-700'>
                <p>
                  Unable to fetch opportunities data. Please check your
                  connection and try again.
                </p>
              </div>
              <div className='mt-4'>
                <button
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className='bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='bg-white shadow rounded-lg'>
        <div className='animate-pulse'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
          </div>
          {[...Array(3)].map((_, i) => (
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

  if (opportunities.length === 0) {
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
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No opportunities yet
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Convert qualified leads to create opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
          Opportunities
        </h1>
        <p className='text-sm sm:text-base text-gray-600'>
          Track your sales pipeline and deals
        </p>
      </header>

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        {/* Mobile Cards View */}
        <div className='block sm:hidden'>
          <div className='space-y-4 p-4'>
            {opportunities.map(opportunity => (
              <div
                key={opportunity.id}
                className='border border-gray-200 rounded-lg p-4 space-y-3'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>
                      {opportunity.name}
                    </h3>
                    <p className='text-xs text-gray-500'>
                      {opportunity.accountName}
                    </p>
                  </div>
                  <Badge variant={getStageColor(opportunity.stage)}>
                    {getStageLabel(opportunity.stage)}
                  </Badge>
                </div>

                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-sm text-gray-900 font-medium'>
                      {formatCurrency(opportunity.amount)}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {new Date(opportunity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
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
            aria-label='Opportunities table'
          >
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Account
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stage
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Created
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {opportunities.map(opportunity => (
                <tr key={opportunity.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {opportunity.name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {opportunity.accountName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge variant={getStageColor(opportunity.stage)}>
                      {getStageLabel(opportunity.stage)}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(opportunity.amount)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(opportunity.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
