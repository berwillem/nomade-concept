import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import contactRouter from './routes/contact.js';
import stripeRouter from './routes/stripe.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4173',  // Vite preview
    process.env.FRONTEND_URL  // URL de production (optionnel)
  ].filter(Boolean),
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRouter);
app.use('/api/stripe', stripeRouter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Serveur Nomade Concept démarré sur http://localhost:${PORT}`);
  console.log(`   ✅ /api/health`);
  console.log(`   ✅ /api/contact`);
  console.log(`   ✅ /api/stripe/create-payment-intent\n`);
});
