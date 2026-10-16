import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalLogo } from '../common/HospitalLogo';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Calendar,
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  Check
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    loginWithEmailPassword, 
    registerWithEmailPassword 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('1996-05-15');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other' | 'Prefer not to say'>('Prefer not to say');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  if (!isAuthModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: 'bg-slate-200', percent: 0 };
    if (pwd.length < 6) return { label: 'Weak (min 6 chars)', color: 'bg-red-400', percent: 30 };
    const hasNumbers = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    if (pwd.length >= 8 && hasNumbers && hasSpecial) {
      return { label: 'Strong', color: 'bg-emerald-500', percent: 100 };
    }
    return { label: 'Good', color: 'bg-amber-400', percent: 65 };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotPasswordNotice(false);

    if (authModalMode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full legal name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password entry.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage('Please accept the HIPAA & Medical Privacy Terms to register.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      if (authModalMode === 'login') {
        const result = loginWithEmailPassword(email.trim(), password);
        setIsLoading(false);
        if (result.success) {
          setSuccessNotice('Signed in successfully! Redirecting...');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setSuccessNotice(null);
          }, 500);
        } else {
          setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
        }
      } else {
        const result = registerWithEmailPassword({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || '+1 (555) 000-0000',
          password: password,
        });
        setIsLoading(false);
        if (result.success) {
          setSuccessNotice('Account created successfully! Welcome to Dr. Salim Hospital 2.0.');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setSuccessNotice(null);
          }, 600);
        } else {
          setErrorMessage(result.error || 'Could not create account.');
        }
      }
    }, 450);
  };

  const handleQuickDemoLogin = (demoEmail: string, demoPass: string = 'Hospital2026!') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = loginWithEmailPassword(demoEmail, demoPass);
      setIsLoading(false);
      if (res.success) {
        setIsAuthModalOpen(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsAuthModalOpen(false)} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header with Hospital Brand */}
        <div className="px-6 pt-5 pb-3 bg-gradient-to-b from-sky-50/70 to-white border-b border-slate-100 flex items-start justify-between shrink-0">
          <div className="space-y-0.5">
            <HospitalLogo size="sm" showTagline={false} variant="horizontal" />
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              Secure Clinical & Patient Access Gateway
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switchers: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage(null);
              setForgotPasswordNotice(false);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative mr-8 ${
              authModalMode === 'login'
                ? 'text-[#008CA5]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>Sign In</span>
            {authModalMode === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008CA5] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage(null);
              setForgotPasswordNotice(false);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              authModalMode === 'register'
                ? 'text-[#008CA5]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>Sign Up (New Patient)</span>
            {authModalMode === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008CA5] rounded-full" />
            )}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Error / Success Notifications */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successNotice}</span>
            </div>
          )}

          {forgotPasswordNotice && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
              <p className="font-semibold mb-0.5">Password Recovery</p>
              <p>For administrative or patient accounts, use default demo password <strong className="font-mono">Hospital2026!</strong> or use one-click demo access below.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* SIGN UP FIELDS */}
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe, Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008CA5] focus:border-[#008CA5] outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008CA5] focus:border-[#008CA5] outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008CA5] focus:border-[#008CA5] outline-none text-slate-900 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008CA5] focus:border-[#008CA5] outline-none text-slate-900 font-mono text-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  {authModalMode === 'login' ? 'Password *' : 'Create Password *'}
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordNotice(true)}
                    className="text-[11px] font-medium text-[#008CA5] hover:text-[#0A335C] transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={authModalMode === 'login' ? '••••••••' : 'Minimum 6 characters'}
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008CA5] focus:border-[#008CA5] outline-none text-slate-900 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter for registration */}
              {authModalMode === 'register' && password && (
                <div className="mt-1.5 space-y-1">
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-300`} 
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Password Strength: <strong className="text-slate-600">{strength.label}</strong></span>
                    <span>Min 6 characters</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password for Sign Up */}
            {authModalMode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008CA5] focus:border-[#008CA5] outline-none text-slate-900 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-600 mt-1 font-medium">Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[10px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>
            )}

            {/* Terms check for Sign Up */}
            {authModalMode === 'register' && (
              <label className="flex items-start gap-2 pt-1 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="rounded border-slate-300 text-[#008CA5] focus:ring-[#008CA5] mt-0.5"
                />
                <span className="text-[11px] leading-relaxed">
                  I agree to Dr. Salim Hospital 2.0 Patient Portal terms and consent to secure electronic health records storage under HIPAA & Supabase RLS privacy isolation.
                </span>
              </label>
            )}

            {/* Remember Me for Sign In */}
            {authModalMode === 'login' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#008CA5] focus:ring-[#008CA5]"
                  />
                  <span className="text-[11px]">Keep me signed in</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#0A335C] hover:bg-[#082847] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 text-xs"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Sign In to Portal' : 'Complete Sign Up & Enter Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Mode Switcher footer link */}
            <div className="text-center pt-1">
              {authModalMode === 'login' ? (
                <p className="text-slate-500 text-[11px]">
                  New patient to Dr. Salim Hospital?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-[#008CA5] font-bold hover:underline"
                  >
                    Sign Up Now
                  </button>
                </p>
              ) : (
                <p className="text-slate-500 text-[11px]">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-[#008CA5] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Fast Demo Accounts */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                Fast Demo Accounts (1-Click Fill)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('victor43chisaka@gmail.co', 'Hospital2026!')}
                  className="p-2 text-left bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-lg transition-colors"
                >
                  <div className="font-bold text-indigo-950 text-[11px] flex items-center gap-1">
                    <span>👑 Victor Chisaka</span>
                  </div>
                  <div className="text-[10px] text-indigo-700">Super Administrator</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin.cole@aegishealth.org', 'Hospital2026!')}
                  className="p-2 text-left bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/80 rounded-lg transition-colors"
                >
                  <div className="font-bold text-teal-950 text-[11px]">🩺 Dr. Amanda Cole</div>
                  <div className="text-[10px] text-teal-700">Clinical Admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('john.doe@example.com', 'Hospital2026!')}
                  className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <div className="font-bold text-slate-800 text-[11px]">👤 John Doe</div>
                  <div className="text-[10px] text-slate-500">Patient Profile</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('emily.miller@example.com', 'Hospital2026!')}
                  className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <div className="font-bold text-slate-800 text-[11px]">👤 Emily Miller</div>
                  <div className="text-[10px] text-slate-500">Patient Profile</div>
                </button>
              </div>
            </div>

          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>256-bit TLS Encrypted</span>
          </span>
          <span>Dr. Salim Hospital 2.0</span>
        </div>

      </div>

    </div>
  );
};
