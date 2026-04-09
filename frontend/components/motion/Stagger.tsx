import React from 'react';
import { motion, useReducedMotion } from "framer-motion";

export function Stagger(props: React.PropsWithChildren<{ className?: string }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={props.className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? "show" : "show"}
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {props.children}
    </motion.div>
  );
}

export function StaggerItem(props: React.PropsWithChildren<{ className?: string }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={props.className}
      variants={{
        hidden: reduce ? {} : { opacity: 0, y: 14 },
        show: reduce ? {} : { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
      }}
    >
      {props.children}
    </motion.div>
  );
}