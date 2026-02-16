import { motion } from 'framer-motion';

const Reveal = ({ children, delay = 0, y = 20, className = '', once = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.35 }}
      transition={{ duration: 0.65, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
