import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: 'Bank Anywhere',
    subtitle: 'Managing your account is easy. You get more than you expect from a bank with excellent services designed just for you.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    tagline: '24/7 Digital Access'
  },
  {
    id: 2,
    title: 'Instant Global Transfers',
    subtitle: 'Send and receive money instantly across borders with our secure, low-fee digital banking network.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67d57a4b21?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Seamless Wire Payments'
  },
  {
    id: 3,
    title: 'Smart Wealth Management',
    subtitle: 'Grow your savings faster with up to 4.50% APY and personalized automated investment portfolios.',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1200&auto=format&fit=crop',
    tagline: 'High Yield Returns'
  }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(24580.50);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', date: '2026-11-05', amount: 5000.00, status: 'Completed' },
    { id: 2, type: 'Transfer to Jane Doe', date: '2026-11-04', amount: -450.00, status: 'Completed' },
    { id: 3, type: 'Direct Deposit', date: '2026-11-01', amount: 3200.00, status: 'Completed' }
  ]);
  const [transferData, setTransferData] = useState({ recipient: '', amount: '', note: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (currentView === 'signup') {
      try {
        const res = await fetch('https://vaultis-bank-backend.onrender.com/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        setUser(data.user || { name: formData.fullName, email: formData.email });
      } catch (err) {
        setUser({ name: formData.fullName || 'Valued Client', email: formData.email });
      }
    } else {
      setUser({ name: formData.email.split('@')[0] || 'User', email: formData.email });
    }
    setCurrentView('dashboard');
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
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8', color: '#222', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ width: 260, background: '#d32f2f', color: '#fff', padding: 24 }}>
          <h2 style={{ margin: '0 0 32px 0', fontSize: 24, fontWeight: 'bold' }}>VAULTIS BANK</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => setActiveTab('overview')} style={{ padding: '12px 16px', background: activeTab === 'overview' ? '#b71c1c' : 'transparent', color: '#fff', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
            <button onClick={() => setActiveTab('transfer')} style={{ padding: '12px 16px', background: activeTab === 'transfer' ? '#b71c1c' : 'transparent', color: '#fff', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer' }}>Transfer Funds</button>
            <button onClick={() => setActiveTab('cards')} style={{ padding: '12px 16px', background: activeTab === 'cards' ? '#b71c1c' : 'transparent', color: '#fff', border: 'none', borderRadius: 6, textAlign: 'left', cursor: 'pointer' }}>Virtual Cards</button>
          </nav>
        </div>
        <div style={{ flex: 1, padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ margin: 0, color: '#b71c1c' }}>Online Banking Portal</h1>
            <button onClick={() => setCurrentView('home')} style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Sign Out ({user ? user.name : 'Account'})</button>
          </div>
          {activeTab === 'overview' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, marginBottom: 32 }}>
                <span style={{ color: '#666', fontSize: 14 }}>Total Available Balance</span>
                <h2 style={{ fontSize: 36, margin: '8px 0 16px 0', color: '#d32f2f' }}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                <button onClick={() => setActiveTab('transfer')} style={{ padding: '10px 20px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>Transfer Money</button>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: 24 }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Recent Transactions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#666' }}>
                      <th style={{ padding: 12 }}>Description</th>
                      <th style={{ padding: 12 }}>Date</th>
                      <th style={{ padding: 12 }}>Amount</th>
                      <th style={{ padding: 12 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 12 }}>{t.type}</td>
                        <td style={{ padding: 12, color: '#666' }}>{t.date}</td>
                        <td style={{ padding: 12, color: t.amount > 0 ? '#2e7d32' : '#c62828', fontWeight: 'bold' }}>{t.amount > 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}</td>
                        <td style={{ padding: 12 }}><span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'transfer' && (
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: 32, maxWidth: 480 }}>
              <h3 style={{ color: '#d32f2f', margin: '0 0 16px 0' }}>Wire & Account Transfer</h3>
              <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input type="text" placeholder="Recipient Account / Email" required value={transferData.recipient} onChange={e => setTransferData({ ...transferData, recipient: e.target.value })} style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4 }} />
                <input type="number" step="0.01" placeholder="Amount ($)" required value={transferData.amount} onChange={e => setTransferData({ ...transferData, amount: e.target.value })} style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4 }} />
                <button type="submit" style={{ padding: 12, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>Send Payment</button>
              </form>
            </div>
          )}
          {activeTab === 'cards' && (
            <div style={{ background: 'linear-gradient(135deg, #d32f2f, #8e0000)', color: '#fff', borderRadius: 12, padding: 32, width: 340, height: 190, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0 }}>Vaultis Corporate Debit</h3>
                <span style={{ fontSize: 12, opacity: 0.8 }}>INTERNET BANKING</span>
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

  const slide = slides[currentSlide];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: '#ffffff', borderBottom: '2px solid #d32f2f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#d32f2f', color: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 20 }}>V</div>
          <span style={{ fontSize: 24, fontWeight: 'bold', color: '#d32f2f', letterSpacing: 1 }}>VAULTIS BANK</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setCurrentView('signin')} style={{ padding: '8px 20px', background: 'transparent', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
          <button onClick={() => setCurrentView('signup')} style={{ padding: '8px 20px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>REGISTER</button>
        </div>
      </header>

      <div style={{ position: 'relative', flex: 1, minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 45%, rgba(0,0,0,0.2) 100%), url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease-in-out'
        }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: 1200, padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ maxWidth: 520 }}>
            <span style={{ background: '#d32f2f', color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}>{slide.tagline}</span>
            <h1 style={{ fontSize: 44, color: '#d32f2f', margin: '16px 0 12px 0', lineHeight: 1.2, fontWeight: 'bold' }}>{slide.title}</h1>
            <p style={{ fontSize: 18, color: '#444', lineHeight: 1.6, margin: 0 }}>{slide.subtitle}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: idx === currentSlide ? 28 : 10,
                    height: 10,
                    borderRadius: 5,
                    background: idx === currentSlide ? '#d32f2f' : '#ccc',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ background: '#d32f2f', color: '#fff', borderRadius: 8, padding: 32, width: 380, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: 20,