import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle,  
  RotateCcw, 
  LayoutDashboard,
  Share2
} from 'lucide-react';
import { Button, Card } from '../components/ui';

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state?.result;

  if (!attempt) {
    navigate('/dashboard');
    return null;
  }

  const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-32 w-32 rounded-full bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/50"
          >
            <Trophy size={64} className="text-white" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Quiz Completed!</h1>
          <p className="text-slate-400 text-lg">Great job! Here's how you performed.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-3xl font-bold text-indigo-400">{percentage}%</p>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Accuracy</p>
          </Card>
          <Card className="p-6">
            <p className="text-3xl font-bold text-green-400">{attempt.score}</p>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Points</p>
          </Card>
          <Card className="p-6">
            <p className="text-3xl font-bold text-orange-400">{Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s</p>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Time</p>
          </Card>
        </div>

        <Card className="p-8 text-left space-y-6">
          <h3 className="text-xl font-bold">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400" />
                <span className="font-medium">Correct Answers</span>
              </div>
              <span className="font-bold text-green-400">{attempt.correctAnswers}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-400" />
                <span className="font-medium">Incorrect Answers</span>
              </div>
              <span className="font-bold text-red-400">{attempt.totalQuestions - attempt.correctAnswers}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="glass">
            <LayoutDashboard className="mr-2" size={18} />
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate('/ai-quiz')}>
            <RotateCcw className="mr-2" size={18} />
            Try Another Quiz
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2" size={18} />
            Share Result
          </Button>
        </div>
      </motion.div>
    </div>
  );
}