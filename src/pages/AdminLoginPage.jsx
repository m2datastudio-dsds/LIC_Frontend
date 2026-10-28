import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@licagent.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.data.user));
      navigate('/admin/real-estate');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Admin login failed. Check your credentials and backend server.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="admin-login-page">
      <main className="admin-login-panel">
        <div className="admin-login-logos"><div className="admin-login-logo lic"><img src="/lic-logo-full.svg" alt="LIC" /></div><span></span><div className="admin-login-logo star"><img src="/star-health-watermark.svg" alt="Star Health Insurance" /></div></div>
        <form className="admin-login-card" onSubmit={handleSubmit}>
          <div className="admin-login-heading"><span className="admin-login-icon"><LockKeyhole size={22}/></span><div><h1>Admin sign in</h1><p>Enter your credentials to continue.</p></div></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <label>Email address<div className="admin-login-input"><Mail size={18}/><input type="email" autoComplete="username" placeholder="admin@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label>
          <label>Password<div className="admin-login-input"><LockKeyhole size={18}/><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
          <button className="btn admin-login-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
          <div className="admin-login-security"><ShieldCheck size={16}/><span>Secure access for authorised administrators</span></div>
        </form>
        <p className="admin-login-footer">LIC &amp; Star Health Administration</p>
      </main>
    </div>
  );
}

export default AdminLoginPage;
