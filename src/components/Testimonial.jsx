import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './Testimonial.css';

const Testimonial = ({ quote, author, role, company, delay = 0 }) => {
  return (
    <motion.div 
      className="testimonial-card glass"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="star-icon" fill="currentColor" />
        ))}
      </div>
      <p className="quote">"{quote}"</p>
      <div className="author-info">
        <div className="author-details">
          <h5 className="author-name">{author}</h5>
          <p className="author-role">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonial;
