import { useEffect, useState } from 'react';

export function Signature({ size = 40 }: { size?: number }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Only animate once per session
    if (!sessionStorage.getItem('signature-animated')) {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        setShouldAnimate(true);
        sessionStorage.setItem('signature-animated', 'true');
      }
    }
  }, []);

  const height = size;
  const width = size * 1.5; // Aspect ratio for "IM"

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IM signature"
      style={{ display: 'block' }}
    >
      {/* Letter I */}
      <path
        d="M 5 5 L 5 35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={shouldAnimate ? 'signature-path' : ''}
        style={shouldAnimate ? {
          strokeDasharray: 50,
          strokeDashoffset: 50,
          animation: 'draw 0.8s ease-out forwards',
        } : {}}
      />

      {/* Letter M - left stroke */}
      <path
        d="M 15 35 L 15 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={shouldAnimate ? 'signature-path' : ''}
        style={shouldAnimate ? {
          strokeDasharray: 50,
          strokeDashoffset: 50,
          animation: 'draw 0.8s ease-out 0.2s forwards',
        } : {}}
      />

      {/* Letter M - diagonal down */}
      <path
        d="M 15 5 L 30 25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={shouldAnimate ? 'signature-path' : ''}
        style={shouldAnimate ? {
          strokeDasharray: 35,
          strokeDashoffset: 35,
          animation: 'draw 0.6s ease-out 0.5s forwards',
        } : {}}
      />

      {/* Letter M - diagonal up */}
      <path
        d="M 30 25 L 45 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={shouldAnimate ? 'signature-path' : ''}
        style={shouldAnimate ? {
          strokeDasharray: 35,
          strokeDashoffset: 35,
          animation: 'draw 0.6s ease-out 0.7s forwards',
        } : {}}
      />

      {/* Letter M - right stroke */}
      <path
        d="M 45 5 L 45 35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={shouldAnimate ? 'signature-path' : ''}
        style={shouldAnimate ? {
          strokeDasharray: 50,
          strokeDashoffset: 50,
          animation: 'draw 0.8s ease-out 0.9s forwards',
        } : {}}
      />
    </svg>
  );
}
