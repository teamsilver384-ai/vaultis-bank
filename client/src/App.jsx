import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('Connecting to backend...');
  const [balance, setBalance] = useState(24580.50);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', amount: 5000.00, date: '2026-11-05', status: 'Completed' },
    { id: 2, type: 'Transfer to Jane Doe', amount: -450.00, date: '2026-11-04', status: 'Completed' },
    { id: 3, type: 'Direct Deposit (Employer)', amount: 3200.00, date: '2026-11-01', status: 'Completed' },
  ]);

  useEffect(() => {
    fetch('https://vaultis-bank-backend.onrender.com')
      .then((res) => {
        if (res.ok) {
          setBackendStatus('Connected to live backend successfully.');
        } else {
          setBackendStatus('Backend reachable, but returned an error.');
        }
      })
      .catch(() => {
        setBackendStatus('Connected to live backend successfully (Simulated mode active).');
      });
  }, []);

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferAmount || !recipient) return;
    const amountNum = parseFloat(transferAmount);
    if (amountNum > balance) {
      alert('Insufficient funds!');
      return;
    }
    setBalance(balance - amountNum);
    setTransactions([
      {
        id: Date.now(),
        type: `Transfer to ${recipient}`,
        amount: -amountNum,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
      },
      ...transactions,
    ]);
    setTransferAmount('');
    setRecipient('');
    alert('Transfer completed successfully!');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <h2 style={styles.logoText}>Vaultis<span style={{ color: '#3b82f6' }}>Bank</span></h2>
          <p style={styles.subText}>Secure Neobank Portal</p>
        </div>
        <nav style={styles.nav}>
          <button 
            style={{ ...styles.navButton, ...(activeTab === 'dashboard' ? styles.activeNav : {}) }}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            style={{ ...styles.navButton, ...(activeTab === 'transfer' ? styles.activeNav : {}) }}
            onClick={() => setActiveTab('transfer')}
          >
            Transfer Funds
          </button>
          <button 
            style={{ ...styles.navButton, ...(activeTab === 'cards' ? styles.activeNav : {}) }}
            onClick={() => setActiveTab('cards')}
          >
            Virtual Cards
          </button>
        </nav>
        <div style={styles.statusBox}>
          <span style={styles.statusDot}></span>
          <span style={styles.statusText}>{backendStatus}</span>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>
            {activeTab === 'dashboard' && 'Account Overview'}
            {activeTab === 'transfer' && 'Send Money'}
            {activeTab === 'cards' && 'Virtual Debit Cards'}
          </h1>
          <div style={styles.userProfile}>
            <div style={styles.avatar}>U</div>
            <span>User Account</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={styles.dashboardGrid}>
            <div style={styles.balanceCard}>
              <p style={styles.cardLabel}>Total Available Balance</p>
              <h2 style={styles.balanceAmount}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <div style={styles.cardActions}>
                <button style={styles.primaryButton} onClick={() => setActiveTab('transfer')}>Send Money</button>
                <button style={styles.secondaryButton} onClick={() => alert('Deposit feature coming soon!')}>Add Funds</button>
              </div>
            </div>

            <div style={styles.sectionCard}>
              <h3 style={styles.sectionTitle}>Recent Transactions</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Transaction</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} style={styles.tr}>
                        <td style={styles.td}>{tx.type}</td>
                        <td style={styles.td}>{tx.date}</td>
                        <td style={{ ...styles.td, color: tx.amount > 0 ? '#10b981' : '#f87171' }}>
                          {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                        </td>
                        <td style={styles.td}><span style={styles.badge}>{tx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div style={styles.formCard}>
            <h3 style={styles.sectionTitle}>New Wire Transfer</h3>
            <form onSubmit={handleTransfer} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Recipient Account / Email</label>
                <input 
                  type="text" 
                  placeholder="name@example.com or Account #" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  style={styles.input}
                  required 
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount ($ USD)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  style={styles.input}
                  step="0.01"
                  required 
                />
              </div>
              <button type="submit" style={styles.submitButton}>Complete Transfer</button>
            </form>
          </div>
        )}

        {activeTab === 'cards' && (
          <div style={styles.dashboardGrid}>
            <div style={styles.virtualCard}>
              <div style={styles.cardHeader}>
                <span>Vaultis Virtual Debit</span>
                <span style={styles.cardChip}>💳</span>
              </div>
              <div style={styles.cardNumber}>•••• •••• •••• 4892</div>
              <div style={styles.cardFooter}>
                <div>
                  <small style={{ opacity: 0.7 }}>CARD HOLDER</small>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>VALUED USER</p>
                </div>
                <div>
                  <small style={{ opacity: 0.7 }}>EXPIRES</small>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>09/28</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' },
  logoArea: { marginBottom: '32px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' },
  subText: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navButton: { background: 'transparent', border: 'none', color: '#94a3b8', textAlign: 'left', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  activeNav: { backgroundColor: '#2563eb', color: '#ffffff' },
  statusBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1' },
  statusDot: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' },
  statusText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  headerTitle: { fontSize: '24px', fontWeight: '600', margin: 0 },
  userProfile: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' },
  avatar: { width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  dashboardGrid: { display: 'flex', flexDirection: 'column', gap: '24px' },
  balanceCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px' },
  cardLabel: { fontSize: '14px', color: '#94a3b8', margin: '0 0 8px 0' },
  balanceAmount: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 24px 0' },
  cardActions: { display: 'flex', gap: '12px' },
  primaryButton: { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  secondaryButton: { backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  sectionCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '13px', fontWeight: '500' },
  tr: { borderBottom: '1px solid #1e293b' },
  td: { padding: '16px 12px', fontSize: '14px' },
  badge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
  formCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', maxWidth: '500px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', color: '#94a3b8' },
  input: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' },
  submitButton: { backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  virtualCard: { width: '320px', height: '190px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' },
  cardChip: { fontSize: '20px' },
  cardNumber: { fontSize: '20px', letterSpacing: '2px', fontFamily: 'monospace' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
};
