import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';

/** Patch 10: backend-verified admin login. No demo credentials or simulated 2FA. */
export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(''); setBusy(true);
    try {
      await loginAdmin(email.trim(), password);
      setPassword('');
      navigate('/admin', {replace: true});
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in.');
    } finally { setBusy(false); }
  }

  return <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex items-center justify-center p-4 font-sans">
    <div className="w-full max-w-md rounded-3xl bg-[#121A2D] border border-[#2D3E66] shadow-2xl p-7">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#00D4FF] mx-auto mb-3 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Super Admin Portal</h1>
        <p className="text-xs text-[#98A5BF] mt-2">Sign in with your configured server administrator credentials</p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <Input label="Administrator email" type="email" required autoComplete="username"
          value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com"
          leftIcon={<Mail className="w-4 h-4"/>}/>
        <Input label="Password" required type={showPassword ? 'text' : 'password'} autoComplete="current-password"
          value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
          leftIcon={<Lock className="w-4 h-4"/>}
          rightIcon={<button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>}/>
        {error && <p role="alert" className="text-xs text-[#FF5D73] bg-[#FF5D73]/10 border border-[#FF5D73]/30 p-3 rounded-xl">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={busy}
          rightIcon={<ArrowRight className="w-4 h-4"/>}>Sign in securely</Button>
      </form>
      <div className="mt-6 pt-4 border-t border-[#233252] text-xs text-[#98A5BF] flex gap-2">
        <ShieldAlert className="w-4 h-4 text-[#FFB547] shrink-0"/>
        Accounts are configured by a server administrator. Two-factor authentication is not yet implemented; no simulated verification is used.
      </div>
    </div>
  </div>;
};
