import { useState } from 'react';

import { LeadsList } from './components/LeadsList';
import { OpportunitiesList } from './components/OpportunitiesList';
import { ToastContainer } from './components/ui/Toast';
import { ToastProvider, useToastContext } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent = () => {
  const { toasts, hideToast } = useToastContext();
  const [currentView, setCurrentView] = useState<'leads' | 'opportunities'>(
    () => {
      const saved = localStorage.getItem('mini-seller-console-view');
      return (saved === 'opportunities' ? 'opportunities' : 'leads') as
        | 'leads'
        | 'opportunities';
    }
  );

  const handleViewChange = (view: 'leads' | 'opportunities') => {
    setCurrentView(view);
    localStorage.setItem('mini-seller-console-view', view);
  };

  return (
    <div className='min-h-screen bg-custom-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <nav className='mb-8'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
              <button
                onClick={() => handleViewChange('leads')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'leads'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={currentView === 'leads' ? 'page' : undefined}
              >
                Leads
              </button>
              <button
                onClick={() => handleViewChange('opportunities')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'opportunities'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={
                  currentView === 'opportunities' ? 'page' : undefined
                }
              >
                Opportunities
              </button>
            </nav>
          </div>
        </nav>

        {currentView === 'leads' ? <LeadsList /> : <OpportunitiesList />}
      </div>

      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
