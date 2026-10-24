import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Globe,
  User,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';

export const OperatorAuth: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { loginAs, registerOperator } = useAuth();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam ? modeParam === 'login' : initialMode === 'login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('d.tan@asiagaming.net');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Registration Form State
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Singapore');
  const [businessType, setBusinessType] = useState('iGaming Aggregator');
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (loginEmail.includes('connor') || loginEmail.includes('pending') || loginEmail.includes('cybertech')) {
        loginAs('operator', {
          approvalStatus: 'pending',
          email: loginEmail,
          companyName: 'CyberTech Gaming Ventures',
        });
        navigate('/operator/pending-approval');
      } else {
        loginAs('operator', {
          approvalStatus: 'approved',
          email: loginEmail,
          companyName: 'Asia Gaming Network Ltd',
        });
        navigate('/operator/dashboard');
      }
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      registerOperator({
        companyName: companyName || 'New Operator Aggregator',
        email,
        businessType
      });
      navigate('/operator/pending-approval');
    }, 800);
  };

  const handleQuickDemo = (operator: 'asia' | 'pending') => {
    if (operator === 'asia') {
      setLoginEmail('d.tan@asiagaming.net');
      setLoginPassword('AsiaGamingPass2026!');
    } else {
      setLoginEmail('s.connor@cybertech-slots.io');
      setLoginPassword('CyberTechPass2026!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans relative selection:bg-[#00D4FF] selection:text-[#0B1020]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-8">
        <div className="w-full max-w-xl">
          <div className="rounded-3xl bg-[#121A2D]/95 border border-[#2D3E66] shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            {/* Header / Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D4FF] to-[#7C5CFC] shadow-lg shadow-[#00D4FF]/25 mb-3">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                {isLogin ? 'Operator Partner Portal' : 'Register Commercial Operator Account'}
              </h1>
              <p className="text-xs text-[#98A5BF] mt-1">
                {isLogin
                  ? 'Access game catalog licensing, manage API keys, and monitor player sessions'
                  : 'Get instant Sandbox API credentials and integrate 700+ games'}
              </p>
            </div>

            {/* Quick Demo Autofill when on Login */}
            {isLogin && !registrationSuccess && (
              <div className="mb-6 bg-[#0B1020]/80 rounded-2xl p-3 border border-[#233252] text-xs">
                <div className="flex items-center justify-between text-[#98A5BF] mb-2 font-medium">
                  <span className="flex items-center gap-1.5 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                    Demo Operator Accounts:
                  </span>
                  <span className="text-[10px] text-[#00D4FF]">Click to autofill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('asia')}
                    className="p-2 rounded-xl bg-[#182238] hover:bg-[#00D4FF]/10 text-left border border-[#2D3E66] transition-all"
                  >
                    <p className="font-semibold text-white text-[11px]">Asia Gaming Ltd</p>
                    <span className="text-[10px] text-[#00D4FF]">Tier 1 Operator • 420 Games</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('pending')}
                    className="p-2 rounded-xl bg-[#182238] hover:bg-[#FFB547]/10 text-left border border-[#2D3E66] transition-all"
                  >
                    <p className="font-semibold text-white text-[11px]">CyberTech Ventures</p>
                    <span className="text-[10px] text-[#FFB547]">Pending KYC • Application</span>
                  </button>
                </div>
              </div>
            )}

            {/* Registration Success Confirmation */}
            {registrationSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#20C997]/20 border border-[#20C997]/40 flex items-center justify-center mx-auto mb-3 text-[#20C997]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">Registration Submitted!</h3>
                <p className="text-xs text-[#98A5BF] max-w-sm mx-auto mt-2 leading-relaxed">
                  Your operator profile for <strong className="text-white">{companyName || 'your company'}</strong> has been registered. Sandbox API keys are ready, and compliance has queued your production review.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button
                    variant="cyan"
                    size="md"
                    onClick={() => navigate('/operator/dashboard')}
                  >
                    Enter Operator Sandbox Dashboard
                  </Button>
                </div>
              </div>
            ) : isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Business Email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
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
                      className="w-4 h-4 rounded bg-[#0B1020] border-[#2D3E66] text-[#00D4FF] focus:ring-[#00D4FF] accent-[#00D4FF]"
                    />
                    <span>Remember Company Session</span>
                  </label>
                  <button type="button" className="text-[#00D4FF] hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="cyan"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2 font-display text-sm tracking-wide"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Operator Console
                </Button>

                <div className="text-center pt-4 border-t border-[#233252]/80 text-xs text-[#98A5BF]">
                  Don't have an operator account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-[#00D4FF] font-semibold hover:underline"
                  >
                    Register Company
                  </button>
                </div>
              </form>
            ) : (
              /* Company Registration Form */
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <Input
                  label="Company Legal Name"
                  placeholder="e.g. Apex Gaming Network Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  leftIcon={<Building2 className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Corporate Website"
                    placeholder="https://apexgaming.io"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    leftIcon={<Globe className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Business Email"
                    placeholder="integration@apexgaming.io"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Primary Contact Person"
                    placeholder="Marcus Thorne"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+65 6123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                      Country / Jurisdiction
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none"
                    >
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Malta">Malta (MGA)</option>
                      <option value="Curacao">Curacao</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Cyprus">Cyprus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none"
                    >
                      <option value="iGaming Aggregator">iGaming Aggregator</option>
                      <option value="Direct Casino Operator">Direct Casino Operator</option>
                      <option value="Sportsbook & Casino">Sportsbook & Casino</option>
                      <option value="White-Label Platform">White-Label Platform</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Corporate Registration Number (Optional)"
                  placeholder="e.g. 2026-SG-99120B"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                />

                <Input
                  label="Password"
                  placeholder="Create secure password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <label className="flex items-start gap-2 text-[#98A5BF] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded bg-[#0B1020] border-[#2D3E66] text-[#00D4FF] focus:ring-[#00D4FF] accent-[#00D4FF]"
                    required
                  />
                  <span>
                    I confirm that our organization complies with all applicable gaming and anti-money laundering regulations and agree to the Provider Terms of Service.
                  </span>
                </label>

                <Button
                  type="submit"
                  variant="cyan"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2 font-display text-sm tracking-wide"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Operator & Get Sandbox Keys
                </Button>

                <div className="text-center pt-3 border-t border-[#233252]/80 text-xs text-[#98A5BF]">
                  Already have an operator account?{' '}
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
      </div>
    </div>
  );
};
