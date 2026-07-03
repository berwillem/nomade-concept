import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import { Printer, Eye, Car, PenTool, TrendingUp, Camera, Monitor, Video, Box, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Services.css';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: "print-web",
      icon: <Printer size={40} color="#da0813" />,
      title: t('services.print_web'),
      desc: t('services.print_web_desc')
    },
    {
      id: "identity",
      icon: <Eye size={40} color="#da0813" />,
      title: t('services.identity'),
      desc: t('services.identity_desc')
    },
    {
      id: "covering",
      icon: <Car size={40} color="#da0813" />,
      title: t('services.covering'),
      desc: t('services.covering_desc')
    },
    {
      id: "illustration",
      icon: <PenTool size={40} color="#da0813" />,
      title: t('services.illustration'),
      desc: t('services.illustration_desc')
    },
    {
      id: "marketing",
      icon: <TrendingUp size={40} color="#da0813" />,
      title: t('services.marketing'),
      desc: t('services.marketing_desc')
    },
    {
      id: "photo",
      icon: <Camera size={40} color="#da0813" />,
      title: t('services.photo'),
      desc: t('services.photo_desc')
    },
    {
      id: "webdesign",
      icon: <Monitor size={40} color="#da0813" />,
      title: t('services.webdesign'),
      desc: t('services.webdesign_desc')
    },
    {
      id: "video",
      icon: <Video size={40} color="#da0813" />,
      title: t('services.video'),
      desc: t('services.video_desc')
    },
    {
      id: "3d",
      icon: <Box size={40} color="#da0813" />,
      title: t('services.three_d'),
      desc: t('services.three_d_desc')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="services-page">
      <section className="page-header text-center">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="page-title" dangerouslySetInnerHTML={{ __html: t('services.title') }}></h1>
            <p className="page-subtitle max-w-2xl mx-auto">{t('services.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <SectionWrapper id="all-services">
        <motion.div 
          className="services-grid-large"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, idx) => (
            <motion.div key={idx} className="service-card-premium glass" variants={itemVariants} whileHover={{ y: -15, scale: 1.02 }}>
              <div className="service-card-inner">
                <div className="icon-wrapper glass-red">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <div className="service-action">
                  <span className="learn-more">
                    Learn More <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>

      {/* Modern CTA Section */}
      <SectionWrapper id="services-cta" className="bg-darker">
        <motion.div 
          className="cta-banner glass"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-content text-center">
            <h2 dangerouslySetInnerHTML={{ __html: t('services.cta_title') }}></h2>
            <p>{t('services.cta_subtitle')}</p>
            <div className="mt-4">
              <Link to="/contact" className="btn btn-primary cta-btn">
                {t('services.contact_us')}
              </Link>
            </div>
          </div>
          <div className="cta-glow"></div>
        </motion.div>
      </SectionWrapper>
    </div>
  );
};

export default Services;
