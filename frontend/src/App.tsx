import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import AuthCallback from './pages/AuthCallback';
import ProjectCreation from './pages/ProjectCreation';
import TaskBoardPage from './pages/TaskBoardPage';
import DebugAuth from './pages/DebugAuth';
import './App.css';
import { authService, type User } from './services/auth';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignOut = () => {
    authService.signOut().then(() => {
      setUser(null);
      setIsAuthenticated(false);
      window.location.reload();
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/debug-auth" element={<DebugAuth />} />
        <Route path="/create-project" element={
          isAuthenticated ? <ProjectCreation /> : <SignIn />
        } />
        <Route path="/task-board" element={isAuthenticated ? <TaskBoardPage /> : <SignIn />} />
        <Route path="/" element={
          isAuthenticated && user ? (
            <UserProfile user={user} onSignOut={handleSignOut} />
          ) : (
            <SignIn />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;

