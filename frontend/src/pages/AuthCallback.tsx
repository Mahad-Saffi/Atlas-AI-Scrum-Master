import React, { useEffect } from 'react';

const AuthCallback: React.FC = () => {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      localStorage.setItem('jwt', token);
      localStorage.setItem('user', user);
    }

    window.location.href = '/';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '3px solid #1a1a1a',
        backgroundColor: 'white',
        boxShadow: '8px 8px 0 #1a1a1a',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'spin 2s linear infinite',
        }}>
          ⏳
        </div>
        <h2 style={{
          fontSize: '24px',
          color: '#1a1a1a',
          margin: 0,
        }}>
          Signing you in...
        </h2>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthCallback;
