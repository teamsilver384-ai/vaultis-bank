const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let bankConfig = {
  maxSingleTransfer: 15000.00,
  accountLocked: false
};

let userDatabase = {
  "alex": {
    username: "alex",
    password: "password123",
    token: "vaultis-auth-token-alex-98234",
    profile: {
      name: "Alex Morgan",
      email: "alex.morgan@vaultis.com",
      phone: "+1 (555) 234-5678",
      address: "100 Bel Air Rd, Los Angeles, CA 90077",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      tier: "Preferred Rewards Platinum"
    },
    accounts: {
      routingNumber: "121000358",
      checking: { accountNumber: "982341098", balance: 18450.20 },
      savings: { accountNumber: "982341099", balance: 42100.50 },
      creditCard: { accountNumber: "4000 1234 5678 9820", balance: -1240.00, limit: 25000.00 }
    },
    cardFrozen: false,
    alerts: [
      { id: "ALT-101", title: "Security Login Alert", message: "Successful sign-in from Chrome on Windows 10.", date: "2026-10-28", time: "09:40 AM", type: "email" },
      { id: "ALT-102", title: "Direct Deposit Notice", message: "Employer Payroll deposit of $4,200.00 posted.", date: "2026-10-28", time: "09:41 AM", type: "sms" }
    ],
    transactions: [
      { id: "TX-801", title: "Direct Deposit - Employer Payroll", category: "Income", amount: 4200.00, type: "credit", account: "checking", date: "2026-10-28", time: "09:41 AM" }
    ]
  }
};

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Unauthorized." });
  const token = authHeader.replace("Bearer ", "");
  const user = Object.values(userDatabase).find(u => u.token === token);
  if (!user) return res.status(401).json({ success: false, message: "Invalid session." });
  req.user = user;
  next();
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = userDatabase[username.toLowerCase()];
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  // Push automatic security login alert
  const now = new Date();
  user.alerts.unshift({
    id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
    title: "Security Alert: Successful Sign-In",
    message: `Account logged into from Web Dashboard at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "email"
  });

  res.json({ success: true, token: user.token, name: user.profile.name });
});

app.post('/api/signup', (req, res) => {
  const { username, password, name, avatarUrl, email, phone, address } = req.body;
  const cleanUser = username.toLowerCase().trim();

  if (!cleanUser || !password || !name) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }
  if (userDatabase[cleanUser]) {
    return res.status(400).json({ success: false, message: "Username already exists. Please sign in." });
  }

  const token = `vaultis-auth-token-${cleanUser}-${Math.floor(1000 + Math.random() * 9000)}`;
  const chkAcc = Math.floor(100000000 + Math.random() * 900000000).toString();
  const savAcc = Math.floor(100000000 + Math.random() * 900000000).toString();
  const now = new Date();

  userDatabase[cleanUser] = {
    username: cleanUser,
    password: password,
    token: token,
    profile: {
      name: name,
      email: email || `${cleanUser}@vaultis.com`,
      phone: phone || "+1 (555) 892-1104",
      address: address || "123 Financial Way, Suite 400, New York, NY 10005",
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      tier: "Vaultis Preferred Rewards"
    },
    accounts: {
      routingNumber: "121000358",
      checking: { accountNumber: chkAcc, balance: 2500.00 },
      savings: { accountNumber: savAcc, balance: 10000.00 },
      creditCard: { accountNumber: "4000 9876 5432 1098", balance: 0.00, limit: 15000.00 }
    },
    cardFrozen: false,
    alerts: [
      { id: "ALT-001", title: "Welcome to Vaultis Bank", message: "Your FDIC-insured account has been successfully established.", date: now.toISOString().split('T')[0], time: "12:00 PM", type: "email" }
    ],
    transactions: [
      { id: "TX-NEW", title: "Welcome Opening Deposit", category: "Opening", amount: 2500.00, type: "credit", account: "checking", date: now.toISOString().split('T')[0], time: "12:00 PM" }
    ]
  };

  res.json({ success: true, token: token, message: "Account created successfully!" });
});

app.get('/api/account', authenticateUser, (req, res) => {
  res.json({
    success: true,
    data: {
      profile: req.user.profile,
      accounts: req.user.accounts,
      cardFrozen: req.user.cardFrozen,
      alerts: req.user.alerts || [],
      transactions: req.user.transactions
    },
    limits: bankConfig
  });
});

app.post('/api/transfer', authenticateUser, (req, res) => {
  if (bankConfig.accountLocked) return res.status(403).json({ success: false, message: "Accounts frozen by administration." });
  const { fromAccount, recipient, amount, transferMethod } = req.body;
  const numAmount = parseFloat(amount);

  if (!fromAccount || !recipient || isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid transfer parameters." });
  }

  const sourceAcc = req.user.accounts[fromAccount];
  if (!sourceAcc || numAmount > sourceAcc.balance) {
    return res.status(400).json({ success: false, message: "Insufficient available funds." });
  }

  sourceAcc.balance -= numAmount;
  if (fromAccount === 'checking' && recipient === 'savings') req.user.accounts.savings.balance += numAmount;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toISOString().split('T')[0];

  const newTx = {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `${transferMethod ? transferMethod.toUpperCase() : 'ACH'} Transfer to ${recipient}`,
    category: "Transfer",
    amount: numAmount,
    type: "debit",
    account: fromAccount,
    date: dateStr,
    time: timeStr
  };

  req.user.transactions.unshift(newTx);

  // Push SMS/Email security notice
  req.user.alerts.unshift({
    id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
    title: "Outflow Transfer Alert",
    message: `$${numAmount.toFixed(2)} transfer initiated via ${transferMethod ? transferMethod.toUpperCase() : 'ACH'} to ${recipient}.`,
    date: dateStr,
    time: timeStr,
    type: "sms"
  });

  res.json({ success: true, message: `Successfully transferred $${numAmount.toFixed(2)}.`, accounts: req.user.accounts });
});

app.post('/api/card/freeze', authenticateUser, (req, res) => {
  req.user.cardFrozen = !req.user.cardFrozen;
  const now = new Date();
  req.user.alerts.unshift({
    id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
    title: "Debit Card Status Change",
    message: `Digital Debit Card was ${req.user.cardFrozen ? 'LOCKED' : 'UNLOCKED'} by cardholder.`,
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "sms"
  });
  res.json({ success: true, cardFrozen: req.user.cardFrozen });
});

app.post('/api/admin/transaction', (req, res) => {
  const { username, accountType, amount, type, title, date, time } = req.body;
  const targetUser = userDatabase[(username || "alex").toLowerCase()];
  if (!targetUser) return res.status(404).json({ success: false, message: "User account not found." });

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return res.status(400).json({ success: false, message: "Invalid amount." });

  const accKey = accountType === "savings" ? "savings" : "checking";

  if (type === 'credit') {
    targetUser.accounts[accKey].balance += numAmount;
  } else {
    targetUser.accounts[accKey].balance -= numAmount;
  }

  const customTx = {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    title: title || "Master Admin Adjustment",
    category: "Admin Operation",
    amount: Math.abs(numAmount),
    type: type || "credit",
    account: accKey,
    date: date || new Date().toISOString().split('T')[0],
    time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  targetUser.transactions.unshift(customTx);

  if (!targetUser.alerts) targetUser.alerts = [];
  targetUser.alerts.unshift({
    id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
    title: "Account Deposit / Withdrawal Alert",
    message: `[${type.toUpperCase()}] $${Math.abs(numAmount).toFixed(2)} posted to your ${accKey} account: "${customTx.title}".`,
    date: customTx.date,
    time: customTx.time,
    type: "email"
  });

  res.json({ success: true, message: `Posted [${customTx.type.toUpperCase()}] $${Math.abs(numAmount).toFixed(2)} to ${accKey}.`, transaction: customTx });
});

app.listen(PORT, () => {
  console.log(`Vaultis Bank BoA Core API running on http://localhost:${PORT}`);
});