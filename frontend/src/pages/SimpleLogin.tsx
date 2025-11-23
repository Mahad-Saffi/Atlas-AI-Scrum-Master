import React, { useState } from 'react';

const SimpleLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, username };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store token and user data
      localStorage.setItem('jwt', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/demo-login', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Demo login failed');
      }

      // Store token and user data
      localStorage.setItem('jwt', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '12px',
            textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
          }}>
            Atlas AI
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#4a4a4a',
          }}>
            Scrum Master
          </p>
        </div>

        {/* Login/Register Form */}
        <div style={{
          backgroundColor: 'white',
          border: '3px solid #1a1a1a',
          boxShadow: '8px 8px 0 #1a1a1a',
          padding: '40px',
        }}>
          <h2 style={{
            fontSize: '28px',
            color: '#1a1a1a',
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
            {isLogin ? '👋 Welcome Back!' : '✨ Create Account'}
          </h2>

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: '#ffebee',
              border: '2px solid #ff4444',
              color: '#c62828',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #1a1a1a',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    boxShadow: '2px 2px 0 #1a1a1a',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1a1a1a',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #1a1a1a',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  boxShadow: '2px 2px 0 #1a1a1a',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1a1a1a',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #1a1a1a',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  boxShadow: '2px 2px 0 #1a1a1a',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                border: '3px solid #1a1a1a',
                backgroundColor: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '4px 4px 0 #1a1a1a',
                fontFamily: 'inherit',
                marginBottom: '16px',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '⏳ Please wait...' : isLogin ? '🚀 Sign In' : '✨ Create Account'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4a4a4a',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'inherit',
              }}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>

          <div style={{
            borderTop: '2px dashed #1a1a1a',
            paddingTop: '16px',
            textAlign: 'center',
          }}>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '2px solid #1a1a1a',
                backgroundColor: '#f5f5f5',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '3px 3px 0 #1a1a1a',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
              }}
            >
              🎮 Try Demo Account
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#4a4a4a',
        }}>
          <p>💡 Demo account: demo@atlas.ai / demo123</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
