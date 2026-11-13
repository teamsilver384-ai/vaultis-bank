import React, { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'signin', 'signup', 'dashboard'
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [transferData, setTransferData] = useState({ recipient: '', amount: '', note: '' });
  const [balance, setBalance] = useState(24580.50);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', date: '2026-11-05', amount: 5000.00, status: 'Completed' },
    { id: 2, type: 'Transfer to Jane Doe', date: '2026-11-04', amount: -450.00, status: 'Completed' },
    { id: 3, type: 'Direct Deposit (Employer)', date: '2026-11-01', amount: 3200.00, status: 'Completed' }
  ]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (currentView === 'signup') {
      try {
        const res = await fetch('https://vaultis-bank-backend.onrender.com/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user || { name: formData.fullName, email: formData.email });
          setCurrentView('dashboard');
        } else {
          setUser({ name: formData.fullName, email: formData.email });
          setCurrentView('dashboard');
        }
      } catch (err) {
        setUser({ name: formData.fullName || 'Valued Client', email: formData.email });
        setCurrentView('dashboard');
      }
    } else {
      setUser({ name: formData.email.split('@')[0] || 'User', email: formData.email });
      setCurrentView('dashboard');
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferData.amount);
    if (!amt || amt <= 0 || amt > balance) return;
    setBalance(prev => prev - amt);
    setTransactions([
      { id: Date.now(), type: `Transfer to ${transferData.recipient}`, date: new Date().toISOString().split('T')[0], amount: -amt, status: 'Completed' },
      ...transactions
    ]);
    setTransferData({ recipient: '', amount: '', note: '' });
    setActiveTab('overview');
  };

  if (currentView === 'dashboard') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#090d16', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: 260, background: '#0d1117', borderRight: '1px solid #30363d', padding: 24 }}>
          <h2 style={{ color: '#58a6ff', margin: '0 0 32px 0' }}>Vaultis Bank</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => setActiveTab('overview')} style={{ padding: '12px 16px', background: activeTab === 'overview' ? '#1f6feb' : 'transparent', color: '#fff', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
            <button onClick={() => setActiveTab('transfer')} style={{ padding: '12px 16px', background: activeTab === 'transfer' ? '#1f6feb' : 'transparent', color: '#fff', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer' }}>Transfer Funds</button>
            <button onClick={() => setActiveTab('cards')} style={{ padding: '12px 16px', background: activeTab === 'cards' ? '#1f6feb' : 'transparent', color: '#fff', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer' }}>Virtual Cards</button>
          </nav>
        </div>
        <div style={{ flex: 1, padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1>Account Overview</h1>
            <button onClick={() => setCurrentView('home')} style={{ padding: '8px 16px', background: '#21262d', color: '#fff', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>Sign Out ({user ? user.name : 'Account'})</button>
          </div>
          {activeTab === 'overview' && (
            <div>
              <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: 24, marginBottom: 32 }}>
                <span style={{ color: '#8b949e', fontSize: 14 }}>Total Available Balance</span>
                <h2 style={{ fontSize: 40, margin: '8px 0 16px 0' }}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setActiveTab('transfer')} style={{ padding: '10px 20px', background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Send Money</button>
                </div>
              </div>
              <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Recent Transactions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363d', textAlign: 'left', color: '#8b949e' }}>
                      <th style={{ padding: 12 }}>Transaction</th>
                      <th style={{ padding: 12 }}>Date</th>
                      <th style={{ padding: 12 }}>Amount</th>
                      <th style={{ padding: 12 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #21262d' }}>
                        <td style={{ padding: 12 }}>{t.type}</td>
                        <td style={{ padding: 12, color: '#8b949e' }}>{t.date}</td>
                        <td style={{ padding: 12, color: t.amount > 0 ? '#3fb950' : '#f85149', fontWeight: 'bold' }}>{t.amount > 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}</td>
                        <td style={{ padding: 12 }}><span style={{ background: '#23863622', color: '#3fb950', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'transfer' && (
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: 32, maxWidth: 500 }}>
              <h3>Wire & Account Transfer</h3>
              <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                <input type="text" placeholder="Recipient Name / Email" required value={transferData.recipient} onChange={e => setTransferData({ ...transferData, recipient: e.target.value })} style={{ padding: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
                <input type="number" step="0.01" placeholder="Amount ($)" required value={transferData.amount} onChange={e => setTransferData({ ...transferData, amount: e.target.value })} style={{ padding: 12, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
                <button type="submit" style={{ padding: 12, background: '#238636', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>Send Payment</button>
              </form>
            </div>
          )}
          {activeTab === 'cards' && (
            <div style={{ background: 'linear-gradient(135deg, #1f6feb, #090d16)', border: '1px solid #30363d', borderRadius: 16, padding: 32, width: 340, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0 }}>Vaultis Platinum</h3>
                <span style={{ fontSize: 12, opacity: 0.8 }}>Virtual Debit</span>
              </div>
              <div style={{ fontSize: 20, letterSpacing: 2 }}>•••• •••• •••• 8842</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>EXP: 11/30</span>
                <span>CVV: ***</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0d1117', color: '#f0f6fc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', background: '#161b22', borderBottom: '1px solid #30363d' }}>
        <h1 style={{ color: '#58a6ff', margin: 0, fontSize: 24, cursor: 'pointer' }} onClick={() => setCurrentView('home')}>Vaultis Bank</h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => setCurrentView('signin')} style={{ padding: '8px 20px', background: 'transparent', color: '#58a6ff', border: '1px solid #58a6ff', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button>
          <button onClick={() => setCurrentView('signup')} style={{ padding: '8px 20px', background: '#238636', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>Open an Account</button>
        </div>
      </header>

      {currentView === 'home' && (
        <main>
          <section style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)', borderBottom: '1px solid #30363d' }}>
            <h2 style={{ fontSize: 48, margin: '0 0 16px 0', color: '#f0f6fc' }}>Banking Built for the Digital Age</h2>
            <p style={{ fontSize: 20, color: '#8b949e', maxWidth: 650, margin: '0 auto 32px auto' }}>Secure checking, high-yield savings, instant transfers, and zero account fees—all backed by next-generation security.</p>
            <button onClick={() => setCurrentView('signup')} style={{ padding: '16px 36px', background: '#1f6feb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 18, fontWeight: 'bold', cursor: 'pointer' }}>Get Started Online</button>
          </section>

          <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { title: 'Checking & Debit', desc: 'No monthly maintenance fees, free nationwide ATMs, and instant virtual card creation.' },
              { title: 'High-Yield Savings', desc: 'Earn up to 4.50% APY on all savings deposits with automatic round-up rules.' },
              { title: 'Credit Cards', desc: 'Get 3% cashback on everyday purchases with no annual fees and immediate approval decisions.' },
              { title: 'Wealth & Investments', desc: 'Automated portfolio management and commission-free stock trading integrated into one dashboard.' }
            ].map((prod, idx) => (
              <div key={idx} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: 24 }}>
                <h3 style={{ color: '#58a6ff', margin: '0 0 12px 0' }}>{prod.title}</h3>
                <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{prod.desc}</p>
              </div>
            ))}
          </section>
        </main>
      )}

      {(currentView === 'signin' || currentView === 'signup') && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: 32, width: '100%', maxWidth: 440 }}>
            <h2 style={{ margin: '0 0 8px 0', textAlign: 'center', color: '#58a6ff' }}>{currentView === 'signup' ? 'Open Your Vaultis Account' : 'Sign In to Online Banking'}</h2>
            <p style={{ margin: '0 0 24px 0', textAlign: 'center', color: '#8b949e', fontSize: 14 }}>{currentView === 'signup' ? 'Enter your credentials to apply in under 2 minutes.' : 'Access your dashboard securely.'}</p>
            
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {currentView === 'signup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, color: '#8b949e' }}>Full Name</label>
                  <input type="text" required placeholder="Jane Doe" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} style={{ padding: 10, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, color: '#8b949e' }}>Email Address</label>
                <input type="email" required placeholder="jane@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: 10, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, color: '#8b949e' }}>Password</label>
                <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ padding: 10, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
              </div>
              {currentView === 'signup' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, color: '#8b949e' }}>Phone Number</label>
                    <input type="tel" required placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ padding: 10, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, color: '#8b949e' }}>Residential Address</label>
                    <input type="text" required placeholder="123 Financial Way, Suite 100" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ padding: 10, background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#fff' }} />
                  </div>
                </>
              )}
              <button type="submit" style={{ marginTop: 8, padding: 12, background: '#238636', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
                {currentView === 'signup' ? 'Complete Application' : 'Sign In'}
              </button>
            </form>

            <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#8b949e' }}>
              {currentView === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <span onClick={() => setCurrentView(currentView === 'signup' ? 'signin' : 'signup')} style={{ color: '#58a6ff', cursor: 'pointer', textDecoration: 'underline' }}>
                {currentView === 'signup' ? 'Sign In' : 'Register Now'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}