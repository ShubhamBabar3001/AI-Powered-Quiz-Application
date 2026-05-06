import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser,forgotPassword } from '../services/authApi';
import { sendOtp,verifyOtp } from '../services/otpService';
import toast from 'react-hot-toast'; // Make sure to install react-hot-toast

export default function Login() {
  const navigate = useNavigate();
  // Separate state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');

  // Email validation helper
  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email address';
    return null;
  };

  // Handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailError = validateEmailFormat(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const status = await loginUser({ email, password });
      if (status === 200) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send OTP for forgot password
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(email, "FORGOT_PASSWORD");
      setIsOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password API (you may need to adjust endpoint)
  const resetPassword = async (email, newPassword, otpCode) => {
    await forgotPassword(email,otp,newPassword);
    navigate('/login');
  };

  // Handle OTP verification and password reset
  const handleVerifyAndReset = async () => {
    setError('');
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    // Validate new password
    if (!password) {
      setError('New password is required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP
      const verifyResponse = await verifyOtp(email, otp);
      
      if (verifyResponse.data?.success) {
        // Reset password using the verified OTP
        await resetPassword(email, password, otp);
        toast.success('Password reset successfully!');
        
        // Auto login after password reset
        const status = await loginUser({ email, password });
        if (status === 200) {
          navigate('/dashboard');
        } else {
          setError('Password reset successful, but auto-login failed. Please login manually.');
          // Reset states to go back to login form
          setIsOtpSent(false);
          setIsForgotPassword(false);
          setPassword('');
          setOtp('');
          setConfirmPassword('');
        }
      } else {
        setError(verifyResponse.data?.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError('');
    setOtp('');
    setIsLoading(true);
    try {
      await sendOtp(email, 'reset-password');
      toast.success(`New OTP sent to ${email}`);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all states and go back to login
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsOtpSent(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setError('');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {isForgotPassword ? (isOtpSent ? 'Reset Password' : 'Forgot Password') : 'Welcome Back'}
            </h2>
            <p className="text-slate-400">
              {isForgotPassword 
                ? (isOtpSent 
                    ? 'Enter the OTP and your new password' 
                    : 'Enter your email to receive a reset OTP') 
                : 'Login to your QuizVerse account'}
            </p>
          </div>

          {/* Login Form */}
          {!isForgotPassword && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                    }}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Login
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          )}

          {/* Forgot Password - Send OTP Form */}
          {isForgotPassword && !isOtpSent && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-12"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="space-y-4">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Reset OTP
                  <ArrowRight className="ml-2" size={18} />
                </Button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* OTP Verification & Password Reset Form */}
          {isForgotPassword && isOtpSent && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Enter OTP sent to {email}
                </label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[1em] font-bold"
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-12"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-400 text-center">{error}</p>}

              <Button onClick={handleVerifyAndReset} className="w-full" isLoading={isLoading}>
                Reset Password & Login
              </Button>
              
              <button 
                onClick={handleResendOtp}
                className="w-full text-sm text-indigo-400 hover:underline"
                disabled={isLoading}
              >
                Resend OTP
              </button>
              
              <button
                onClick={handleBackToLogin}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Sign Up Link (only shown on login form) */}
          {!isForgotPassword && (
            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}