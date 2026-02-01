// Mock API - in real app this would use axios or fetch

import { Ticket, TicketFilters } from './types';

export const fetchTickets = async (params?: TicketFilters): Promise<Ticket[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Fix login bug',
      status: 'open',
      createdAt: '2024-01-15T10:00:00Z',
      description: 'Users cannot log in with their credentials',
      read: false
    },
    {
      id: '2',
      title: 'Update dashboard UI',
      status: 'in-progress',
      createdAt: '2024-01-14T14:30:00Z',
      description: 'Redesign the dashboard to match new brand guidelines',
      read: true
    },
    {
      id: '3',
      title: 'Add dark mode',
      status: 'closed',
      createdAt: '2024-01-10T09:15:00Z',
      description: 'Implement dark mode theme across the application',
      read: true
    },
    {
      id: '4',
      title: 'Optimize database queries',
      status: 'open',
      createdAt: '2024-01-12T11:20:00Z',
      description: 'Improve performance of slow database queries',
      read: false
    }
  ];
  
  let filtered = [...mockTickets];

  if (params?.search) {
    filtered = filtered.filter(ticket =>
      ticket.title.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter(ticket => ticket.status === params.status);
  }

  if (params?.sortBy === 'date') {
    filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (params?.sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
};

export const fetchTicketById = async (id: string): Promise<Ticket> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Fix login bug',
      status: 'open',
      createdAt: '2024-01-15T10:00:00Z',
      description: 'Users cannot log in with their credentials. This is a critical issue affecting multiple users.',
      read: false
    },
    {
      id: '2',
      title: 'Update dashboard UI',
      status: 'in-progress',
      createdAt: '2024-01-14T14:30:00Z',
      description: 'Redesign the dashboard to match new brand guidelines. Include new color scheme and typography.',
      read: false
    },
    {
      id: '3',
      title: 'Add dark mode',
      status: 'closed',
      createdAt: '2024-01-10T09:15:00Z',
      description: 'Implement dark mode theme across the application. Ensure all components support both themes.',
      read: false
    },
    {
      id: '4',
      title: 'Optimize database queries',
      status: 'open',
      createdAt: '2024-01-12T11:20:00Z',
      description: 'Improve performance of slow database queries. Add proper indexing and optimize joins.',
      read: false
    },
  ];

  const ticket = mockTickets.find(t => t.id === id);
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket;
};

export const updateTicketReadStatus = async (id: string): Promise<Ticket> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Fix login bug',
      status: 'open',
      createdAt: '2024-01-15T10:00:00Z',
      description: 'Users cannot log in with their credentials',
      read: false
    },
    {
      id: '2',
      title: 'Update dashboard UI',
      status: 'in-progress',
      createdAt: '2024-01-14T14:30:00Z',
      description: 'Redesign the dashboard to match new brand guidelines',
      read: true
    },
    {
      id: '3',
      title: 'Add dark mode',
      status: 'closed',
      createdAt: '2024-01-10T09:15:00Z',
      description: 'Implement dark mode theme across the application',
      read: true
    },
    {
      id: '4',
      title: 'Optimize database queries',
      status: 'open',
      createdAt: '2024-01-12T11:20:00Z',
      description: 'Improve performance of slow database queries',
      read: false
    }
  ];

  if(!id) {
    throw new Error("Ticket ID is required to update the status")
  }

  const findTicket = mockTickets.find(ticket => ticket.id === id);

  if(!findTicket) {
    throw new Error("Invalid Ticket ID!")
  }

  return {...findTicket, read: true};
}
