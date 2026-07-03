import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../components/SectionWrapper';
import Testimonial from '../components/Testimonial';
import './Home.css';
import { ArrowRight, Code, PenTool, TrendingUp, ExternalLink, Loader } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';
import { useTranslation } from 'react-i18next';

const defaultTopProjects = [
  { id: 'd1', title: 'Fintech Dashboard', category: 'UI/UX', description: 'UI/UX Design & Development', image: '' },
  { id: 'd2', title: 'E-Commerce Platform', category: 'Web Design', description: 'Web Development & SEO', image: '' },
];

const Home = () => {
  const { t } = useTranslation();
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        const res = await fetch('/api/stripe/projects');
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        
        // On garde uniquement les projets marqués isTop: true
        const filtered = data.filter(p => p.isTop);
        // Si aucun n'est isTop ou si le tableau est vide, on prend les 2 premiers de la liste globale
        // ou sinon nos defaults
        if (filtered.length > 0) {
          setTopProjects(filtered);
        } else if (data.length > 0) {
          setTopProjects(data.slice(0, 2));
        } else {
          setTopProjects(defaultTopProjects);
        }
      } catch (err) {
        console.warn('Stripe non configuré ou hors ligne, affichage des projets locaux.', err);
        setTopProjects(defaultTopProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProjects();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('home.hero_title') }}></h1>
            <p className="hero-subtitle">
              {t('home.hero_subtitle')}
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {t('home.start_project')}
              </Link>
              <a href="/portfolio.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {t('home.view_portfolio')}
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract 3D background */}
        <div className="three-bg">
          <ThreeScene />
        </div>
      </section>

      {/* Services Overview Section */}
      <SectionWrapper id="services-overview">
        <div className="section-header text-center">
          <h2 className="section-title">{t('home.expertise_title')}</h2>
          <p className="section-desc">{t('home.expertise_desc')}</p>
        </div>
        
        <div className="services-grid">
          <motion.div className="service-card glass" whileHover={{ y: -10 }}>
            <div className="icon-wrapper glass-red">
              <PenTool size={32} color="#da0813" />
            </div>
            <h3>{t('home.service_uiux')}</h3>
            <p>{t('home.service_uiux_desc')}</p>
            <Link to="/services" className="service-link">{t('home.learn_more')} <ArrowRight size={16} /></Link>
          </motion.div>
          
          <motion.div className="service-card glass" whileHover={{ y: -10 }}>
            <div className="icon-wrapper glass-red">
              <Code size={32} color="#da0813" />
            </div>
            <h3>{t('home.service_web')}</h3>
            <p>{t('home.service_web_desc')}</p>
            <Link to="/services" className="service-link">{t('home.learn_more')} <ArrowRight size={16} /></Link>
          </motion.div>
          
          <motion.div className="service-card glass" whileHover={{ y: -10 }}>
            <div className="icon-wrapper glass-red">
              <TrendingUp size={32} color="#da0813" />
            </div>
            <h3>{t('home.service_marketing')}</h3>
            <p>{t('home.service_marketing_desc')}</p>
            <Link to="/services" className="service-link">{t('home.learn_more')} <ArrowRight size={16} /></Link>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Top Projects Section */}
      <SectionWrapper id="top-projects" className="bg-darker">
        <div className="section-header text-center">
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('home.top_projects') }}></h2>
          <p className="section-desc">{t('home.top_projects_desc')}</p>
        </div>
        
        <div className="projects-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader className="spin-icon" size={24} color="#da0813" />
            </div>
          ) : (
            topProjects.map((project) => (
              <motion.div key={project.id} className="project-card glass" whileHover={{ y: -10 }}>
                <div className="project-image-wrapper" style={{ height: '250px', overflow: 'hidden', position: 'relative', borderRadius: '1rem 1rem 0 0' }}>
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div className="project-image-placeholder glass-red" style={{ height: '100%' }}>
                      <span className="text-muted">{project.title.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="project-info" style={{ padding: '1.5rem' }}>
                  <h3>{project.title}</h3>
                  <p>{project.description || project.category}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        <div className="text-center mt-4" style={{ marginTop: '3rem' }}>
          <Link to="/about#portfolio" className="btn btn-outline">
            {t('home.view_all_projects')} <ExternalLink size={18} className="ml-2" />
          </Link>
        </div>
      </SectionWrapper>

      {/* Testimonials Section */}
      <SectionWrapper id="testimonials" className="bg-darker">
        <div className="section-header text-center">
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('home.testimonials_title') }}></h2>
          <p className="section-desc">{t('home.testimonials_desc')}</p>
        </div>
        
        <div className="testimonials-grid">
          <Testimonial 
            quote="Nomade Concept completely transformed our online presence. Their attention to detail and innovative design approach helped us increase user engagement by over 150%."
            author="Sarah Jenkins"
            role="CMO"
            company="TechNova"
            delay={0.1}
          />
          <Testimonial 
            quote="Working with this team was a game-changer. They didn't just build a website; they created a digital experience that perfectly captures our brand essence."
            author="David Chen"
            role="Founder"
            company="Elevate Startup"
            delay={0.3}
          />
          <Testimonial 
            quote="The UI/UX expertise they bring to the table is unmatched. Our app's new interface is sleek, intuitive, and exactly what our users were asking for."
            author="Elena Rodriguez"
            role="Product Manager"
            company="Global Solutions"
            delay={0.5}
          />
        </div>
      </SectionWrapper>
      
      {/* CTA Section */}
      <SectionWrapper id="cta">
        <div className="cta-box glass text-center">
          <h2>{t('home.cta_title')}</h2>
          <p>{t('home.cta_subtitle')}</p>
          <Link to="/contact" className="btn btn-primary cta-btn">{t('home.get_in_touch')}</Link>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Home;
