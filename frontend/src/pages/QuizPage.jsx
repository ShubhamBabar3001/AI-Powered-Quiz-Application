import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, Flag, CheckCircle2, Timer, X, Maximize2, Minimize2
} from 'lucide-react';
import { useTestStore, useAuthStore,useQuizStore } from '../store/useStore';
import { Button, Card, Skeleton, cn } from '../components/ui';
import { useQuestions } from '../hook/useQuizzes';
import { submitQuiz } from '../services/quizService';
import { useQueryClient } from '@tanstack/react-query';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    currentQuiz,
    selectedAnswers,
    setSelectedAnswers,
    timeLeft,
    setTimeLeft,
    clearQuizSession,
  } = useTestStore();

  const {addAttempt} = useQuizStore();
  const { updateUserStats } = useAuthStore();
  const queryClient = useQueryClient();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timerRef = useRef(null);

  const { data: questions = [], isLoading } = useQuestions(currentQuiz?.id);

  // Start / resume countdown only after questions load
  useEffect(() => {
    if (!currentQuiz) {
      navigate('/dashboard');
      return;
    }
    if (isLoading || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(
        // read latest from store each tick
        useTestStore.getState().timeLeft - 1
      );
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questions, isLoading,currentQuiz,setTimeLeft,navigate]);

  const handleSubmit = async () => {
    if (!currentQuiz || isSubmitting) return;
    setIsSubmitting(true);
    console.log(timeLeft);
    const result = await submitQuiz(currentQuiz.id, selectedAnswers,timeLeft);
    addAttempt(result);
    updateUserStats(result);
    clearQuizSession(); // wipe persisted session

    if (document.fullscreenElement) document.exitFullscreen();
    queryClient.invalidateQueries(['history']);
    
  };

  // Trigger auto-submit when time runs out
  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 0 && !isSubmitting) {
      clearInterval(timerRef.current);
      handleSubmit();
    }
  }, [timeLeft,handleSubmit,isSubmitting]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Always store answers as array
  const handleOptionSelect = (questionId, option, type) => {
    const current = selectedAnswers[questionId] || [];

    let next;
    if (type === 'SINGLE') {
      // Toggle off if same option tapped again, otherwise replace
      next = current.includes(option) ? [] : [option];
    } else {
      next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
    }

    setSelectedAnswers({ ...selectedAnswers, [questionId]: next });
  };

  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-12 w-24" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!currentQuiz) return null;

  const currentQuestion = questions[currentQuestionIndex];
  // const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const displayTime = timeLeft ?? currentQuiz.timeLimit * 60;

  const formatTime = (seconds) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSelected = (option) => {
    const sel = selectedAnswers[currentQuestion?.id] || [];
    return sel.includes(option);
  };

  return (
    <div className={cn(
      "max-w-8xl mx-auto space-y-6 transition-all duration-500 ",
      isFullScreen && "fixed inset-0 z-[100] bg-slate-950 p-6 md:p-12 max-w-none overflow-y-auto"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between gap-4",
        isFullScreen && "max-w-7xl mx-auto w-full mb-8 "
      )}>
        <div className="space-y-1">
          <h2 className={cn(
            "font-bold line-clamp-1",
            isFullScreen ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          )}>{currentQuiz.title}</h2>
          <p className="text-slate-400 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="glass" size="sm" onClick={toggleFullScreen} className="hidden md:flex">
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
          <Card className={cn(
            "px-3 py-1.5 md:px-6 md:py-3 flex items-center gap-2 font-mono shrink-0",
            isFullScreen ? "text-2xl md:text-3xl" : "text-lg md:text-xl",
            displayTime < 30 ? "text-red-400 animate-pulse" : "text-indigo-400"
          )}>
            <Timer size={isFullScreen ? 24 : 18} />
            {formatTime(displayTime)}
          </Card>
          {isFullScreen && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-red-400">
              <X size={24} />
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {/* <div className={cn(
        "h-2 w-full bg-white/5 rounded-full overflow-hidden",
        isFullScreen && "max-w-7xl mx-auto"
      )}>
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div> */}

      <div className={cn(
        "grid grid-cols-1 gap-8",
        isFullScreen ? "max-w-7xl mx-auto w-full lg:grid-cols-12" : "lg:grid-cols-4"
      )}>
        {/* Question Panel */}
        <div className={cn(
          "space-y-8",
          isFullScreen ? "lg:col-span-9" : "lg:col-span-3"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className={cn(
                "p-6 md:p-10 border-indigo-500/10",
                isFullScreen && "shadow-2xl shadow-indigo-500/5"
              )}>
                <div className="flex items-center gap-2 mb-8">
                  <span className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                    {currentQuestion?.type === 'SINGLE' ? 'Single Choice' : 'Multiple Choice'}
                  </span>
                </div>
                <h3 className={cn(
                  "font-medium mb-10 leading-relaxed",
                  isFullScreen ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                )}>
                  {currentQuestion?.text}
                </h3>
                <div className={cn(
                  "grid gap-4",
                  isFullScreen ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                  {currentQuestion?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(currentQuestion?.id, option, currentQuestion?.type)}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left group",
                        isSelected(option)
                          ? "border-indigo-600 bg-indigo-600/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "h-6 w-6 border-2 flex items-center justify-center transition-all shrink-0",
                          currentQuestion?.type === 'SINGLE' ? "rounded-full" : "rounded-lg",
                          isSelected(option) ? "bg-indigo-600 border-indigo-600" : "border-white/20 group-hover:border-white/40"
                        )}>
                          {isSelected(option) && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className={cn(
                          "font-medium",
                          isFullScreen ? "text-lg md:text-xl" : "text-sm md:text-base"
                        )}>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center gap-6">
            <Button
              variant="glass"
              size={isFullScreen ? "lg" : "md"}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1 md:flex-none"
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                size={isFullScreen ? "lg" : "md"}
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit Quiz <Flag className="ml-2" size={18} />
              </Button>
            ) : (
              <Button
                size={isFullScreen ? "lg" : "md"}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Next <ChevronRight className="ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Grid — 5 per row */}
        <div className={cn(
          "space-y-6",
          isFullScreen ? "lg:col-span-3" : "lg:col-span-1"
        )}>
          <Card className="p-6 h-fit hidden lg:block sticky top-8">
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-slate-400">Navigation</h4>
            <div className={cn(
              "grid gap-2",
              isFullScreen ? "grid-cols-5" : "grid-cols-5"  // ← 5 columns
            )}>
              {questions.map((q, i) => {
                const answered = (selectedAnswers[q.id] || []).length > 0;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                      currentQuestionIndex === i
                        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950"
                        : "",
                      answered
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-white/5 text-slate-500 hover:bg-white/10"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {/* <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                <div className="h-3 w-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/50" />
                Answered
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                <div className="h-3 w-3 rounded-full bg-white/5" />
                Not Answered
              </div>
            </div> */}
          </Card>
        </div>
      </div>
    </div>
  );
}