import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./pages/SignIn";
import SimpleLogin from "./pages/SimpleLogin";
import AuthCallback from "./pages/AuthCallback";
import ProjectCreation from "./pages/ProjectCreation";
import TaskBoardPage from "./pages/TaskBoardPage";
import ProjectDashboard from "./pages/ProjectDashboard";
import ChatPage from "./pages/ChatPage";
import DebugAuth from "./pages/DebugAuth";
import "./App.css";
import { authService, type User } from "./services/auth";
import UserProfile from "./components/UserProfile";
import ErrorBoundary from "./components/ErrorBoundary";

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
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/github-login" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/debug-auth" element={<DebugAuth />} />
          <Route
            path="/create-project"
            element={isAuthenticated ? <ProjectCreation /> : <SimpleLogin />}
          />
          <Route
            path="/task-board"
            element={isAuthenticated ? <TaskBoardPage /> : <SimpleLogin />}
          />
          <Route
            path="/project/:projectId"
            element={isAuthenticated ? <ProjectDashboard /> : <SimpleLogin />}
          />
          <Route
            path="/chat"
            element={isAuthenticated ? <ChatPage /> : <SimpleLogin />}
          />
          <Route
            path="/"
            element={
              isAuthenticated && user ? (
                <UserProfile user={user} onSignOut={handleSignOut} />
              ) : (
                <SimpleLogin />
              )
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
