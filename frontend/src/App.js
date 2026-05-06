import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Scene from './components/3d/Scene';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ContestsPage from './pages/ContestsPage';
import AIQuizPage from './pages/AIQuizPage';
import ProfilePage from './pages/ProfilePage';
import QuizzesPage from './pages/QuizzesPage';
import { useAuthStore } from './store/useStore';
import { useVerify } from './hook/useVerify';

// Protected route – only for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route – if authenticated, redirect to dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const { isLoading } = useVerify();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading your session...</div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster {...toasterConfig} />
      <Scene />
      <Layout>
        <Routes>
          {/* Public Routes – redirect to dashboard if already logged in */}
          <Route path="/" element={
            <PublicRoute><Landing /></PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute><Signup /></PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/technical-quizzes" element={
            <ProtectedRoute><QuizzesPage type="technical" /></ProtectedRoute>
          } />
          <Route path="/aptitude-quizzes" element={
            <ProtectedRoute><QuizzesPage type="aptitude" /></ProtectedRoute>
          } />
          <Route path="/quiz/:id" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />
          <Route path="/ai-quiz" element={
            <ProtectedRoute><AIQuizPage /></ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute><ResultPage /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute><HistoryPage /></ProtectedRoute>
          } />
          <Route path="/contests" element={
            <ProtectedRoute><ContestsPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const toasterConfig = {
  position: "top-center",
  toastOptions: {
    duration: 3000,
    style: {
      borderRadius: '12px',
      background: '#1e293b',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
  },
};