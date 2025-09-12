import { useState } from 'react';

import { LeadsList } from './components/LeadsList';
import { OpportunitiesList } from './components/OpportunitiesList';
import { Button } from './components/ui/Button';

function App() {
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
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <nav className='mb-6 sm:mb-8'>
          <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4'>
            <Button
              variant={currentView === 'leads' ? 'primary' : 'secondary'}
              onClick={() => handleViewChange('leads')}
              className='w-full sm:w-auto'
            >
              Leads
            </Button>
            <Button
              variant={
                currentView === 'opportunities' ? 'primary' : 'secondary'
              }
              onClick={() => handleViewChange('opportunities')}
              className='w-full sm:w-auto'
            >
              Opportunities
            </Button>
          </div>
        </nav>

        {currentView === 'leads' ? <LeadsList /> : <OpportunitiesList />}
      </div>
    </div>
  );
}

export default App;
