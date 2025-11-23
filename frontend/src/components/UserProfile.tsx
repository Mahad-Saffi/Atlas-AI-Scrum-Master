import React from 'react';
import { Link } from 'react-router-dom';
import { type User } from '../services/auth';
import NotificationBell from './NotificationBell';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe',
      padding: 'clamp(20px, 5vw, 40px) clamp(10px, 3vw, 20px)',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      {/* Notification Bell - Top Right */}
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
        marginBottom: '60px',
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 56px)',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '12px',
          textShadow: '4px 4px 0 rgba(0,0,0,0.1)',
        }}>
          Atlas AI Scrum Master
        </h1>
        <svg width="300" height="20" style={{ margin: '0 auto', display: 'block' }}>
          <path
            d="M 10 10 Q 75 5, 150 10 T 290 10"
            stroke="#1a1a1a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* User Card */}
        <div style={{
          backgroundColor: 'white',
          border: '3px solid #1a1a1a',
          boxShadow: '8px 8px 0 #1a1a1a',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Corner decorations */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: '-3px',
            width: '30px',
            height: '30px',
            border: '3px solid #1a1a1a',
            borderRight: 'none',
            borderBottom: 'none',
            backgroundColor: '#fefefe',
          }} />
          <div style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '30px',
            height: '30px',
            border: '3px solid #1a1a1a',
            borderLeft: 'none',
            borderBottom: 'none',
            backgroundColor: '#fefefe',
          }} />
          
          <img 
            src={user.avatar_url} 
            alt="User Avatar" 
            style={{ 
              width: '120px', 
              height: '120px', 
              border: '3px solid #1a1a1a',
              boxShadow: '5px 5px 0 #1a1a1a',
              margin: '0 auto 24px',
              display: 'block',
            }} 
          />
          <h2 style={{ 
            fontSize: '32px', 
            margin: '0 0 12px',
            color: '#1a1a1a',
            fontWeight: 'bold',
          }}>
            👋 Welcome, {user.username}!
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#4a4a4a', 
            margin: '0 0 32px',
          }}>
            {user.email}
          </p>

          {/* Sign Out Button */}
          <button 
            onClick={onSignOut} 
            style={{
              backgroundColor: 'white',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              padding: '10px 24px',
              fontSize: '14px',
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
            🚪 Sign Out
          </button>
        </div>

        {/* Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(20px, 4vw, 30px)',
        }}>
          {/* Create Project Card */}
          <Link 
            to="/create-project" 
            style={{
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '40px 30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #1a1a1a';
            }}
            >
              <div style={{
                fontSize: '64px',
                marginBottom: '20px',
              }}>
                ✨
              </div>
              <h3 style={{
                fontSize: '24px',
                color: '#1a1a1a',
                marginBottom: '12px',
                fontWeight: 'bold',
              }}>
                Create New Project
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#4a4a4a',
                lineHeight: '1.6',
                margin: 0,
              }}>
                Start a conversation with AI to build your project plan from scratch
              </p>
            </div>
          </Link>

          {/* Task Board Card */}
          <Link 
            to="/task-board" 
            style={{
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '40px 30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #1a1a1a';
            }}
            >
              <div style={{
                fontSize: '64px',
                marginBottom: '20px',
              }}>
                📋
              </div>
              <h3 style={{
                fontSize: '24px',
                color: '#1a1a1a',
                marginBottom: '12px',
                fontWeight: 'bold',
              }}>
                View Task Board
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#4a4a4a',
                lineHeight: '1.6',
                margin: 0,
              }}>
                See all your tasks, track progress, and complete work items
              </p>
            </div>
          </Link>

          {/* Team Chat Card */}
          <Link 
            to="/chat" 
            style={{
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '40px 30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #1a1a1a';
            }}
            >
              <div style={{
                fontSize: '64px',
                marginBottom: '20px',
              }}>
                💬
              </div>
              <h3 style={{
                fontSize: '24px',
                color: '#1a1a1a',
                marginBottom: '12px',
                fontWeight: 'bold',
              }}>
                Team Chat
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#4a4a4a',
                lineHeight: '1.6',
                margin: 0,
              }}>
                Chat with your team in real-time and see who's online
              </p>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f5f5f5',
          border: '2px dashed #1a1a1a',
        }}>
          <h3 style={{
            fontSize: '20px',
            color: '#1a1a1a',
            marginBottom: '12px',
            fontWeight: 'bold',
          }}>
            💡 Getting Started
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#4a4a4a',
            lineHeight: '1.8',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            New here? Start by creating a project! Tell our AI about your ideas, 
            and we'll help you build a complete project plan with epics, stories, and tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
