import type { Expression } from '../expressions';

interface EyeProps {
  cx: number;
  ex: Expression;
  blink: boolean;
  pupil: { x: number; y: number };
}

/** The right eye sits past x=44, which is how `wink` knows which one to close. */
export function Eye({ cx, ex, blink, pupil }: EyeProps) {
  if (blink || ex.eye === 'half') {
    return (
      <rect
        x={cx - 4}
        y={ex.eye === 'half' ? 30 : 29}
        width="8"
        height="2.5"
        rx="1"
        fill={ex.led}
      />
    );
  }

  if (ex.eye === 'arc') {
    return (
      <path
        d={`M ${cx - 4.5} 31 Q ${cx} 25 ${cx + 4.5} 31`}
        stroke={ex.led}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  // Downturned outer corners — the whole difference between sad and neutral.
  if (ex.eye === 'droop') {
    const tilt = cx < 44 ? 1 : -1;
    return (
      <>
        <circle cx={cx} cy={31} r={ex.eyeR} fill={ex.led} />
        <path
          d={`M ${cx - 5} ${26 + tilt * 1.5} L ${cx + 5} ${26 - tilt * 1.5}`}
          stroke={ex.led}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (ex.eye === 'wink' && cx > 44) {
    return <rect x={cx - 4} y={29} width="8" height="2.5" rx="1" fill={ex.led} />;
  }

  const lift = ex.eye === 'up' ? -2.5 : 0;
  return <circle cx={cx + pupil.x} cy={30 + pupil.y + lift} r={ex.eyeR} fill={ex.led} />;
}
