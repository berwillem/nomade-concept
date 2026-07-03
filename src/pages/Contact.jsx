import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './Contact.css';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi.");
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header text-center">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="page-title" dangerouslySetInnerHTML={{ __html: t('contact.title') }}></h1>
            <p className="page-subtitle max-w-2xl mx-auto">{t('contact.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <SectionWrapper id="contact-content">
        <div className="contact-grid">
          <motion.div 
            className="contact-info glass"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-4">Contact Information</h3>
            <p className="text-muted mb-4">Remplissez le formulaire et notre équipe vous répondra dans les 24h.</p>
            
            <div className="info-items">
              <div className="info-item">
                <div className="icon-circle glass-red">
                  <Phone size={20} color="#da0813" />
                </div>
                <div>
                  <h4>{t('contact.phone_title')}</h4>
                  <p>0551 374 700 / 0771 360 690</p>
                  <p>0540 35 38 33</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon-circle glass-red">
                  <Mail size={20} color="#da0813" />
                </div>
                <div>
                  <h4>{t('contact.email_title')}</h4>
                  <p>creagocontact@gmail.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon-circle glass-red">
                  <MapPin size={20} color="#da0813" />
                </div>
                <div>
                  <h4>{t('contact.address_title')}</h4>
                  <p>Coop Ennahda Lot N°04, Bis B<br />N° 05, Birkhadem-Alger</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="contact-form-wrapper glass"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  className="form-feedback form-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CheckCircle size={52} color="#22c55e" strokeWidth={1.5} />
                  <h3>Message envoyé !</h3>
                  <p>Merci, nous vous répondrons dans les plus brefs délais. Un email de confirmation vous a été envoyé.</p>
                  <button
                    className="btn btn-outline mt-4"
                    onClick={() => setStatus('idle')}
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="form-group">
                    <label htmlFor="name">{t('contact.form_name')}</label>
                    <input
                      type="text" id="name"
                      placeholder="Votre nom complet"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">{t('contact.form_email')}</label>
                    <input
                      type="email" id="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">{t('contact.form_subject')}</label>
                    <input
                      type="text" id="subject"
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">{t('contact.form_message')}</label>
                    <textarea
                      id="message" rows="5"
                      placeholder="Décrivez votre projet..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    ></textarea>
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        className="form-error-banner"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={16} />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full submit-btn"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <><Loader size={18} className="ml-2 spin-icon" /> Envoi en cours...</>
                    ) : (
                      <>{t('contact.form_submit')} <Send size={18} className="ml-2" /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Map iframe */}
        <motion.div 
          className="contact-map"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.020573437244!2d3.0327!3d36.7238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb3e2b2b2b2b3%3A0x0!2sBirkhadem%2C%20Alger%2C%20Algeria!5e0!3m2!1sfr!2sdz!4v1700000000000!5m2!1sfr!2sdz" 
            width="100%" 
            height="400" 
            style={{ border: 0, borderRadius: '1rem', marginTop: '3rem', filter: 'grayscale(100%) invert(90%) contrast(1.2)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </SectionWrapper>
    </div>
  );
};

export default Contact;
