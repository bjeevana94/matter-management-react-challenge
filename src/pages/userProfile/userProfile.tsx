import { useGetUserProfile } from '@/pages/userProfile/queryKeys';
import { useState } from 'react';

const UserProfilePage = () => {
    const [localCounter, setLocalCounter] = useState(0);
    const { data: user, isLoading } = useGetUserProfile();

    if(isLoading) {
        return <div>Loading profile...</div>;
    }

    const handleClick = () => {
        setLocalCounter((prev) => prev+1);
    }

    const handleNameClick = () => {
        console.log('Name clicked:', user?.displayName);
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>User Profile</h1>
            <div>
            <p>Name: {user?.firstName ? `${user?.firstName} ${user?.lastName}` : 'Loading...'}</p>
            {/* displayName & userInitials are moved to query to help component not to worry about the data transformation */}
            <p>Display Name: {user?.displayName}</p>
            <p>Initials: {user?.initials}</p>
            <button onClick={handleClick}>Counter: {localCounter}</button>
            <button onClick={handleNameClick}>Log Name</button>
            </div>
        </div>
    );
};

export default UserProfilePage;