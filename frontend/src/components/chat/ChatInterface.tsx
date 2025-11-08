import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { aiService } from '../../services/aiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: '👋 Hey there! What project are you thinking of building today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: '😅 Oops! Something went wrong. Mind trying that again?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fefefe',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Messages Area */}
      <div style={{ 
        flex: '1', 
        padding: '20px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: '14px 18px',
              border: '2px solid #1a1a1a',
              backgroundColor: msg.sender === 'user' ? '#f5f5f5' : 'white',
              boxShadow: '4px 4px 0 #1a1a1a',
              position: 'relative',
              fontFamily: '"Segoe Print", cursive',
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#1a1a1a',
            }}>
              {/* Speech bubble tail */}
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                [msg.sender === 'user' ? 'right' : 'left']: '20px',
                width: '0',
                height: '0',
                borderLeft: msg.sender === 'user' ? '15px solid transparent' : '15px solid #1a1a1a',
                borderRight: msg.sender === 'user' ? '15px solid #1a1a1a' : '15px solid transparent',
                borderTop: '15px solid #1a1a1a',
              }} />
              
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '6px',
                fontSize: '13px',
                color: '#4a4a4a',
              }}>
                {msg.sender === 'ai' ? '🤖 Atlas AI' : '👤 You'}
              </div>
              {msg.sender === 'ai' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <div>{msg.text}</div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}>
            <div style={{
              padding: '14px 18px',
              border: '2px solid #1a1a1a',
              backgroundColor: 'white',
              boxShadow: '4px 4px 0 #1a1a1a',
              fontFamily: '"Segoe Print", cursive',
              color: '#4a4a4a',
              fontSize: '15px',
            }}>
              <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                🤔 Thinking...
              </span>
            </div>
          </div>
        )}
        
        {projectCreated && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px',
            animation: 'bounceIn 0.5s ease-out',
          }}>
            <button 
              onClick={() => window.location.href = '/task-board'}
              style={{
                backgroundColor: 'white',
                color: '#1a1a1a',
                border: '3px solid #1a1a1a',
                padding: '14px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '5px 5px 0 #1a1a1a',
                fontFamily: '"Segoe Print", cursive',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #1a1a1a';
              }}
            >
              🎉 View Your Project!
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: '20px', 
        borderTop: '2px solid #1a1a1a',
        display: 'flex',
        gap: '12px',
        backgroundColor: '#fefefe',
      }}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          style={{
            flex: '1',
            padding: '12px 16px',
            border: '2px solid #1a1a1a',
            backgroundColor: 'white',
            color: '#1a1a1a',
            fontSize: '16px',
            fontFamily: '"Segoe Print", cursive',
            boxShadow: '3px 3px 0 #4a4a4a',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '4px 4px 0 #2563eb';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '3px 3px 0 #4a4a4a';
            e.currentTarget.style.borderColor = '#1a1a1a';
          }}
          disabled={isLoading || projectCreated}
        />
        <button 
          onClick={handleSendMessage}
          style={{
            backgroundColor: 'white',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            padding: '12px 28px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: (isLoading || projectCreated) ? 'not-allowed' : 'pointer',
            boxShadow: '3px 3px 0 #1a1a1a',
            fontFamily: '"Segoe Print", cursive',
            opacity: (isLoading || projectCreated) ? 0.5 : 1,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isLoading && !projectCreated) {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
          }}
          disabled={isLoading || projectCreated}
        >
          {isLoading ? '⏳ Sending...' : '📤 Send'}
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
