import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2, Users, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';
import logo from '../assets/logo.jpeg';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer glass">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/">
              <img src={logo} alt="Nomade Concept" className="footer-logo" />
            </Link>
            <p className="footer-desc">
              {t('footer.desc')}
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><Globe size={20} /></a>
              <a href="#" className="social-link"><MessageCircle size={20} /></a>
              <a href="#" className="social-link"><Share2 size={20} /></a>
              <a href="#" className="social-link"><Users size={20} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.quick_links')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/services">{t('nav.services')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><a href="/portfolio.pdf" target="_blank" rel="noopener noreferrer">{t('nav.portfolio')}</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>Coop Ennahda Lot N°04, Bis B, N° 05, Birkhadem-Alger</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>0551 374 700 / 0771 360 690</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>0540 35 38 33</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>creagocontact@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Nomade Concept. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
