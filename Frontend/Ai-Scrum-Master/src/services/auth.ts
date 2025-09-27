// GitHub OAuth Configuration
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";

// Auth service interface
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  username?: string;
}

export interface AuthService {
  signInWithGitHub(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}

// Mock implementation for development
class MockAuthService implements AuthService {
  private currentUser: User | null = null;

  async signInWithGitHub(): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: "1",
      email: "developer@example.com",
      name: "Development User",
      username: "dev-user",
      picture: "https://github.com/github.png",
    };

    this.currentUser = mockUser;
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const stored = localStorage.getItem("user");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// Export singleton instance
export const authService = new MockAuthService();

// TODO: Replace with actual GitHub OAuth implementation
// Example using GitHub OAuth:
/*
class GitHubAuthService implements AuthService {
  async signInWithGitHub(): Promise<User> {
    const clientId = GITHUB_CLIENT_ID;
    const redirectUri = window.location.origin + '/auth/callback';
    const scope = 'user:email';
    
    // Redirect to GitHub OAuth
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
    
    // This would be handled in the callback
    throw new Error('Redirecting to GitHub...');
  }
  
  // ... other methods
}
*/
