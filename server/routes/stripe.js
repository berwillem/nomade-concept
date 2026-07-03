import Stripe from 'stripe';
import express, { Router } from 'express';

const router = Router();

// Stripe est initialisé à la première requête pour éviter l'erreur
// si la clé n'est pas encore configurée au démarrage
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY manquant dans .env');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
  });
};

// ─── GET /api/stripe/projects ────────────────────────────────────────────────
// Récupère les produits actifs depuis Stripe pour servir de catalogue de projets/services
router.get('/projects', async (req, res) => {
  try {
    const stripe = getStripe();
    // On liste les produits actifs et on inclut les détails de prix par défaut
    const productsResponse = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ['data.default_price'],
    });

    const projects = productsResponse.data.map(product => {
      const priceObj = product.default_price;
      return {
        id: product.id,
        title: product.name,
        description: product.description || '',
        image: product.images[0] || '', // Récupère la première image téléchargée
        category: product.metadata.category || 'Web Design', // Catégorie par défaut
        isTop: product.metadata.is_top === 'true', // Projet mis en avant
        price: priceObj ? {
          amount: priceObj.unit_amount / 100,
          currency: priceObj.currency.toUpperCase(),
          id: priceObj.id
        } : null
      };
    });

    res.json(projects);
  } catch (err) {
    console.error('[Stripe Projects] Erreur:', err.message);
    res.status(500).json({ error: 'Impossible de charger les projets.' });
  }
});

// ─── POST /api/stripe/create-checkout-session ─────────────────────────────────
// Crée une session Stripe Checkout pour un produit/service spécifique
router.post('/create-checkout-session', async (req, res) => {
  const { priceId, successUrl, cancelUrl } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: 'priceId requis pour Checkout.' });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || 'http://localhost:5173/contact?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'http://localhost:5173/about',
    });

    console.log(`[Stripe Checkout] Session créée: ${session.id}`);
    res.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe Checkout] Erreur:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/stripe/create-payment-intent ───────────────────────────────────
// Crée un PaymentIntent Stripe et retourne le client_secret au frontend
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'eur', description, metadata = {} } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Montant invalide (en centimes).' });
  }

  try {
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // en centimes (ex: 5000 = 50,00 €)
      currency,
      description: description || 'Prestation Nomade Concept',
      metadata: {
        source: 'nomade-concept-website',
        ...metadata,
      },
      automatic_payment_methods: { enabled: true },
    });

    console.log(`[Stripe] PaymentIntent créé: ${paymentIntent.id} — ${amount / 100} ${currency.toUpperCase()}`);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('[Stripe] Erreur:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/stripe/webhook ─────────────────────────────────────────────────
// Endpoint pour recevoir les événements Stripe (paiements confirmés, etc.)
// À enregistrer dans le dashboard Stripe : Developers > Webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('[Stripe Webhook] STRIPE_WEBHOOK_SECRET non configuré, webhook ignoré.');
    return res.json({ received: true });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature invalide:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(`[Stripe] ✅ Paiement réussi: ${event.data.object.id}`);
      // TODO: Envoyer un email de confirmation, mettre à jour la BDD, etc.
      break;
    case 'payment_intent.payment_failed':
      console.log(`[Stripe] ❌ Paiement échoué: ${event.data.object.id}`);
      break;
    default:
      console.log(`[Stripe Webhook] Événement non géré: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
