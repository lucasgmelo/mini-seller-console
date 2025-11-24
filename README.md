# Mini Seller Console

<video src="https://github.com/user-attachments/assets/b2bd37cb-9986-4a69-92bb-ca88a44881ea" autoplay loop muted playsinline>
  Seu navegador não suporta vídeos.
</video>

A clean and efficient lead management system built to handle the sales pipeline from lead capture to opportunity conversion.

## Overview

This console provides a streamlined interface for sales teams to manage leads and track their progression through the sales funnel. The focus was on creating something practical that actually works well rather than over-engineering features nobody would use.

## What It Does

**Leads Management**
- Browse through leads loaded from JSON data
- Search by company name or contact name
- Filter by lead status (new, contacted, qualified, unqualified)
- Sort by lead score to prioritize high-value prospects

**Lead Details & Updates**
- Click any lead row to open detailed view in a slide-over panel
- Update email addresses with proper validation
- Change lead status as they progress through sales process
- All changes are saved optimistically with rollback on errors

**Opportunity Conversion**
- Convert qualified leads directly to opportunities
- Set initial sales stage and deal amount
- Track opportunities in a separate view with stage indicators
- Mobile-friendly cards and desktop table views

**Navigation**
- Sidebar navigation for desktop with persistent view selection
- Hamburger menu for mobile with smooth transitions
- View preference saved to localStorage

## Technical Choices

**React + TypeScript** for type safety and better development experience. Using Vite for fast builds and hot reloading during development.

**TanStack Query** handles all the data fetching, caching, and optimistic updates. Much cleaner than managing loading states manually.

**Tailwind CSS** for styling because it's fast to work with and keeps the bundle size reasonable. Custom color scheme with primary (#94eff1) and accent (#c3f628) colors.

**Local Storage** persistence for filters, sort preferences, and current view. Your settings stay the same when you refresh the page.

**Performance Optimizations** with `useCallback` to prevent unnecessary re-renders and maintain smooth interactions.

The error handling shows toast notifications instead of breaking the whole page - way better user experience when things go wrong.

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/             # Reusable UI elements (Button, Input, Badge, Sidebar, SlideOver, Toast)
│   ├── LeadsList.tsx   # Main leads interface
│   └── ...
├── contexts/           # React contexts (ToastContext)
├── hooks/              # Custom React hooks (useLeads, useOpportunities)
├── services/           # API calls and data fetching
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## Running Locally

```bash
npm install
npm run dev
```

The data loads from JSON files in the public folder. No backend needed - everything runs in the browser.

## Key Features Implemented

- **Search & Filtering**: Debounced search with visual feedback
- **Data Persistence**: Filters, sort preferences, and view saved locally
- **Error Recovery**: Failed operations show notifications with retry option
- **Mobile Support**: Responsive layout with hamburger menu and card views
- **Accessibility**: Proper ARIA labels, keyboard navigation, skip links
- **Performance**: useCallback optimizations, sticky table headers, contained scroll
- **Custom Theme**: Branded color palette with primary and accent colors

## Notes

The lead scores are meant to help prioritize outreach - higher scores indicate warmer prospects. The conversion flow only allows qualified leads to become opportunities, which matches typical sales processes.

Email validation follows RFC standards and catches common formatting issues. The optimistic updates make the interface feel fast while still handling network failures gracefully.

Built this to be maintainable rather than clever. The code structure should be straightforward for other developers to work with.
