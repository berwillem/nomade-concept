import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/logo.jpeg';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { t, i18n } = useTranslation();
  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.contact'), path: '/contact' },
  ];
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Nomade Concept" className="logo" />
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* Language Toggle */}
          <button className="lang-toggle btn btn-outline" onClick={toggleLanguage}>
            {i18n.language === 'fr' ? 'EN' : 'FR'}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav glass">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
