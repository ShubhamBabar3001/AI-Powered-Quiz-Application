import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Target,
  Clock,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { useTestStore } from '../store/useStore';
import { Card, Input, Button, Skeleton } from '../components/ui';
import { useQuizzes } from '../hook/useQuizzes';

export default function QuizzesPage({ type }) {
  const navigate = useNavigate();
  const { 
    setCurrentQuiz 
  } = useTestStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');


  // // Get quizzes based on type
  // const quizzes = type === 'technical' ? tech_quizzes : verbal_quizzes;

  const { data: quizzes = [], isLoading} = useQuizzes(type);

  // Extract unique categories from quizzes
  const categories = ['All', ...new Set(quizzes.map(q => q.category))];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || quiz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pageTitle = type === 'technical' ? 'Technical Quizzes' : 'Aptitude Quizzes';
  const pageDescription = type === 'technical'
    ? 'Sharpen your coding skills with our technical library.'
    : 'Improve your cognitive skills with our aptitude library.';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-slate-400">{pageDescription}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <Input
              placeholder="Search library..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="glass">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl shrink-0" />
          ))
        ) : (
          categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="group h-full flex flex-col justify-between hover:border-indigo-500/50 transition-all cursor-pointer"
                onClick={() => {
                  setCurrentQuiz(quiz);
                  navigate(`/quiz/${quiz.id}`);
                }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                      {quiz.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      quiz.difficulty === 'easy' ? 'text-green-400' :
                      quiz.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{quiz.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{quiz.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Target size={14} /> {quiz.questionsSize} Qs</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {Math.floor(quiz.timeLimit)}m</span>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Start Quiz <ChevronRight size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center rounded-3xl border-2 border-dashed border-white/10">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-500">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Quizzes Found</h3>
          <p className="text-slate-400">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}