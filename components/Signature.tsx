import { useEffect, useState } from 'react';

export function Signature({ size = 16 }: { size?: number }) {
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

  const fontSize = size;

  return (
    <svg
      height={fontSize * 1.4}
      viewBox="0 0 280 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Imamatdin Sultaniyazov signature"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <text
        x="0"
        y="18"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="16"
        fontWeight="400"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="currentColor"
        className={shouldAnimate ? 'signature-text' : ''}
        style={shouldAnimate ? {
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
          fillOpacity: 0,
          animation: 'drawText 2.5s ease-out forwards',
        } : {}}
      >
        Imamatdin Sultaniyazov
      </text>

      <style>
        {`
          @keyframes drawText {
            0% {
              stroke-dashoffset: 1000;
              fill-opacity: 0;
            }
            70% {
              stroke-dashoffset: 0;
              fill-opacity: 0;
            }
            100% {
              stroke-dashoffset: 0;
              fill-opacity: 1;
            }
          }
        `}
      </style>
    </svg>
  );
}
