import React from 'react';
import { type User } from '../services/auth';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        textAlign: 'center',
        maxWidth: '300px',
      }}>
        <img src={user.avatar_url} alt="User Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '24px', margin: '0 0 8px' }}>Welcome, {user.username}</h1>
        <p style={{ fontSize: '16px', color: '#555', margin: '0 0 24px' }}>{user.email}</p>
        <button onClick={onSignOut} style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}>Sign Out</button>
      </div>
    </div>
  );
};

export default UserProfile;
