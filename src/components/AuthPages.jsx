import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sword, Mail, Lock, User, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared input
// ---------------------------------------------------------------------------
function Field({ id, label, type = 'text', value, onChange, placeholder, icon: Icon }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          required
          className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl
                     pl-9 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500
                     focus:outline-none focus:border-violet-500/70 focus:ring-1
                     focus:ring-violet-500/30 transition-all"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export function Login({ onSwitch }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to enter the arena">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="login-email"    label="Email"    type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="you@example.com" icon={Mail} />
        <Field id="login-password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"         icon={Lock} />

        {error && (
          <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="btn-primary justify-center mt-1"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {loading ? 'Signing in…' : 'Enter the Arena'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        No account?{' '}
        <button onClick={onSwitch} className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
          Register here
        </button>
      </p>
    </AuthCard>
  );
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export function Register({ onSwitch }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Join the Arena" subtitle="Create your account and start competing">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="reg-username" label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="YourHandle"      icon={User} />
        <Field id="reg-email"    label="Email"    type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="you@example.com" icon={Mail} />
        <Field id="reg-password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" icon={Lock} />

        {error && (
          <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          id="register-submit"
          type="submit"
          disabled={loading}
          className="btn-primary justify-center mt-1"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sword size={16} />}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
          Sign in
        </button>
      </p>
    </AuthCard>
  );
}

// ---------------------------------------------------------------------------
// Shared wrapper card
// ---------------------------------------------------------------------------
function AuthCard({ title, subtitle, children }) {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-gradient-to-br from-violet-600 to-pink-600
                          shadow-[0_0_30px_rgba(139,92,246,0.4)] mb-4">
            <Sword size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-100">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          <p className="text-[10px] text-violet-400/60 font-bold uppercase tracking-widest mt-2">
            DSA Morning Sprint Arena
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {children}
        </div>
      </div>
    </div>
  );
}
