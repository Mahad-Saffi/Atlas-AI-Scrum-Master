import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import NotificationBell from '../components/NotificationBell';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe',
      padding: '40px 20px',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      {/* Notification Bell */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
      }}>
        <NotificationBell />
      </div>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '16px',
          textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
        }}>
          💬 Team Chat
        </h1>
        <svg width="200" height="20" style={{ margin: '0 auto', display: 'block' }}>
          <path
            d="M 10 10 Q 50 5, 100 10 T 190 10"
            stroke="#1a1a1a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Chat Panel */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <ChatPanel />
      </div>

      {/* Back Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'white',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '3px 3px 0 #1a1a1a',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(1px, 1px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
