import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState('alex.mercer@nexus-provider.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth check then prompt 2FA
    setTimeout(() => {
      setIsLoading(false);
      setShow2FAModal(true);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-advance input focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify2FA = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShow2FAModal(false);
      loginAs('super_admin', { email });
      navigate('/admin');
    }, 800);
  };

  const handleQuickDemo = (role: 'root' | 'compliance' | 'auditor') => {
    if (role === 'root') {
      setEmail('alex.mercer@nexus-provider.io');
    } else if (role === 'compliance') {
      setEmail('elena.rostova@nexus-compliance.io');
    } else {
      setEmail('auditor.sec@nexus-audit.io');
    }
    setPassword('NexusSecurePass2026!');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans relative">

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="rounded-3xl bg-[#121A2D]/90 border border-[#2D3E66] shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#00D4FF] shadow-lg shadow-[#7C5CFC]/30 mb-3.5">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">Super Admin Portal</h1>
              <p className="text-xs text-[#98A5BF] mt-1.5">
                Centralized Management for Game Aggregation & Operator Licensing
              </p>
              <div className="mt-3 flex justify-center">
                <Badge size="sm" variant="purple" dot>
                  Encrypted Hardware 2FA Required
                </Badge>
              </div>
            </div>

            {/* Quick Demo Credentials Autofill */}
            <div className="mb-6 bg-[#0B1020]/80 rounded-2xl p-3 border border-[#233252] text-xs">
              <div className="flex items-center justify-between text-[#98A5BF] mb-2 font-medium">
                <span className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                  Quick Demo Roles:
                </span>
                <span className="text-[10px] text-[#00D4FF]">Click to autofill</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('root')}
                  className="px-2 py-1.5 rounded-lg bg-[#182238] hover:bg-[#7C5CFC]/20 text-[#A885FF] hover:text-white border border-[#2D3E66] text-[11px] font-medium transition-all"
                >
                  Root Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('compliance')}
                  className="px-2 py-1.5 rounded-lg bg-[#182238] hover:bg-[#00D4FF]/20 text-[#00D4FF] hover:text-white border border-[#2D3E66] text-[11px] font-medium transition-all"
                >
                  Compliance
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('auditor')}
                  className="px-2 py-1.5 rounded-lg bg-[#182238] hover:bg-[#20C997]/20 text-[#20C997] hover:text-white border border-[#2D3E66] text-[11px] font-medium transition-all"
                >
                  Auditor
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Admin Work Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexus-provider.io"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div>
                <Input
                  label="Master Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
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
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#98A5BF] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0B1020] border-[#2D3E66] text-[#7C5CFC] focus:ring-[#7C5CFC] accent-[#7C5CFC]"
                  />
                  <span>Enforce IP Bound Session</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#00D4FF] hover:underline"
                >
                  Reset Keys?
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
                Authenticate & Verify 2FA
              </Button>
            </form>

            {/* Security notice footer */}
            <div className="mt-6 pt-5 border-t border-[#233252]/80 text-center">
              <p className="text-[11px] text-[#64748B] flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FFB547]" />
                Authorized Nexus Personnel Only. All IP addresses are logged.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Factor Authentication Modal Simulation */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Hardware Security 2FA Verification"
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
              Verify & Enter Dashboard
            </Button>
          </div>
        }
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 flex items-center justify-center mx-auto mb-3 text-[#A885FF]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-white text-base">Enter Authenticator Code</h4>
          <p className="text-xs text-[#98A5BF] mt-1 mb-5">
            Please enter the 6-digit TOTP code generated by your Google Authenticator or YubiKey app.
          </p>

          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={otpCode[idx]}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                placeholder="•"
                className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#0B1020] text-[#00D4FF] border border-[#2D3E66] rounded-xl focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/30 outline-none"
              />
            ))}
          </div>

          <p className="text-[11px] text-[#64748B]">
            Mock Hint: Click 'Verify' directly or type any 6 digits (e.g. 784201).
          </p>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setForgotSuccess(false);
        }}
        title="Admin Key Recovery"
        maxWidth="md"
        footer={
          forgotSuccess ? (
            <Button variant="secondary" onClick={() => setShowForgotModal(false)}>Close</Button>
          ) : (
            <Button variant="primary" onClick={() => setForgotSuccess(true)}>Request Recovery Email</Button>
          )
        }
      >
        {forgotSuccess ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[#20C997] mx-auto mb-2" />
            <h4 className="font-semibold text-white">Recovery Token Dispatched</h4>
            <p className="text-xs text-[#98A5BF] mt-1">
              Instructions have been sent to the root administrator recovery channel. Check your secure inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#98A5BF]">
              Enter your verified system admin email address. A cryptographic single-use recovery token will be dispatched.
            </p>
            <Input
              label="Admin Recovery Email"
              defaultValue={email}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
