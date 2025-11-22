import { useState, useCallback } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems: NavItem[] = [
  {
    id: 'leads',
    label: 'Leads',
    icon: (
      <svg
        className='w-5 h-5'
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
    ),
  },
  {
    id: 'opportunities',
    label: 'Opportunities',
    icon: (
      <svg
        className='w-5 h-5'
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
    ),
  },
];

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = useCallback(
    (id: string) => {
      onViewChange(id);
      setMobileMenuOpen(false);
    },
    [onViewChange]
  );

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <header className='lg:hidden bg-surface-50 border-b border-surface-200 px-4 py-3 flex items-center justify-between flex-shrink-0'>
        <h1 className='text-lg font-semibold text-gray-900 '>Mini Seller</h1>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-md text-gray-600 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-300'
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          ) : (
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40'
          onClick={closeMobileMenu}
          aria-hidden='true'
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className='lg:hidden absolute top-14 left-0 right-0 bg-surface-50 border-b border-surface-200 shadow-lg z-50'>
          <ul className='py-2'>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-primary-100 text-primary-800 border-l-4 border-primary-400'
                      : 'text-gray-700 hover:bg-surface-100'
                  }`}
                  aria-current={currentView === item.id ? 'page' : undefined}
                >
                  {item.icon}
                  <span className='font-medium'>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex lg:flex-col lg:w-56 bg-surface-50 border-r border-surface-200 flex-shrink-0'>
        <div className='p-4 border-b border-surface-200'>
          <h1 className='text-xl font-semibold text-gray-900'>Mini Seller</h1>
        </div>
        <nav className='flex-1 py-4'>
          <ul className='space-y-1 px-2'>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-gray-700 hover:bg-surface-100'
                  }`}
                  aria-current={currentView === item.id ? 'page' : undefined}
                >
                  {item.icon}
                  <span className='font-medium'>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
