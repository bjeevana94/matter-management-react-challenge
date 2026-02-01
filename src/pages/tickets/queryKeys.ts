import { fetchTicketById, fetchTickets, updateTicketReadStatus} from '@/pages/tickets/api';
import { Ticket, TicketFilters } from './types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const queryKeys = {
  tickets: {
    all: ['tickets'] as const,
    lists: () => [...queryKeys.tickets.all, 'list'] as const,
    list: (filters?: TicketFilters) => [...queryKeys.tickets.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.tickets.all, 'detail', id] as const,
  },
};

export const useGetTickets = (filters?: TicketFilters) => {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters),
    queryFn: () => fetchTickets(filters)
  });
};

export const useGetTicketById =(id: string | undefined, options?: { enabled?: boolean }) => {
  return useQuery({
      queryKey: queryKeys.tickets.detail(id as string),
      queryFn: () => fetchTicketById(id as string),
      enabled: options?.enabled || !!id,
  })
}

export const useUpdateTicketReadStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateTicketReadStatus(id),
    onSuccess: (data, ticketId) => {
      queryClient.setQueriesData(
        { queryKey: queryKeys.tickets.lists() },
        (oldData: Ticket[] | undefined) => {
          if (!oldData) return oldData;
        
          return oldData?.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, ...data }
              : ticket
          )
        }
      );
    }
  })
}