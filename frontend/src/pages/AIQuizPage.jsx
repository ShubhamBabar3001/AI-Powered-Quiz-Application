import React from 'react';
// import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';
import { Button, Card, Input, Skeleton } from '../components/ui';
import { genarateQuestions } from '../services/geminiService';
import { useTestStore } from '../store/useStore';

export default function AIQuizPage() {
  const navigate = useNavigate();
  const { 
     setCurrentQuiz 
   } = useTestStore();
 
  const [topic, setTopic] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('medium');
  const [count, setCount] = React.useState(10);
  const [timeLimit, setTimeLimit] = React.useState(10); // Default 10 minutes
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // React.useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 800);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      setIsLoading(true);
      const quiz = await genarateQuestions(topic, difficulty, count, timeLimit);
      setCurrentQuiz(quiz);
      setIsLoading(false);
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-12">
      {isLoading ? (
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-12 w-1/2" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ) : (
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-sm font-bold">
            <Sparkles size={16} />
            AI Powered
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AI Quiz Generator</h1>
          <p className="text-slate-400 text-lg">Generate a custom quiz on any topic in seconds.</p>
        </div>
      )}

      {isLoading ? (
        <Card className="p-8 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
              </div>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-12 w-24 rounded-lg" />
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-12 w-24 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
        </Card>
      ) : (
        <Card className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-400">What do you want to learn about?</label>
            <div className="relative">
              <Brain className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <Input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quantum Physics, React Hooks, World War II..."
                className="pl-12 text-lg"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Difficulty Level</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold capitalize transition-all ${
                      difficulty === d 
                        ? 'border-indigo-600 bg-indigo-600/10 text-white' 
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Number of Questions</label>
              <Input 
                type="number"
                min={5}
                max={100}
                value={count}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setCount(val);
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 5) setCount(5);
                  else if (val > 100) setCount(100);
                }}
                className="w-24 text-center font-bold h-12 text-lg"
              />
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Time Limit (Minutes)</label>
              <Input 
                type="number"
                min={1}
                max={60}
                value={timeLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setTimeLimit(val);
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) setTimeLimit(1);
                  else if (val > 60) setTimeLimit(60);
                }}
                className="w-24 text-center font-bold h-12 text-lg"
              />
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            className="w-full py-6 text-xl" 
            isLoading={isGenerating}
          >
            {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
            {!isGenerating && <ArrowRight className="ml-2" />}
          </Button>
        </Card>
      )}

      {/* Recommended Topics */}
      <div className="mt-12 space-y-4">
        <h3 className="text-lg font-bold">Popular Topics</h3>
        <div className="flex flex-wrap gap-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full" />
            ))
          ) : (
            ['JavaScript ES6', 'Modern History', 'Space Exploration', 'Psychology', 'Web Security'].map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-slate-300"
              >
                {t}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}