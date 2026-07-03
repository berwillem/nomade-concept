import { motion } from 'framer-motion';

const SectionWrapper = ({ children, className = '', id = '' }) => {
  return (
    <motion.section
      id={id}
      className={`py-20 ${className}`}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
        delay: 0.1
      }}
      style={{ padding: '5rem 0' }}
    >
      <div className="container">
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;
