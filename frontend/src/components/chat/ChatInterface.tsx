import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { aiService } from '../../services/aiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Welcome! What project are you thinking of building today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { sender: 'user' as const, text: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const aiResponse = await aiService.discover(inputValue, token);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse.text }]);
      if (aiResponse.text === "Project created successfully!") {
        setProjectCreated(true);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1b263b',
      borderRadius: '8px',
      border: '1px solid #415a77',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ flex: '1', padding: '20px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', color: msg.sender === 'ai' ? '#778da9' : '#e0e1dd' }}>
            <strong>{msg.sender === 'ai' ? 'AI' : 'You'}:</strong> 
            {msg.sender === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
          </div>
        ))}
        {isLoading && <div style={{ color: '#778da9' }}>AI is thinking...</div>}
        {projectCreated && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}>View Project</button>
          </div>
        )}
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid #415a77', display: 'flex' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #778da9',
            backgroundColor: '#0d1b2a',
            color: '#e0e1dd',
            marginRight: '10px',
          }}
          disabled={isLoading || projectCreated}
        />
        <button onClick={handleSendMessage} style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: (isLoading || projectCreated) ? 'not-allowed' : 'pointer',
        }} disabled={isLoading || projectCreated}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
