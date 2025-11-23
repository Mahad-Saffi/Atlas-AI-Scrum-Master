import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...' 
}) => {
  const sizeMap = {
    small: '24px',
    medium: '48px',
    large: '64px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      <div 
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          fontSize: sizeMap[size],
          animation: 'spin 2s linear infinite',
          marginBottom: '16px',
        }}
        role="status"
        aria-label="Loading"
      >
        ⏳
      </div>
      <div style={{
        fontSize: '18px',
        color: '#4a4a4a',
        textAlign: 'center',
      }}>
        {message}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
