// GitHub OAuth Configuration
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";

// Auth service interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  username?: string;
}

export interface AuthService {
  signInWithGitHub(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}

class ApiAuthService implements AuthService {
  private currentUser: User | null = null;

  async signInWithGitHub(): Promise<User> {
    window.location.href = "http://localhost:8000/auth/github";
    // This will redirect, so the promise won't resolve in the current context.
    return new Promise(() => {});
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
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
    return this.getCurrentUser() !== null && !!localStorage.getItem("jwt");
  }
}

export const authService = new ApiAuthService();

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
