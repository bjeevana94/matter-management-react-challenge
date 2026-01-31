# Refactoring Notes

This document outlines the refactoring changes made to modernize the React codebase and address technical debt identified in the assessment.

## Issues Identified

1. **Folder Structure**: Folder structure is less maintainable 
2. **Duplicate Type Definitions**: Multiple `Ticket` interfaces and filter types scattered across files
3. **Unnecessary React Hooks**: Premature `useMemo`/`useCallback` optimizations without performance benefits
4. **Circular Dependencies**: `useEffect` hooks creating dependency cycles
5. **Client-Side Filtering**: Duplicate filtering/sorting logic in components when API already handles it
6. **State Management**: Mixed component state, URL params, and server state without clear separation
7. **React Query Setup**: Query keys not centralized or type-safe
8. **Component Organization**: Inconsistent type usage and unnecessary prop drilling

## Solutions Implemented

### 1. Folder Structure

**Problem**: Legacy folder structure (containers, components)

**Solution**: Feature based or page based approch where files are organized based on the feature

**Changes**:
- Moved all the feature related files into one place
  - `Tickets` - Moved all the component, queries, types & api associated to tickets
  - `User Profile` - Similarly, Moved related files to userProfile folder
- Common Presentational components are still separated in the components/ folder, maintaining reusability.

**Benefits**: 
  - File-based structure enforces a predictable organization.
  - Developers can locate pages and components quickly without tracing containers.

### 2. Unified Type System

**Problem**: Multiple duplicate type definitions across files (`Ticket`, `FilterStatus`, `SortByType`)

**Solution**: Created centralized type definitions in `src/pages/tickets/types.ts`

**Changes**:
- Created `src/pages/tickets/types.ts` with unified types:
  - `FilterStatus`: `'all' | 'open' | 'in-progress' | 'closed'` - Used for UI filtering
  - `TicketStatus`: `'open' | 'in-progress' | 'closed'` - Used for ticket entity (excludes 'all')
  - `SortByType`: `'date' | 'title'` - Sort options
  - `TicketFilters`: Interface for filter parameters
  - `Ticket`: Unified ticket entity interface

**Files Modified**:
- `src/pages/api.ts` - Now imports `Ticket` and `TicketFilters` from `@/types`
- `src/pages/query.ts` - Uses `TicketFilters` from centralized types
- `src/components/StatusFilter.tsx` - Imports `FilterStatus` from types
- `src/components/SortFilter.tsx` - Imports `SortByType` from types
- `src/components/TicketList.tsx` - Uses `Ticket` from centralized types
- `src/pages/TicketsList.tsx` - Uses `FilterStatus` from types

**Benefits**:
- Single source of truth for types
- Type safety across API, queries, and components
- Easier to maintain and refactor
- Prevents type drift between files

### 3. Removed Unnecessary React Hooks

**Problem**: Premature optimizations with `useMemo` and `useCallback` that don't provide value

**Solution**: Removed unnecessary hooks and simplified component logic

**Changes in `src/pages/ticketsPage/index.tsx`**:
- ✅ Removed `useMemo` for `memoizedSearchQuery` - Simple string operation doesn't need memoization
- ✅ Removed `useMemo` for `filteredTickets` - Filtering/sorting is handled by API via `fetchTickets()`
- ✅ Removed circular `useEffect` that called `refetch()` when results were empty
- ✅ Removed `useEffect` syncing `ticketId` param to local state - Now uses URL param directly
- ✅ Removed `useState` for `selectedTicketId` - Derived from URL `ticketId` param instead

**Changes in `src/components/TicketList.tsx`**:
- ✅ Removed unused `useMemo` import
- ✅ Removed duplicate `Ticket` interface definition - Uses centralized type

**Changes in `src/components/TicketDetail.tsx`**:
- ✅ Removed render-time `console.log` - Unnecessary side effect
- ⚠️ **Note**: Still needs type improvements (currently uses `any` for `ticketDetail`)

**Benefits**:
- Cleaner, more readable code
- Reduced complexity and potential bugs
- Better performance (no unnecessary re-renders from memoization overhead)
- Follows React best practices: only optimize when profiling shows it's needed

### 4. Fixed Circular Dependencies

**Problem**: `useEffect` hooks creating circular dependencies and unnecessary refetches

**Solution**: Removed problematic effects and let React Query handle data fetching automatically

**Changes**:
- ✅ Removed `useEffect` that triggered `refetch()` when `ticketsData` was empty - React Query handles this automatically via query keys
- ✅ Removed `useEffect` syncing URL param to local state - Use URL param directly
- ✅ Removed `refetch` from query destructuring - Not needed when query keys change automatically

**Benefits**:
- No circular dependency warnings
- React Query automatically refetches when query keys change
- Simpler, more predictable data flow

### 5. Centralized Filtering/Sorting Logic

**Problem**: Duplicate filtering and sorting logic in components when API already handles it

**Solution**: Removed client-side filtering and rely on API to handle all filtering/sorting

