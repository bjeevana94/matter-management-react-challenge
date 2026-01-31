/** Status values for filtering tickets - includes 'all' for UI filter */
export type FilterStatus = 'all' | 'open' | 'in-progress' | 'closed';

/** Status values for ticket entity (excludes 'all') */
export type TicketStatus = Exclude<FilterStatus, 'all'>;

/** Sort options for ticket lists */
export type SortByType = 'date' | 'title';

/** Parameters for fetching/filtering tickets */
export interface TicketFilters {
  search?: string;
  status?: FilterStatus;
  sortBy?: SortByType;
}

/** Ticket entity */
export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: string;
  description?: string;
  read: boolean;
}
