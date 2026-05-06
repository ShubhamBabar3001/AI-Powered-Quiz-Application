import React from 'react';
import { motion } from 'framer-motion'; // Usually 'framer-motion', though 'motion/react' is used in newer versions
import {
  Trophy,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Timer,
  ShieldCheck,
  Award,
  CheckCircle
} from 'lucide-react';
import { Button, Card, Skeleton } from '../components/ui';
import { useAuthStore } from '../store/useStore';
import { useContests } from '../hook/useContests';
import { endrollInContest } from '../services/contestService';

// Helper Component: Countdown Timer
function CountdownTimer({ initialSeconds }) {
  const [seconds, setSeconds] = React.useState(initialSeconds);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-orange-400 font-mono font-bold">
      <Timer size={18} className="animate-pulse" />
      Starts in: {formatTime(seconds)}
    </div>
  );
}

export default function ContestsPage() {
  const [activeTab, setActiveTab] = React.useState('UPCOMING');
  const { enrolledContests } = useAuthStore();
  const { data: contests = [], isLoading } = useContests();
  const now = new Date();

  const filteredContests = contests.filter(c => c.status === activeTab);
  const featuredContest = contests
  .filter(c => new Date(c.deadline) > now) // only upcoming contests
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skill Contests</h1>
          <p className="text-slate-400">Compete with the best and win exciting rewards.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {['UPCOMING', 'LIVE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Contest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isLoading ? (
          <Card className="relative overflow-hidden p-0 border-indigo-500/30">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 space-y-6">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-12 w-3/4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-6">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-12 w-40 rounded-xl" />
              </div>
              <Skeleton className="h-64 lg:h-auto w-full" />
            </div>
          </Card>
        ) : (
          <Card className="relative overflow-hidden p-0 border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  <Zap size={14} className="animate-pulse" /> Featured Contest
                </div>
                <h2 className="text-4xl font-bold tracking-tight">{featuredContest?.title || 'The Ultimate Full-Stack Developer Cup'}</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {featuredContest?.description || 'Join the most prestigious contest of the month. Test your skills across the entire stack from database design to frontend performance optimization.'}
                </p>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 font-bold text-green-400">
                    <Trophy size={20} /> {featuredContest?.prizePool || '$2,500'} Prize Pool
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users size={20} /> {featuredContest?.participants ? `${(featuredContest.participants / 1000).toFixed(1)}K` : '5.8K'} Participants
                  </div>
                  {enrolledContests.includes('featured') ? (
                    <CountdownTimer initialSeconds={3600} />
                  ) : (
                    <div className="flex items-center gap-2 text-orange-400">
                      <Timer size={20} /> Ends in {new Date(featuredContest.deadline).toLocaleString() || '12:45:00'}
                    </div>
                  )}
                </div>
                {enrolledContests.includes('featured') ? (
                  <Button variant="glass" className="w-full sm:w-auto cursor-default" disabled>
                    <CheckCircle className="mr-2" size={18} /> Enrolled
                  </Button>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => endrollInContest(featuredContest.id)}>
                    Register Now <ArrowRight className="ml-2" />
                  </Button>
                )}
              </div>
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img
                  src="https://picsum.photos/seed/coding/1200/800"
                  alt="Featured"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 lg:bg-gradient-to-l" />
              </div>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-0 overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-12 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          filteredContests.map((contest, i) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group overflow-hidden p-0 hover:border-indigo-500/50 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={contest.image}
                    alt={contest.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      {contest.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 rounded-lg bg-green-500 text-slate-950 text-xs font-bold shadow-lg">
                      {contest.prizePool}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {contest.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{contest.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{contest.description}</p>

                  {enrolledContests.includes(contest.id) && (
                    <div className="pt-2">
                      <CountdownTimer initialSeconds={1800} />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Users size={14} /> {contest.participants}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(contest.deadline).toLocaleString()}</span>
                    </div>
                    {enrolledContests.includes(contest.id) ? (
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                        <CheckCircle size={14} /> Enrolled
                      </span>
                    ) : (
                      <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent hover:text-indigo-400" onClick={() => endrollInContest(contest.id)}>
                        Enroll <ArrowRight size={14} className="ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold">Fair Play Guaranteed</h4>
            <p className="text-xs text-slate-400">Anti-cheat systems in place for all contests.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold">Verified Certificates</h4>
            <p className="text-xs text-slate-400">Earn certificates for your achievements.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-bold">Instant Rewards</h4>
            <p className="text-xs text-slate-400">Prizes are distributed immediately after verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}