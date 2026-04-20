"use client";
import { motion, Variants } from "framer-motion";

// Dinagdagan natin ang types para suportado ang lahat ng effects na napag-usapan
type Direction = "up" | "down" | "left" | "right" | "fade" | "bounce";

export const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = "bounce" // Ginawa nating default ang bounce para sa buttons/sections
}: { 
  children: React.ReactNode, 
  delay?: number,
  direction?: Direction 
}) => {

  const variants: Variants = {
    initial: {
      opacity: 0,
      // Displacement logic
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : direction === "bounce" ? 70 : 0,
      // Zoom effect pag bounce
      scale: direction === "bounce" ? 0.9 : 1,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: delay,
        // ETO ANG PINAGKAiba: Spring transition para sa bounce, Tween para sa normal slides
        type: direction === "bounce" ? "spring" : "tween",
        // Spring settings (para sa Bounce Up effect)
        stiffness: direction === "bounce" ? 150 : undefined,
        damping: direction === "bounce" ? 12 : undefined,
        mass: direction === "bounce" ? 1 : undefined,
        // Normal settings (para sa Fade/Slide)
        duration: direction === "bounce" ? undefined : 0.8,
        ease: direction === "bounce" ? undefined : ([0.22, 1, 0.36, 1] as const),
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};