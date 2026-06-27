import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/UI/Toast';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import NotFound from './pages/NotFound';
import OAuthCallback from './pages/OAuthCallback';

// Redirect authenticated users away from public pages
function AuthRedirect({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — public */}
      <Route path="/landing" element={<Landing />} />

      {/* Auth routes — redirect to dashboard if already logged in */}
      <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
      <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

      {/* OAuth callback — receives token from server redirect */}
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/board/:id" element={<BoardView />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
