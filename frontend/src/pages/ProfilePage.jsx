import React, { useState } from 'react';
import { 
  Award,
  Zap,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { Button, Card, Input, Skeleton } from '../components/ui';
import toast from 'react-hot-toast';
import { changePassword } from '../services/authApi';
import { useVerify } from '../hook/useVerify';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { isLoading } = useVerify();

  const achievements = [
    { title: 'Early Adopter', icon: Zap, color: 'text-yellow-400' },
    { title: 'Quiz Master', icon: Award, color: 'text-indigo-400' },
    { title: 'Perfect Score', icon: Target, color: 'text-green-400' },
  ];

   const handlePasswordChange = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error('Please fill in both password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changePassword({ currentPassword, newPassword });
      if (result.success) {
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error) {
      toast.error(error);
      // error already toasted inside changePassword
    } finally {
      setPasswordLoading(false);
    }
  };


  return (
    <div className="w-full space-y-8">
      {isLoading ? (
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-3xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-indigo-500/50">
            {user?.name?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              {achievements.map((a, i) => (
                <div key={i} className={`p-1.5 rounded-lg bg-white/5 ${a.color}`} title={a.title}>
                  <a.icon size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Main Settings Form */}
        {isLoading ? (
          <Card className="p-8 space-y-8">
            <div className="space-y-6">
              <Skeleton className="h-7 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            <div className="space-y-6 pt-8 border-t border-white/10">
              <div className="flex justify-between">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <Input defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <Input defaultValue={user?.email} disabled />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Change Password</h3>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {showPassword ? <><EyeOff size={16} /> Hide</> : <><Eye size={16} /> Show</>}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Current Password</label>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">New Password</label>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="glass" onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                }}>Cancel</Button>
              <Button  onClick={handlePasswordChange} disabled={passwordLoading}>Save Changes</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}