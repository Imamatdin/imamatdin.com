import { C } from '../expressions';
import type { Expression } from '../expressions';
import { Eye } from './Eye';

interface HeadProps {
  ex: Expression;
  blink: boolean;
  pupil: { x: number; y: number };
  asleep: boolean;
  animate: boolean;
}

export function Head({ ex, blink, pupil, asleep, animate }: HeadProps) {
  const mouth =
    ex.mouth.shape === 'frown' ? (
      <path
        d={`M ${44 - ex.mouth.w / 2} ${ex.mouth.y + ex.mouth.h} Q 44 ${ex.mouth.y - 1} ${
          44 + ex.mouth.w / 2
        } ${ex.mouth.y + ex.mouth.h}`}
        stroke={ex.led}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity=".85"
      />
    ) : (
      <rect
        x={44 - ex.mouth.w / 2}
        y={ex.mouth.y}
        width={ex.mouth.w}
        height={ex.mouth.h}
        rx="1.5"
        fill={ex.led}
        opacity=".85"
      />
    );

  return (
    <>
      {/* antenna — the LED is the mood indicator */}
      <rect x="42" y="2" width="4" height="10" fill={C.subtle} />
      <circle cx="44" cy="4" r="4" fill={ex.led}>
        {animate && !asleep && (
          <animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite" />
        )}
      </circle>

      <rect x="18" y="12" width="52" height="38" rx="8" fill={C.shell} stroke={C.outline} strokeWidth="2" />
      <rect x="24" y="18" width="40" height="26" rx="5" fill={C.screen} />

      <Eye cx={35} ex={ex} blink={blink} pupil={pupil} />
      <Eye cx={53} ex={ex} blink={blink} pupil={pupil} />
      {mouth}

      {/* ears */}
      <rect x="12" y="24" width="6" height="14" rx="3" fill={C.outline} />
      <rect x="70" y="24" width="6" height="14" rx="3" fill={C.outline} />
    </>
  );
}
