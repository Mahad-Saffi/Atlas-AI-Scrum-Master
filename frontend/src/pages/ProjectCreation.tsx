import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';

const ProjectCreation: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0d1b2a',
      color: '#e0e1dd',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Create a New Project</h1>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        height: '70vh',
      }}>
        <ChatInterface />
      </div>
    </div>
  );
};

export default ProjectCreation;
