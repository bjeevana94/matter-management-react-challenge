import { useEffect, useMemo, useState } from 'react';
import TicketCard from '@/pages/tickets/components/TicketCard';
import { useGetTickets } from '@/pages/tickets/queryKeys';
import StatusFilter from '@/components/StatusFilter';
import { FilterStatus } from './types';

/**
 * TASK 2: This component has problematic useEffect usage
 * 
 * Issues to fix:
 * 1. Circular dependencies between useEffects
 * 2. Side effects that should use React Query callbacks
 * 3. Unnecessary useEffect for derived state
 */
const TicketList = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const { data: tickets, isLoading } = useGetTickets({
    status: filterStatus === 'all' ? undefined: filterStatus,
    // Effect 5: Show success message after refetch (should use React Query callback)
    // onSuccess callback is deprecated in react query v5. If console log is absolutely necessary, can probably use useEffect instead
  });

  // Removed notificationCount from state as i belive on every ticket click, query mutation can be called to update he read value  which will reflect here
  const notificationCount = useMemo(() => {
    return tickets?.filter((t) => !t.read).length ?? 0;
  }, [tickets])

  /* 
    As a Future improvement, every ticket click, query mutation can be called to update the read value 
    const {mutate: markTicketAsRead} = useUpdateTicketReadStatusMutation();
    call markTicketAsRead(ticketId) in handleTicketSelection()
  */

  // Effect 2: Refetch when filter changes
  // No need refetch manually, query keys should do the job

  useEffect(() => {
    if (notificationCount > 5 && !selectedTicketId && tickets?.length) {
        setSelectedTicketId(tickets[0].id);
    }
  }, [notificationCount, selectedTicketId, tickets]);

  
  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ticket List</h1>
      <div>
        <StatusFilter status={filterStatus} onChange={setFilterStatus}/>
        <p>Notifications: {notificationCount}</p>
      </div>
      <div>
        {tickets?.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isSelected={selectedTicketId === ticket.id}
            onClick={() => setSelectedTicketId(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
