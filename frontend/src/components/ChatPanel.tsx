import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

interface OnlineUser {
  id: number;
  username: string;
  avatar_url: string;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const token = localStorage.getItem('jwt');
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/api/v1/chat/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      fetchOnlineUsers();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        setMessages(prev => [...prev, data]);
      } else if (data.type === 'presence_update') {
        fetchOnlineUsers();
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchOnlineUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:8000/api/v1/chat/online-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const users = await response.json();
      setOnlineUsers(users);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !wsRef.current || !isConnected) return;

    const messageData = {
      type: 'message',
      content: inputValue,
      channel_id: 1  // Default channel for now
    };

    wsRef.current.send(JSON.stringify(messageData));
    setInputValue('');
  };

  return (
    <div style={{
      display: 'flex',
      height: '600px',
      border: '3px solid #1a1a1a',
      backgroundColor: 'white',
      boxShadow: '8px 8px 0 #1a1a1a',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      {/* Online Users Sidebar */}
      <div style={{
        width: '200px',
        borderRight: '2px solid #1a1a1a',
        padding: '16px',
        backgroundColor: '#f5f5f5',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#1a1a1a',
        }}>
          🟢 Online ({onlineUsers.length})
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {onlineUsers.map(user => (
            <div key={user.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              backgroundColor: 'white',
              border: '2px solid #1a1a1a',
              fontSize: '14px',
            }}>
              <img 
                src={user.avatar_url} 
                alt={user.username}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid #1a1a1a',
                }}
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Connection Status */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '2px solid #1a1a1a',
          backgroundColor: isConnected ? '#e8f5e9' : '#ffebee',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1a1a1a',
        }}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#4a4a4a',
              padding: '40px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              <div>No messages yet. Start chatting!</div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{
                padding: '12px 16px',
                border: '2px solid #1a1a1a',
                backgroundColor: 'white',
                boxShadow: '3px 3px 0 #1a1a1a',
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#4a4a4a',
                  marginBottom: '4px',
                  fontWeight: 'bold',
                }}>
                  User #{msg.sender_id}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#1a1a1a',
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '16px',
          borderTop: '2px solid #1a1a1a',
          display: 'flex',
          gap: '12px',
        }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!isConnected}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #1a1a1a',
              backgroundColor: 'white',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxShadow: '2px 2px 0 #1a1a1a',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputValue.trim()}
            style={{
              padding: '12px 24px',
              border: '2px solid #1a1a1a',
              backgroundColor: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isConnected && inputValue.trim() ? 'pointer' : 'not-allowed',
              boxShadow: '3px 3px 0 #1a1a1a',
              fontFamily: 'inherit',
              opacity: isConnected && inputValue.trim() ? 1 : 0.5,
            }}
          >
            📤 Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
