'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 1. MAGNET COMPONENT
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}: MagnetProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState(inactiveTransition);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // Distance from mouse to center of the element
      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Check if cursor is within padding distance of the element
      if (distance < padding) {
        setTransition(activeTransition);
        // Strength factor determines how far the element moves
        setTransform({
          x: distanceX / strength,
          y: distanceY / strength,
        });
      } else {
        setTransition(inactiveTransition);
        setTransform({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

// 2. ANIMATED TEXT (Scroll Reveal Character by Character)
interface AnimatedTextProps {
  text: string;
  className?: string;
  highlightClass?: string;
}

export function AnimatedText({ text, className = '', highlightClass = 'text-[#D7E2EA]' }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');
  const total = chars.length;

  return (
    <p ref={containerRef} className={className}>
      {chars.map((char, index) => {
        const start = index / total;
        const end = (index + 1) / total;
        return (
          <Char
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
            highlightClass={highlightClass}
          />
        );
      })}
    </p>
  );
}

interface CharProps {
  char: string;
  progress: any;
  range: [number, number];
  highlightClass?: string;
}

function Char({ char, progress, range, highlightClass }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  // Use non-breaking space for layout
  const displayChar = char === ' ' ? '\u00A0' : char;

  return (
    <span className="relative inline-block select-none">
      <span className="opacity-20">{displayChar}</span>
      <motion.span
        style={{ opacity }}
        className={`absolute left-0 top-0 ${highlightClass}`}
      >
        {displayChar}
      </motion.span>
    </span>
  );
}

// 3. FADE IN ANIMATION WRAPPER
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
}: FadeInProps) {
  // Use standard framer-motion components dynamically
  const Component = (motion as any)[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

// 4. CONTACT BUTTON
interface ContactButtonProps {
  onClick?: () => void;
  label?: string;
}

export function ContactButton({ onClick, label = 'Contact Me' }: ContactButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full select-none text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform active:scale-95 duration-150 cursor-pointer"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </button>
  );
}

// 5. LIVE PROJECT BUTTON
interface LiveProjectButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export function LiveProjectButton({ onClick, label = 'Live Project', disabled = false }: LiveProjectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {label}
    </button>
  );
}
