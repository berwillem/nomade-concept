import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Position motion values starting offscreen
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring options for organic trailing lag effect
  const springConfig = { stiffness: 250, damping: 25, mass: 0.4 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if the device is mobile/tablet
    const checkMobile = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setIsMobile(true);
        document.body.classList.remove('custom-cursor-active');
      } else {
        setIsMobile(false);
        document.body.classList.add('custom-cursor-active');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (window.matchMedia("(max-width: 768px)").matches) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input[type="submit"]') ||
        target.closest('input[type="button"]') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive') ||
        target.classList.contains('interactive');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile) return null;

  return (
    <>
      {/* Subtle Backlight Glow */}
      <motion.div
        className="cursor-glow"
        style={{
          x: ringX,
          y: ringY,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.2 } }}
      />
      {/* Outer Spring Ring */}
      <motion.div
        className={`cursor-ring ${isHovering ? 'hovering' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          x: ringX,
          y: ringY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isClicked ? 0.85 : isHovering ? 1.6 : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 350, damping: 20 },
          opacity: { duration: 0.2 }
        }}
      />
      {/* Inner Precision Dot */}
      <motion.div
        className={`cursor-dot ${isHovering ? 'hovering' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isClicked ? 0.7 : isHovering ? 0 : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 450, damping: 25 },
          opacity: { duration: 0.2 }
        }}
      />
    </>
  );
};

export default CustomCursor;
