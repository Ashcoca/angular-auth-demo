// Auth stub server — Express + jsonwebtoken
// Run: node server/index.js  (from the auth-demo folder)
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = 3000;
const SECRET = 'demo-secret-change-me';

const app = express();

app.use(cors());

/* Quick aside
app.use(cors());

// app.use(cors()) uses an external library to allow all 
// origins and methods by default

VS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
}

// We built custom middleware manually restricts access to a 
// specific origin (http://localhost:4200) and specific HTTP methods 
// without requiring any extra dependencies.

VS

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// The above is the best of both worlds
// If you already have the Express cors middleware installed, 
// you can get the exact same strict behavior as your custom snippet 
// by passing a configuration object to cors()

*/



app.use(express.json());

// Hard-coded demo user — a real app would query a database.
const DEMO_USER = { email: 'ash@demo.dev', password: 'password123' };

app.post('/api/login', (req, res) => {
  const { email, password } = req.body ?? {};

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // The jwt payload is the "key" — who you are, plus expiry.
  const token = jwt.sign({ sub: '1', email }, SECRET, { expiresIn: '1h' });

  res.json({ token });
});

app.get('/api/me', (req, res) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    res.json({ email: payload.email, issuedAt: new Date(payload.iat * 1000).toISOString() });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth stub listening on http://localhost:${PORT}`);
});
