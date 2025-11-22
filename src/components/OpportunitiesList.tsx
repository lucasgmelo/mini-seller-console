import { useOpportunities } from '../hooks/useOpportunities';
import { Badge } from './ui/Badge';
import { ErrorFallback } from './ui/ErrorFallback';

const STAGE_COLORS = {
  prospecting: 'info',
  qualification: 'warning',
  proposal: 'default',
  negotiation: 'warning',
  'closed-won': 'success',
  'closed-lost': 'danger',
} as const;

const getStageColor = (
  stage: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  return STAGE_COLORS[stage as keyof typeof STAGE_COLORS] || 'default';
};

const getStageLabel = (stage: string) => {
  return stage
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatCurrency = (amount?: number) => {
  if (!amount) return '—';
  return currencyFormatter.format(amount);
};

export const OpportunitiesList = () => {
  const { opportunities, isLoading, error, refetch } = useOpportunities();

  if (error) {
    return (
      <div className='space-y-6'>
        <header>
          <h1 className='text-xl sm:text-2xl font-bold text-primary-800'>
            Opportunities
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Track your sales pipeline and deals
          </p>
        </header>

        <ErrorFallback
          title='Failed to Load Opportunities'
          description='Unable to fetch opportunities data. Please check your connection and try again.'
          onRetry={() => refetch()}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='bg-surface-50 shadow rounded-lg'>
        <div className='animate-pulse'>
          <div className='px-6 py-4 border-b border-surface-200'>
            <div className='h-4 bg-surface-200 rounded w-1/4'></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='px-6 py-4 border-b border-surface-200'>
              <div className='flex space-x-4'>
                <div className='h-4 bg-surface-200 rounded w-1/4'></div>
                <div className='h-4 bg-surface-200 rounded w-1/4'></div>
                <div className='h-4 bg-surface-200 rounded w-1/6'></div>
                <div className='h-4 bg-surface-200 rounded w-1/6'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className='bg-surface-50 shadow rounded-lg p-6'>
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

      <div className='bg-surface-50 shadow rounded-lg overflow-hidden'>
        {/* Mobile Cards View */}
        <div className='block sm:hidden'>
          <div className='space-y-4 p-4'>
            {opportunities.map(opportunity => (
              <div
                key={opportunity.id}
                className='border border-surface-300 rounded-lg p-4 space-y-3'
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
            <thead className='bg-surface-100'>
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
            <tbody className='bg-surface-50 divide-y divide-surface-200'>
              {opportunities.map(opportunity => (
                <tr key={opportunity.id} className='hover:bg-surface-100'>
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
