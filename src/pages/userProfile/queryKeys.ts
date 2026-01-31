import { fetchUserProfile } from '@/pages/userProfile/api';
import { useQuery } from '@tanstack/react-query';
import { User } from './types';

const queryKeys = {
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: () => fetchUserProfile(),
    select: (user: User) => {
        return user ? {
            ...user,
            displayName: `${user.firstName} ${user.lastName}`,
            initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
        } : {
            displayName: 'Guest',
            initials: '??',
            firstName: undefined,
            lastName: undefined,
            id: undefined,
            email: undefined
        }
    }
  });
};