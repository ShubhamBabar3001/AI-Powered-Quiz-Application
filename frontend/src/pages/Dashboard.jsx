import React from 'react';
// import { motion } from 'framer-motion'; // Assuming 'motion/react' refers to framer-motion
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuthStore } from '../store/useStore';
import { Button, Card, Skeleton } from '../components/ui';
import { useHistory } from '../hook/useHistory';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, contests } = useAuthStore();  
  const { data: history = [], isLoading } = useHistory();

  // Calculate average score
  const avgScore = history.length > 0
    ? Math.round((history.reduce((acc, curr) => acc + curr.score, 0) / (history.length * 100)) * 100)
    : 0;

  const stats = [
    { label: 'Total Score', value: user?.totalScore || 0, icon: Trophy, color: 'text-yellow-400' },
    { label: 'Quizzes', value: history?.length || 0, icon: Target, color: 'text-indigo-400' },
    { label: 'Avg. Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Streak', value: `${user?.streak || 0} Days`, icon: Zap, color: 'text-orange-400' },
  ];

  const upcomingContests = contests
    .filter(c => c.status !== 'completed')
    .slice(0, 3)
    .map(c => ({
      id: c.id,
      title: c.title,
      prize: c.prizePool,
      time: c.deadline,
      participants: c.participants
    }));

  // Prepare chart data from history
  const chartData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toISOString().split('T')[0],
        score: 0
      };
    });

    history.forEach(attempt => {
      // 1. Check if attempt.date exists
      if (!attempt.date) return;

      const dateObj = new Date(attempt.date);

      // 2. Check if the date is actually valid before calling toISOString
      if (isNaN(dateObj.getTime())) return;

      const attemptDate = dateObj.toISOString().split('T')[0];
      const day = last7Days.find(d => d.date === attemptDate);
      if (day) {
        day.score += attempt.score;
      }
    });

    return last7Days;
  }, [history]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400">Ready to test your knowledge today?</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/ai-quiz')} variant="secondary" className="group">
            <Sparkles className="mr-2 group-hover:animate-pulse" size={18} />
            AI Quiz Generator
          </Button>
          <Button onClick={() => navigate('/contests')}>
            Join Contest
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </Card>
          ))
        ) : (
          stats.map((stat, i) => (
            <Card key={i} className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Performance Analytics</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full rounded-xl" />
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Upcoming Contests */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Upcoming Contests</h3>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {upcomingContests.map((contest) => (
                  <div key={contest.id} className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold group-hover:text-indigo-400 transition-colors">{contest.title}</h4>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{contest.prize}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {contest.time}</span>
                      <span className="flex items-center gap-1"><Target size={12} /> {contest.participants >= 1000 ? `${(contest.participants / 1000).toFixed(1)}K` : contest.participants} Joined</span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm" onClick={() => navigate('/contests')}>
                  View All Contests <ArrowRight size={14} className="ml-2" />
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-6 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </Card>
            ))
          ) : (
            <>
              {history.length > 0 ? (
                history.slice(0, 3).map((attempt) => (
                  <Card key={attempt.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{attempt.quizName}</h4>
                      <p className="text-xs text-slate-400">{new Date(attempt.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-400">{attempt.score} pts</p>
                      <p className="text-xs text-slate-400">{attempt.correctAnswers}/{attempt.totalQuestions} Correct</p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-12 text-center rounded-2xl border-2 border-dashed border-white/10">
                  <p className="text-slate-400">No recent activity. Start your first quiz!</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/ai-quiz')}>
                    Start Now
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}