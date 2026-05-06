  import React, { useState, useMemo } from 'react';
  import { motion } from 'framer-motion';
  import { useNavigate } from 'react-router-dom';
  import { 
    History, 
    Search, 
    Filter, 
    // Calendar, 
    Trophy, 
    Clock, 
    ChevronRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
  } from 'lucide-react';
  import { Card, Input, Button, Skeleton } from '../components/ui';
  // import { PREDEFINED_QUIZZES } from '../data/quizzes';
  import { useHistory } from '../hook/useHistory';


  export default function HistoryPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const { data: history = [], isLoading } = useHistory();

    const handleSort = (key) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKey(key);
        setSortOrder('desc');
      }
    };

    const sortedHistory = useMemo(() => {
      const filtered = history.filter(item => {
        const title = item.quizName.toLowerCase();
        return title.includes(searchTerm.toLowerCase());
      });

      return [...filtered].sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === 'quizTitle') {
          valA = a.quizName
          valB = b.quizName;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }, [history, searchTerm, sortKey, sortOrder]);

    const SortIcon = ({ column }) => {
      if (sortKey !== column) return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
      return sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1 text-indigo-400" /> : <ArrowDown size={14} className="ml-1 text-indigo-400" />;
    };

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quiz History</h1>
            <p className="text-slate-400">Review your past performances and progress.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <Input 
                placeholder="Search quizzes..." 
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

        {isLoading ? (
          <Card className="overflow-hidden p-0 border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-12 items-center">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : sortedHistory.length > 0 ? (
          <Card className="overflow-hidden p-0 border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th 
                      className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('quizTitle')}
                    >
                      <div className="flex items-center">Quiz Name <SortIcon column="quizTitle" /></div>
                    </th>
                    <th 
                      className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors text-center"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center justify-center">Date <SortIcon column="date" /></div>
                    </th>
                    <th 
                      className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors text-center"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center justify-center">Score <SortIcon column="score" /></div>
                    </th>
                    <th 
                      className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors text-center"
                      onClick={() => handleSort('correctAnswers')}
                    >
                      <div className="flex items-center justify-center">Accuracy <SortIcon column="correctAnswers" /></div>
                    </th>
                    <th 
                      className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors text-center"
                      onClick={() => handleSort('timeSpent')}
                    >
                      <div className="flex items-center justify-center">Time <SortIcon column="timeSpent" /></div>
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedHistory.map((attempt, i) => (
                    <motion.tr
                      key={attempt.quizName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-white/10 transition-all cursor-pointer"
                      // onClick={() => navigate(`/quiz/${attempt.quizId}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 shrink-0">
                            <Trophy size={20} />
                          </div>
                          <span className="font-bold group-hover:text-indigo-400 transition-colors truncate max-w-[200px]">
                            {attempt.quizName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{new Date(attempt.date).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-500">{new Date(attempt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-indigo-400">{attempt.score}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-green-400">
                            {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                          </span>
                          <span className="text-[10px] text-slate-500">{attempt.correctAnswers}/{attempt.totalQuestions} Correct</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-slate-400">
                          <Clock size={14} />
                          {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-indigo-600 hover:text-white">
                          <ChevronRight size={18} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="p-20 text-center rounded-3xl border-2 border-dashed border-white/10">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-500">
              <History size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No History Found</h3>
            <p className="text-slate-400 mb-8">You haven't taken any quizzes yet. Start your journey today!</p>
            <Button onClick={() => navigate('/technical-quizzes')}>Start Your First Quiz</Button>
          </div>
        )}
      </div>
    );
  }