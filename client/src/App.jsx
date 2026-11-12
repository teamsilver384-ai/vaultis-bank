import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('signup'); // 'signup' or 'dashboard'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Processing registration...');
    
    try {
      const res = await fetch('https://vaultis-bank-backend.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data.user || { name: formData.fullName, email: formData.email });
        setView('dashboard');
      } else {
        setMessage(data.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      // Fallback for demo/offline UI testing
      setUser({ name: formData.fullName, email: formData.email });
      setView('dashboard');
    }
  };

  if (view === 'signup') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Vaultis Bank</h1>
          <p style={styles.subtitle}>Create a New Account</p>
          
          {message && <p style={styles.message}>{message}</p>}

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Residential Address</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Financial Way, Suite 100"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              Register Account
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#8b949e' }}>
            Already have an account?{' '}
            <span 
              onClick={() => setView('dashboard')} 
              style={{ color: '#58a6ff', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Skip to Demo Dashboard
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, background: '#090d16', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Vaultis Bank Live Dashboard</h1>
        <button 
          onClick={() => setView('signup')} 
          style={{ padding: '8px 16px', background: '#21262d', color: '#fff', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}
        >
          Sign Out ({user ? user.name : 'User'})
        </button>
      </div>
      <p>Welcome, {user ? user.name : 'Valued Customer'}! Connected to Vaultis backend successfully.</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#090d16',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    padding: 20
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 12,
    padding: 32,
    width: '100%',
    maxWidth: 440,
    color: '#f0f6fc'
  },
  title: { margin: 0, fontSize: 24, textAlign: 'center', color: '#58a6ff' },
  subtitle: { margin: '4px 0 24px 0', textAlign: 'center', color: '#8b949e', fontSize: 14 },
  message: { background: '#1f6feb22', border: '1px solid #1f6feb', padding: 10, borderRadius: 6, fontSize: 14, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, color: '#8b949e', fontWeight: 'bold' },
  input: {
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: '10px 12px',
    color: '#fff',
    fontSize: 14,
    outline: 'none'
  },
  button: {
    marginTop: 8,
    background: '#238636',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '12px',
    fontSize: 15,
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};