**Changes**:
- ✅ Removed `filteredTickets` `useMemo` that re-filtered and re-sorted data
- ✅ API (`fetchTickets`) already handles:
  - Search filtering by title
  - Status filtering
  - Sorting by date or title
- ✅ Components now use `ticketsData` directly from `useGetTickets()`

**Benefits**:
- Single source of truth for filtering logic
- Better performance (no duplicate work)
- Consistent behavior across the app
- Easier to test and maintain

### 6. URL-Driven State Management

**Problem**: Mixed component state and URL params without clear separation

**Solution**: Use URL params as source of truth for shareable state (filters, sort, selected ticket)

**Changes**:
- ✅ `StatusFilter` and `SortFilter` components use `useSearchParams` to read/write URL state
- ✅ `TicketFilters` component manages URL params for `status` and `sortBy`
- ✅ Ticket selection uses URL route param (`/tickets/:ticketId`) instead of local state
- ✅ `handleTicketSelect` navigates to `/tickets/:id` preserving search params

**Files Modified**:
- `src/pages/ticketsPage/index.tsx` - Reads `status` and `sortBy` from URL params
- `src/pages/ticketsPage/filters/TicketFilters.tsx` - Manages URL params for filters
- `src/components/StatusFilter.tsx` - Uses URL params (via props)
- `src/components/SortFilter.tsx` - Uses URL params (via props)

**Benefits**:
- Shareable URLs (users can bookmark/share filtered views)
- Browser back/forward navigation works correctly
- Clear separation: URL = shareable state, component state = local UI state
- Better UX with bookmarkable filter states

### 7. React Query Key Management

**Problem**: Query keys not centralized or type-safe

**Solution**: Implemented centralized query key factory pattern

**Changes in `src/query/ticket.query.ts`**:
- ✅ Created `queryKeys` factory with hierarchical structure:
  ```typescript
  queryKeys = {
    tickets: {
      all: ['tickets'] as const,
      lists: () => [...queryKeys.tickets.all, 'list'] as const,
      list: (filters?: TicketFilters) => [...queryKeys.tickets.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.tickets.all, 'detail', id] as const,
    }
  }
  ```
- ✅ All query hooks use centralized keys
- ✅ Query keys include filters for proper cache invalidation

**Benefits**:
- Type-safe query keys
- Centralized management - easy to update keys across the app
- Proper cache invalidation when filters change
- Follows React Query best practices

### 8. Component Improvements

**StatusFilter Component** (`src/components/StatusFilter.tsx`):
- ✅ Uses unified `FilterStatus` type
- ✅ Added missing "In Progress" option
- ✅ Clean props interface

**SortFilter Component** (`src/components/SortFilter.tsx`):
- ✅ Uses unified `SortByType` type
- ✅ Clean props interface

**TicketList Component** (`src/components/TicketList.tsx`):
- ✅ Uses unified `Ticket` type
- ✅ Removed unnecessary `useMemo`
- ✅ Pure presentational component

**TicketFilters Component** (`src/pages/ticketsPage/filters/TicketFilters.tsx`):
- ✅ Removed Redux usage (Redux not installed)
- ✅ Uses `useSearchParams` for URL-driven state
- ✅ Composes `StatusFilter` and `SortFilter` components

## Trade-offs Considered

### 1. URL Params vs Component State
- **Chosen**: URL params for filters/sort/selected ticket
- **Trade-off**: More complex URL management but provides better UX with shareable/bookmarkable states
- **Alternative**: Component state would be simpler but loses shareability

### 2. Client-Side vs Server-Side Filtering
- **Chosen**: Server-side (API) filtering
- **Trade-off**: Requires API to handle all filtering logic, but provides single source of truth
- **Alternative**: Client-side filtering would be faster for small datasets but duplicates logic

## What Would Be Done Differently with More Time
1. **Add Error Boundaries**:
   - Implement error boundaries for better error handling
   - Add loading states and error states consistently

2. **Refactor components/TicketList to use TicketCard**:
   - Implement slot-based approch in TicketCard component
   - Easy to maintain & onboard

3. **Add Liniting & Git hooks**
    - Add Prettier for consistent formatting across the codebase
    - Align ESLint + Prettier to avoid rule conflicts
    - Configure Husky with pre-commit and/or pre-push hooks

3. **Performance Optimization**:
   - Profile the app to identify actual performance bottlenecks
   - Add memoization only where profiling shows it's needed
   - Consider virtualization for large ticket lists

4. **Accessibility**:
   - Add proper ARIA labels to filter components
   - Ensure keyboard navigation works correctly

## Summary

The refactoring successfully:
- ✅ Unified type system across API, queries, and components
- ✅ Removed unnecessary React hooks and circular dependencies
- ✅ Centralized filtering/sorting logic in API
- ✅ Implemented URL-driven state management for shareable state
- ✅ Set up centralized React Query key management
- ✅ Improved component organization and type safety

The codebase is now more maintainable, follows modern React patterns, and is easier to understand for new developers.
