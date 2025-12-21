import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            border: '3px solid #ff4444',
            backgroundColor: 'white',
            boxShadow: '8px 8px 0 #ff4444',
            maxWidth: '500px',
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '20px',
            }}>
              😵
            </div>
            <h2 style={{
              fontSize: '28px',
              color: '#1a1a1a',
              marginBottom: '12px',
            }}>
              Oops! Something went wrong
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#4a4a4a',
              marginBottom: '24px',
            }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: 'white',
                color: '#1a1a1a',
                border: '3px solid #1a1a1a',
                padding: '12px 28px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '4px 4px 0 #1a1a1a',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
