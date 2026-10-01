import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter component
 * Animates numbers when scrolled into view, rolls/toggles up dynamically, then fixes on the final value.
 *
 * @param {number|string} end - Target number to count up to
 * @param {number|string} start - Starting number (default: 0)
 * @param {number} duration - Animation duration in seconds (default: 1.8)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @param {string} prefix - Text/Symbol before number (e.g., '৳')
 * @param {string} suffix - Text/Symbol after number (e.g., 'K+', '%', '+')
 * @param {string} className - Additional CSS classes
 * @param {function} formattingFn - Optional custom formatting function
 */
export default function AnimatedCounter({
  end = 0,
  start = 0,
  duration = 1.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formattingFn = null
}) {
  const [count, setCount] = useState(Number(start) || 0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef(null);

  const numericTarget = Number(typeof end === 'string' ? end.replace(/[^0-9.-]+/g, '') : end) || 0;
  const numericStart = Number(typeof start === 'string' ? start.replace(/[^0-9.-]+/g, '') : start) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasTriggered(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    if (!hasTriggered) return;

    let startTime = null;
    let animationFrameId = null;
    const durationMs = Math.max(duration * 1000, 400);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / durationMs, 1);

      // Smooth Ease-Out Exponential curve: fast initial acceleration, ultra-smooth landing
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = numericStart + (numericTarget - numericStart) * easeOutExpo;

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(numericTarget); // Fixed precisely on the final target
        setIsFinished(true);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [hasTriggered, numericTarget, numericStart, duration]);

  const formatDisplay = (num) => {
    if (formattingFn) return formattingFn(num);
    const fixedNum = Number(num).toFixed(decimals);
    const parts = fixedNum.split('.');
    parts[0] = Number(parts[0]).toLocaleString();
    return parts.join('.');
  };

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums transition-all duration-300 ${
        isFinished ? 'opacity-100 scale-100' : 'opacity-95'
      } ${className}`}
    >
      {prefix}
      {formatDisplay(count)}
      {suffix}
    </span>
  );
}

