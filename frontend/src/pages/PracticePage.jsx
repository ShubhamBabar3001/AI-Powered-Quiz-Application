import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle2, 
  HelpCircle, 
  Info,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useQuizStore } from '../store/useStore';
import { Button, Card, cn, Skeleton } from '../components/ui';

export default function PracticePage() {
  const navigate = useNavigate();
  const { currentQuiz } = useQuizStore();
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentQuiz) {
      navigate('/quizzes');
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentQuiz, navigate]);

  if (!currentQuiz) return null;

  const toggleAnswer = (questionId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {isLoading ? (
          <div className="space-y-4 w-full">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/quizzes')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Library
            </button>
            <h1 className="text-3xl font-bold tracking-tight">{currentQuiz.title}</h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-0.5 rounded-md bg-indigo-600/20 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
                {currentQuiz.category}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{currentQuiz.questions.length} Questions</span>
            </div>
          </div>
        )}
        {!isLoading && (
          <Button onClick={() => navigate(`/quiz/${currentQuiz.id}`)} className="bg-indigo-600 hover:bg-indigo-700">
            Take Timed Quiz <ArrowRight size={18} className="ml-2" />
          </Button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-12">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-6 flex-1">
                  <Skeleton className="h-12 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          currentQuiz.questions.map((question, index) => (
            <div key={question.id} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-bold text-indigo-400">
                  {index + 1}
                </div>
                <div className="space-y-6 flex-1">
                  <h3 className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
                    {question.text}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, optIdx) => (
                      <div 
                        key={optIdx}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border transition-all",
                          revealedAnswers[question.id] && (
                            Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer.includes(optIdx)
                              : question.correctAnswer === optIdx
                          )
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : "bg-white/5 border-white/10 text-slate-400"
                        )}
                      >
                        <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm md:text-base">{option}</span>
                        {revealedAnswers[question.id] && (
                          Array.isArray(question.correctAnswer) 
                            ? question.correctAnswer.includes(optIdx)
                            : question.correctAnswer === optIdx
                        ) && (
                          <CheckCircle2 size={16} className="ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button 
                      variant="glass" 
                      size="sm" 
                      onClick={() => toggleAnswer(question.id)}
                      className={cn(
                        "text-xs uppercase tracking-widest font-bold",
                        revealedAnswers[question.id] ? "bg-indigo-600/20 border-indigo-600/50 text-indigo-400" : ""
                      )}
                    >
                      {revealedAnswers[question.id] ? 'Hide Answer' : 'View Answer'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300">
                      <HelpCircle size={16} className="mr-2" /> Discuss
                    </Button>
                  </div>

                  <AnimatePresence>
                    {revealedAnswers[question.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-6 rounded-2xl bg-indigo-600/5 border border-indigo-600/20 space-y-4">
                          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                            <Info size={14} />
                            Explanation
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {question.explanation || 'No detailed explanation available for this question.'}
                          </p>
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-500">
                              Correct Answer: <span className="text-green-400 font-bold">
                                {Array.isArray(question.correctAnswer) 
                                  ? question.correctAnswer.map(i => String.fromCharCode(65 + i)).join(', ')
                                  : String.fromCharCode(65 + question.correctAnswer)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {index < currentQuiz.questions.length - 1 && (
                <div className="h-px w-full bg-white/5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <Card className="p-8 text-center space-y-6 bg-indigo-600/5 border-indigo-600/20">
        <div className="h-16 w-16 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto text-indigo-400">
          <BookOpen size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Ready to test your knowledge?</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Switch to the timed quiz mode to see how you perform under pressure and earn points for your rank.
          </p>
        </div>
        <Button onClick={() => navigate(`/quiz/${currentQuiz.id}`)} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
          Start Timed Quiz
        </Button>
      </Card>
    </div>
  );
}