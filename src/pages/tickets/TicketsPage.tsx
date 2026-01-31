/**
 * LEGACY CODE - This is intentionally messy!
 * 
 * Your task: Refactor this to follow modern patterns:
 * 1. Move to pages/ directory structure
 * 2. Remove unnecessary useMemo/useCallback
 * 3. Fix useEffect circular dependencies
 * 4. Set up proper React Query key management
 * 5. Extract shareable hooks and utilities
 */

import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import { useGetTicketById, useGetTickets } from '@/pages/tickets/queryKeys';
import { FilterStatus, SortByType } from './types';
import TicketFilters from './TicketFilters';
import useDebounce from '@/hooks/useDebounce';

const TicketsPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId?: string }>();
  const [searchVal, setSearchVal] = useState('');

  const filterStatus = (params.get('status') || 'all') as FilterStatus;
  const sortBy = (params.get('sortBy') || 'date') as SortByType;
  const debouncedSearch = useDebounce(searchVal, 500);

  const handleTicketSelect = (id: string) => {
    const search = params.toString();
    navigate(
      {
        pathname: `/tickets/${id}`,
        search: search ? `?${search}` : '',
      },
      { replace: false }
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchVal(value)
  }

  // Have removed filtering logic at the client side as API is doing it already
  const { data: ticketsData = [], isLoading } = useGetTickets({ search: debouncedSearch ? debouncedSearch.trim() : '', status: filterStatus, sortBy });

  const { data: ticketDetail } = useGetTicketById(ticketId, {
    enabled: !!ticketId,
  })

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h1>Tickets</h1>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchVal}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <TicketFilters />
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <TicketList
            tickets={ticketsData}
            onSelect={handleTicketSelect}
            selectedId={ticketId}
          />
        )}
      </div>
      <div style={{ width: '60%', padding: '20px' }}>
        {ticketId ? (
          <TicketDetail ticketId={ticketId} ticketDetail={ticketDetail} />
        ) : (
          <div>Select a ticket to view details</div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
