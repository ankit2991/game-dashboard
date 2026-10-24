import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Gamepad2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { authErrorMessage } from '../../../lib/auth/authError';
import { validatePlayerRegistration } from '../../../lib/auth/validation';
import { useAuth } from '../../../context/AuthContext';

export const B2CAuth: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { loginPlayer, registerPlayer } = useAuth();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam ? modeParam === 'login' : initialMode === 'login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!loginIdentifier.trim() || !loginPassword) { setToastMessage('Enter your email/username and password.'); return; }
    setToastMessage(null);
    setIsLoading(true);
    try {
      await loginPlayer(loginIdentifier.trim(), loginPassword, rememberMe);
      navigate('/player/profile', { replace: true });
    } catch (error) {
      setToastMessage(authErrorMessage(error, 'player'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!agreeTerms) { setToastMessage('Please accept the Terms of Service.'); return; }
    if (password !== confirmPassword) { setToastMessage('Passwords do not match.'); return; }
    const validationError = validatePlayerRegistration({ displayName: fullName, username, email, password });
    if (validationError) { setToastMessage(validationError); return; }
    setToastMessage(null);
    setIsLoading(true);
    try {
      await registerPlayer({
        displayName: fullName.trim(), email: email.trim(), username: username.trim(), password,
      }, rememberMe);
      navigate('/player/profile', { replace: true });
    } catch (error) {
      setToastMessage(authErrorMessage(error, 'player'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Authentication errors */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#FF5D73] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4" />
          <span role="alert">{toastMessage}</span>
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
                ? 'Sign in with your registered player account'
                : 'Create a real player account connected to the Game Provider backend'}
            </p>
          </div>

          <p className="text-xs text-[#98A5BF] bg-[#0B1020] border border-[#233252] rounded-xl p-3 mb-5">
            {isLogin ? 'Enter your registered username or email and password.' : 'Accounts are registered on the backend. No automatic wallet bonus is granted.'}
          </p>

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

              <Input
                label="Username"
                placeholder="player_123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={24}
                required
              />

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
                  minLength={12}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  placeholder="••••••••••••"
                  type="password"
                  minLength={12}
                  maxLength={128}
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
                Create Player Account
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

      {/* Password reset is not supported by this backend. Do not fake sending an email. */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Player Password"
        maxWidth="md"
        footer={<Button variant="secondary" onClick={() => setShowForgotModal(false)}>Close</Button>}
      >
        <p className="text-sm text-[#98A5BF]">
          Password recovery is not available yet. Contact your platform administrator for assistance.
          No reset email has been sent.
        </p>
      </Modal>
    </div>
  );
};
