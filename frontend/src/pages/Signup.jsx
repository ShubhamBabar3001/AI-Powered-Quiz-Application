import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { sendOtp,verifyOtp } from '../services/otpService';
import { signUp } from '../services/authApi';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('details'); // 'details' or 'otp'
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Form fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  const validateDetails = () => {
    const newErrors = {};
    if (!name.trim() || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setIsLoading(true);
    await sendOtp(email,'SIGNUP');
    setIsLoading(false);
    setStep('otp');
   
  };

  const onOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    const res = await verifyOtp(email,otp);
    if (res.status !== 200) {
      setOtpError(res.data?.message);
      return;
    } else {
      const signRes = await signUp(name,email,password,confirmPassword);
      if (signRes.status === 200) {
        navigate('/dashboard', { replace: true });
      }
    }
    setIsLoading(false);
    setOtpError('');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {step === 'details' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-slate-400">Join the QuizVerse community</p>
              </div>

              <form onSubmit={onDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-12"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="pl-12"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="pl-12"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="pl-12"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                  Send Verification OTP
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Verify Email</h2>
                <p className="text-slate-400">Enter the 6-digit code sent to {email}</p>
              </div>

              <form onSubmit={onOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Verification Code</label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="text-center text-2xl tracking-[1em] font-bold"
                  />
                  {otpError && <p className="text-xs text-red-400 text-center">{otpError}</p>}
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    Register Now
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}