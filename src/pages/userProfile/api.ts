import { User } from "./types";

export const fetchUserProfile = async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
    } 

    return mockUser;
};