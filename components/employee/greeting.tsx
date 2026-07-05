"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { getGreeting } from "@/lib/greeting";

interface GreetingProps {
  firstName: string;
}

export function Greeting({ firstName }: GreetingProps) {
  const [greeting] = useState(() => getGreeting());

  const nameLetters = firstName.split("");

  if (!greeting) {
    // avoids a flash of wrong/empty greeting before client hydration
    return <div className="h-10" />;
  }

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-3xl font-medium text-muted-foreground"
      >
        {greeting},
      </motion.span>

      <span className="text-2xl md:text-3xl font-semibold flex">
        {nameLetters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.3 + i * 0.04, // starts after greeting settles, cascades per letter
              ease: "easeOut",
            }}
            className="inline-block bg-linear-to-r from-foreground to-foreground/70 bg-clip-text"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>

      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3 + nameLetters.length * 0.04 + 0.1,
        }}
        className="text-2xl md:text-3xl"
        aria-hidden
      >
        👋
      </motion.span>
    </div>
  );
}
