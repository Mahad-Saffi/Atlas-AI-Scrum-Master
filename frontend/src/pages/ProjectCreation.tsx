import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';

const ProjectCreation: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header with hand-drawn style */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        maxWidth: '800px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '16px',
          fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
          textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
        }}>
          ✨ Create Your Project
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#4a4a4a',
          fontFamily: '"Segoe Print", cursive',
          lineHeight: '1.6',
        }}>
          Tell me about your project, and I'll help you build a complete plan!
        </p>
        
        {/* Decorative hand-drawn line */}
        <svg width="200" height="20" style={{ margin: '20px auto', display: 'block' }}>
          <path
            d="M 10 10 Q 50 5, 100 10 T 190 10"
            stroke="#1a1a1a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Chat Interface Container */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        height: '600px',
        border: '3px solid #1a1a1a',
        backgroundColor: 'white',
        boxShadow: '8px 8px 0 #1a1a1a',
        padding: '20px',
        position: 'relative',
      }}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          width: '20px',
          height: '20px',
          border: '3px solid #1a1a1a',
          borderRight: 'none',
          borderBottom: 'none',
          backgroundColor: '#fefefe',
        }} />
        <div style={{
          position: 'absolute',
          top: '-3px',
          right: '-3px',
          width: '20px',
          height: '20px',
          border: '3px solid #1a1a1a',
          borderLeft: 'none',
          borderBottom: 'none',
          backgroundColor: '#fefefe',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-3px',
          left: '-3px',
          width: '20px',
          height: '20px',
          border: '3px solid #1a1a1a',
          borderRight: 'none',
          borderTop: 'none',
          backgroundColor: '#fefefe',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-3px',
          right: '-3px',
          width: '20px',
          height: '20px',
          border: '3px solid #1a1a1a',
          borderLeft: 'none',
          borderTop: 'none',
          backgroundColor: '#fefefe',
        }} />
        
        <ChatInterface />
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        color: '#4a4a4a',
        fontSize: '14px',
        fontFamily: '"Segoe Print", cursive',
      }}>
        <p>💡 Tip: Be as detailed as you like - I'll ask questions if I need more info!</p>
      </div>
    </div>
  );
};

export default ProjectCreation;
