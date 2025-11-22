import { useState, useCallback } from 'react';

import { LeadsList } from './components/LeadsList';
import { OpportunitiesList } from './components/OpportunitiesList';
import { ToastContainer } from './components/ui/Toast';
import { Sidebar } from './components/ui/Sidebar';
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

  const handleViewChange = useCallback((view: string) => {
    setCurrentView(view as 'leads' | 'opportunities');
    localStorage.setItem('mini-seller-console-view', view);
  }, []);

  return (
    <div className='h-screen flex flex-col lg:flex-row bg-surface-100'>
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      <main className='flex-1 min-h-0 flex flex-col overflow-hidden'>
        <div className='flex-1 min-h-0 p-4 sm:p-6 lg:p-8'>
          {currentView === 'leads' ? <LeadsList /> : <OpportunitiesList />}
        </div>
      </main>

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
