import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Trophy, LogOut, Menu, X, User, Code, Brain } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui';
// Use the custom cn helper we defined earlier for your CDN setup
const cn = (...classes) => classes.filter(Boolean).join(' ');


export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Technical Quizzes', icon: Code, path: '/technical-quizzes' },
    { label: 'Aptitude Quizzes', icon: Brain, path: '/aptitude-quizzes' },
    { label: 'Contests', icon: Trophy, path: '/contests' },
    { label: 'History', icon: History, path: '/history' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  const publicPages = ['/', '/login', '/signup', '/forgot-password'];
  const isPublicPage = publicPages.includes(location.pathname);
  const isQuizPage = location.pathname.startsWith('/quiz/');

  // 1. Distraction-free layout for Quizzes
  if (isQuizPage) {
    return (
      <div className="min-h-screen text-white bg-slate-950">
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    );
  }

  // 2. Simplified layout for Public/Unauthenticated pages
  if (!isAuthenticated || isPublicPage) {
    return (
      <div className="min-h-screen text-white">
        <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">Q</div>
              QuizVerse
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button onClick={() => navigate('/dashboard')} size="sm" variant="glass">Dashboard</Button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
                  <Button onClick={() => navigate('/signup')} size="sm">Get Started</Button>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </div>
    );
  }

  // 3. Full Auth Dashboard Layout
  return (
    <div className="min-h-screen text-white flex flex-col h-screen overflow-hidden bg-slate-950">
      {/* App Navbar */}
      <nav className="h-16 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl shrink-0">
        <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">Q</div>
              QuizVerse
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-slate-400">Rank: #{user?.rank || '---'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-slate-950 pt-16 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:pt-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all hover:bg-white/10',
                      location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400'
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-400 transition-all hover:bg-red-500/10"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 custom-scrollbar">
          <div className={cn("mx-auto", (location.pathname === '/profile' || location.pathname === '/ai-quiz') ? "max-w-full" : "max-w-6xl")}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}