import React from 'react';
import { motion, useReducedMotion } from "framer-motion";

export function FadeIn(props: React.PropsWithChildren<{ delay?: number; className?: string }>) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={props.className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: props.delay ?? 0 }}
    >
      {props.children}
    </motion.div>
  );
}