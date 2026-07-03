import nodemailer from 'nodemailer';
import { Router } from 'express';

const router = Router();

// ─── Créer le transporter Nodemailer ──────────────────────────────────────────
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (pas ton vrai mot de passe)
  },
});

// ─── POST /api/contact ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation basique
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }

  try {
    const transporter = createTransporter();

    // ── Email reçu par l'agence ──────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Site Nomade Concept" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #da0813, #8b0000); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.8rem; letter-spacing: -1px;">Nouveau message</h1>
            <p style="margin: 8px 0 0; opacity: 0.85;">Via le formulaire de contact</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #999; width: 120px;">Nom</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #999;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08);"><a href="mailto:${email}" style="color: #da0813;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #999;">Sujet</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 24px;">
              <p style="color: #999; margin-bottom: 8px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Message</p>
              <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #da0813; padding: 16px; border-radius: 4px; line-height: 1.7;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div style="padding: 20px 32px; background: rgba(255,255,255,0.02); text-align: center; color: #666; font-size: 0.8rem;">
            Nomade Concept · Birkhadem, Alger
          </div>
        </div>
      `,
    });

    // ── Email de confirmation envoyé au client ───────────────────────────────
    await transporter.sendMail({
      from: `"Nomade Concept" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Nous avons bien reçu votre message — Nomade Concept`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #da0813, #8b0000); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.8rem; letter-spacing: -1px;">Message reçu ✓</h1>
          </div>
          <div style="padding: 32px;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p style="color: #ccc; line-height: 1.7;">Merci de nous avoir contactés. Nous avons bien reçu votre message concernant <strong>"${subject}"</strong> et nous vous répondrons dans les plus brefs délais.</p>
            <p style="color: #ccc; line-height: 1.7;">En attendant, n'hésitez pas à nous joindre directement :</p>
            <div style="margin: 24px 0; padding: 20px; background: rgba(255,255,255,0.04); border-radius: 8px;">
              <p style="margin: 4px 0;">📞 0551 374 700 / 0771 360 690</p>
              <p style="margin: 4px 0;">📞 0540 35 38 33</p>
              <p style="margin: 4px 0;">📍 Coop Ennahda Lot N°04, Bis B — Birkhadem, Alger</p>
            </div>
            <p style="color: #999; font-size: 0.9rem;">L'équipe Nomade Concept</p>
          </div>
        </div>
      `,
    });

    console.log(`[Contact] Message envoyé de ${email} (${name}) — Sujet: ${subject}`);
    res.json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (err) {
    console.error('[Contact] Erreur envoi email:', err.message);
    res.status(500).json({ error: 'Impossible d\'envoyer le message. Veuillez réessayer.' });
  }
});

export default router;
