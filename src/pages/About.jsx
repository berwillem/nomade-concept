import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import './About.css';
import { ExternalLink, ShoppingCart, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AnimatedNumber = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const duration = 2000;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setDisplayValue(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

const defaultProjects = [
  { id: 'd1', title: 'Nova Bank App', category: 'UI/UX', description: 'Interface bancaire premium', image: '' },
  { id: 'd2', title: 'Eco Store', category: 'Web Design', description: 'Plateforme e-commerce écologique', image: '' },
  { id: 'd3', title: 'Lumina Branding', category: 'Branding', description: 'Charte graphique complète', image: '' },
  { id: 'd4', title: 'HealthTrack', category: 'UI/UX', description: 'Application de suivi santé', image: '' },
  { id: 'd5', title: 'Pulse Tech Site', category: 'Web Design', description: 'Site vitrine haute performance', image: '' },
  { id: 'd6', title: 'Apex Identity', category: 'Branding', description: 'Design logo et packaging', image: '' },
];

const About = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [checkoutLoadingId, setCheckoutLoadingId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/stripe/projects');
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        // Si aucun produit Stripe actif, on utilise nos placeholders par défaut
        setProjects(data.length > 0 ? data : defaultProjects);
      } catch (err) {
        console.warn('Stripe non configuré ou hors ligne, affichage des projets locaux.', err);
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCheckout = async (priceId) => {
    setCheckoutLoadingId(priceId);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe
      }
    } catch (err) {
      console.error('Erreur redirection Stripe Checkout', err);
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  // Liste unique des catégories présentes dans les projets
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <div className="about-page">
      {/* New Enhanced Page Header */}
      <section className="about-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="about-hero-content text-center"
          >
            <h1 className="about-title" dangerouslySetInnerHTML={{ __html: t('about.title') }}></h1>
            <p className="about-subtitle">
              {t('about.subtitle')}
            </p>
            <div className="about-scroll-indicator">
              <span>{t('about.scroll_discover')}</span>
              <div className="scroll-line"></div>
            </div>
          </motion.div>
        </div>
        <div className="about-bg-elements">
           <div className="about-circle circle-1"></div>
           <div className="about-circle circle-2"></div>
        </div>
      </section>

      {/* Story Section */}
      <SectionWrapper id="story" className="bg-darker">
        <div className="story-grid">
          <motion.div 
            className="story-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('about.origin_title') }}></h2>
            <p className="mb-4">
              {t('about.origin_p1')}
            </p>
            <p>
              {t('about.origin_p2')}
            </p>
          </motion.div>
          <motion.div 
            className="story-image glass"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
             {/* Abstract placeholder for agency image */}
             <div className="abstract-art"></div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Stats Section */}
      <SectionWrapper id="stats">
        <div className="stats-grid">
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3 className="text-gradient-red">
              +<AnimatedNumber value={13} />
            </h3>
            <p>{t('about.stats_years')}</p>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3 className="text-gradient-red">
              +<AnimatedNumber value={10} />
            </h3>
            <p>{t('about.stats_experts')}</p>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3 className="text-gradient-red">
              +<AnimatedNumber value={100} />
            </h3>
            <p>{t('about.stats_projects')}</p>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3 className="text-gradient-red">
              +<AnimatedNumber value={30} />
            </h3>
            <p>{t('about.stats_clients')}</p>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
            <h3 className="text-gradient-red">
              +<AnimatedNumber value={99} suffix="%" />
            </h3>
            <p>{t('about.stats_satisfaction')}</p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Full Portfolio Section */}
      <SectionWrapper id="portfolio" className="bg-darker">
        <div className="section-header text-center">
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('about.portfolio_title') }}></h2>
          <p className="section-desc">{t('about.portfolio_desc')}</p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery */}
        {loading ? (
          <div className="flex justify-center items-center py-20" style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader className="spin-icon" size={40} color="#da0813" />
          </div>
        ) : (
          <motion.div className="portfolio-gallery" layout>
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project) => (
                <motion.div 
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="portfolio-card glass"
                >
                  <div className="portfolio-img-wrapper" style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        className="portfolio-img"
                      />
                    ) : (
                      <div className="portfolio-img-placeholder glass-red" style={{ height: '100%' }}>
                        <span>{project.title.substring(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="portfolio-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{project.title}</h3>
                      {project.price && (
                        <span className="price-tag" style={{ color: '#da0813', fontWeight: 'bold' }}>
                          {project.price.amount} {project.price.currency}
                        </span>
                      )}
                    </div>
                    <p style={{ minHeight: '3em' }}>{project.description || project.category}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
                      <a href="/portfolio.pdf" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                        {t('about.view_case_study')} <ExternalLink size={16} className="ml-2" />
                      </a>
                      
                      {project.price && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          disabled={checkoutLoadingId === project.price.id}
                          onClick={() => handleCheckout(project.price.id)}
                        >
                          {checkoutLoadingId === project.price.id ? (
                            <Loader className="spin-icon" size={14} />
                          ) : (
                            <ShoppingCart size={14} />
                          )}
                          Commander
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default About;
