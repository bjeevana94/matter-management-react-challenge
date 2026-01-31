import { Ticket } from "@/pages/tickets/types";

interface TicketListProps {
  tickets: Ticket[];
  onSelect: (id: string) => void;
  selectedId: string | undefined;
}

// IMO, This component wouldn't be necessary if TicketCard is refactored to slot based approch
const TicketList = ({ tickets, onSelect, selectedId }: TicketListProps) => {
  if (tickets.length === 0) {
    return <div>No tickets found</div>;
  }

  return <div>
    {
      tickets.map(ticket => (
        <div
          key={ticket.id}
          onClick={() => onSelect(ticket.id)}
          style={{
            padding: '12px',
            marginBottom: '8px',
            border: selectedId === ticket.id ? '2px solid blue' : '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: selectedId === ticket.id ? '#e3f2fd' : 'white',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{ticket.title}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {ticket.status} • {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))
    }
  </div>;
};

export default TicketList;
