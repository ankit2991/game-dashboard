import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Gamepad2,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';

export const B2CAuth: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { loginAs, registerPlayer } = useAuth();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam ? modeParam === 'login' : initialMode === 'login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('raymond_vip99');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShow2FAModal(true);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please verify.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      registerPlayer({
        fullName: fullName || username || 'New Player',
        email: email || `${username || 'player'}@nexus-play.com`,
        username: username || 'player1',
      });
      showToast('Player account created successfully! Welcome to Nexus Play.');
      navigate('/');
    }, 600);
  };

  const handleVerify2FA = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShow2FAModal(false);
      const isSarah = loginIdentifier.toLowerCase().includes('sarah');
      loginAs('player', {
        name: isSarah ? 'Sarah Jenkins' : 'Raymond Chen',
        email: isSarah ? 'sarah.j@nexus-play.com' : 'raymond.chen@nexus-vip.com',
      });
      showToast('Logged in successfully!');
      navigate('/');
    }, 500);
  };

  const handleQuickDemo = (user: 'raymond' | 'sarah') => {
    if (user === 'raymond') {
      setLoginIdentifier('raymond_vip99');
      setLoginPassword('RaymondVIPPass99!');
    } else {
      setLoginIdentifier('sarah_spinqueen');
      setLoginPassword('SarahSpinQueen2026!');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#20C997] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="rounded-3xl bg-[#121A2D]/95 border border-[#2D3E66] shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] via-[#6947eb] to-[#00D4FF] shadow-lg shadow-[#7C5CFC]/30 mb-3">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              {isLogin ? 'Player Login' : 'Create Player Account'}
            </h1>
            <p className="text-xs text-[#98A5BF] mt-1">
              {isLogin
                ? 'Sign in to access your casino wallet, bets, and favorite games'
                : 'Join now and claim your 100% Welcome Multiplier Bonus up to $1,000'}
            </p>
          </div>

          {/* Quick Demo Logins */}
          {isLogin && (
            <div className="mb-6 bg-[#0B1020]/80 rounded-2xl p-3 border border-[#233252] text-xs">
              <div className="flex items-center justify-between text-[#98A5BF] mb-2 font-medium">
                <span className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                  Quick Demo Players:
                </span>
                <span className="text-[10px] text-[#00D4FF]">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('raymond')}
                  className="p-2 rounded-xl bg-[#182238] hover:bg-[#7C5CFC]/15 text-left border border-[#2D3E66] transition-all"
                >
                  <p className="font-semibold text-white text-[11px]">Raymond Chen</p>
                  <span className="text-[10px] text-[#20C997]">VIP • MYR 8,420.50</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('sarah')}
                  className="p-2 rounded-xl bg-[#182238] hover:bg-[#00D4FF]/15 text-left border border-[#2D3E66] transition-all"
                >
                  <p className="font-semibold text-white text-[11px]">Sarah Jenkins</p>
                  <span className="text-[10px] text-[#00D4FF]">VIP • GBP 2,150.00</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Username or Email"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#98A5BF] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#98A5BF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0B1020] border-[#2D3E66] text-[#7C5CFC] focus:ring-[#7C5CFC] accent-[#7C5CFC]"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#00D4FF] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 font-display text-sm tracking-wide"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Play
              </Button>

              <div className="text-center pt-4 border-t border-[#233252]/80 text-xs text-[#98A5BF]">
                New player?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#00D4FF] font-semibold hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <Input
                label="Full Name"
                placeholder="Raymond Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Username"
                  placeholder="raymond_vip99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+60 12-345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Email Address"
                placeholder="raymond@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Password"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  placeholder="••••••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <label className="flex items-start gap-2 text-[#98A5BF] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-[#0B1020] border-[#2D3E66] text-[#7C5CFC] focus:ring-[#7C5CFC] accent-[#7C5CFC]"
                  required
                />
                <span>
                  I confirm I am at least 18 years of age and agree to the Terms of Service & Privacy Policy.
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2 font-display text-sm tracking-wide"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Claim Bonus
              </Button>

              <div className="text-center pt-3 border-t border-[#233252]/80 text-xs text-[#98A5BF]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#00D4FF] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 2FA Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Two-Factor Security Verification"
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setShow2FAModal(false)}
              className="text-xs text-[#98A5BF] hover:text-white"
            >
              Cancel
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={handleVerify2FA}
              isLoading={isLoading}
            >
              Verify Code
            </Button>
          </div>
        }
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 flex items-center justify-center mx-auto mb-3 text-[#A885FF]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-white text-base">Enter 6-Digit Code</h4>
          <p className="text-xs text-[#98A5BF] mt-1 mb-5">
            A verification code was dispatched to your registered authenticator app or phone.
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                placeholder="•"
                className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#0B1020] text-[#00D4FF] border border-[#2D3E66] rounded-xl focus:border-[#7C5CFC] outline-none"
              />
            ))}
          </div>

          <p className="text-[11px] text-[#64748B]">
            Mock Tip: Click 'Verify Code' directly to authenticate.
          </p>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setForgotSent(false);
        }}
        title="Reset Player Password"
        maxWidth="md"
        footer={
          <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
            Close
          </Button>
        }
      >
        {forgotSent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[#20C997] mx-auto mb-2" />
            <h4 className="font-semibold text-white">Reset Link Dispatched</h4>
            <p className="text-xs text-[#98A5BF] mt-1">
              Check your email for the secure password recovery link.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#98A5BF]">
              Enter your email address to receive password reset instructions.
            </p>
            <Input label="Email Address" placeholder="player@example.com" />
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setForgotSent(true)}
            >
              Send Reset Link
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
