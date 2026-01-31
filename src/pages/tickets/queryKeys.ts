import { fetchTicketById, fetchTickets } from '@/pages/tickets/api';
import { TicketFilters } from './types';
import { useQuery } from '@tanstack/react-query';

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
