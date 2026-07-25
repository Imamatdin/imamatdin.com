import { C } from '../expressions';
import type { Expression } from '../expressions';

interface DjKitProps {
  ex: Expression;
  animate: boolean;
}

/**
 * Headphones, a laptop deck, and an equaliser. Every fill is one of the four
 * theme variables, so this goes green in konami mode like everything else —
 * which is the only place it ever appears.
 */
export function DjKit({ ex, animate }: DjKitProps) {
  const bars = [
    { x: 20, base: 4, dur: '0.42s' },
    { x: 26, base: 8, dur: '0.31s' },
    { x: 32, base: 5, dur: '0.53s' },
    { x: 56, base: 7, dur: '0.37s' },
    { x: 62, base: 4, dur: '0.47s' },
    { x: 68, base: 9, dur: '0.29s' },
  ];

  return (
    <>
      {/* headphones: band over the head, cups over the ears */}
      <path
        d="M 18 26 Q 44 2 70 26"
        stroke={ex.led}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="9" y="23" width="9" height="17" rx="4" fill={ex.led} />
      <rect x="70" y="23" width="9" height="17" rx="4" fill={ex.led} />

      {/* the deck */}
      <rect x="22" y="76" width="44" height="4" rx="1" fill={C.outline} />
      <rect x="26" y="64" width="36" height="13" rx="2" fill={C.screen} stroke={C.outline} strokeWidth="1.5" />
      <circle cx="36" cy="70" r="3" fill={ex.led} opacity=".9">
        {animate && (
          <animate attributeName="opacity" values=".9;.35;.9" dur="0.47s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="52" cy="70" r="3" fill={ex.led} opacity=".9">
        {animate && (
          <animate attributeName="opacity" values=".35;.9;.35" dur="0.47s" repeatCount="indefinite" />
        )}
      </circle>

      {/* equaliser — static at a readable height when motion is reduced */}
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={92 - bar.base}
          width="4"
          height={bar.base}
          fill={ex.led}
          opacity=".65"
        >
          {animate && (
            <>
              <animate
                attributeName="height"
                values={`${bar.base};${bar.base + 9};${bar.base}`}
                dur={bar.dur}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values={`${92 - bar.base};${92 - bar.base - 9};${92 - bar.base}`}
                dur={bar.dur}
                repeatCount="indefinite"
              />
            </>
          )}
        </rect>
      ))}
    </>
  );
}
