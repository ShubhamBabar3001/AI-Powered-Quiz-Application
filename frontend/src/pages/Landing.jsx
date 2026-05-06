import React from 'react';
import { motion } from 'framer-motion'; // Note: changed from 'motion/react' to standard 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { Trophy, Brain, Zap, Users, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, title: 'AI-Powered Quizzes', desc: 'Generate custom quizzes on any topic using advanced AI.' },
    { icon: Zap, title: 'Real-time Contests', desc: 'Compete with thousands of users in live skill-based contests.' },
    { icon: Users, title: 'Global Leaderboard', desc: 'Track your progress and climb the global rankings.' },
    { icon: Trophy, title: 'Earn Rewards', desc: 'Win prizes and earn badges for your achievements.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl px-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Master Any Skill Through <br /> 3D Interactive Quizzes
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 mb-10"
        >
          The ultimate platform for competitive learning. Join live contests, 
          generate AI-powered challenges, and track your progress in real-time.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button onClick={() => navigate('/signup')} size="lg" className="group">
            Get Started Free
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button onClick={() => navigate('/login')} variant="glass" size="lg">
            View Contests
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 px-4 max-w-7xl">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-6">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Stats Section */}
      <section className="mt-32 w-full py-20 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Users', value: '50K+' },
            { label: 'Quizzes Taken', value: '1.2M+' },
            { label: 'Live Contests', value: '500+' },
            { label: 'AI Quizzes', value: '100K+' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}