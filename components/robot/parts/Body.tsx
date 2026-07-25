import { C } from '../expressions';
import type { Expression } from '../expressions';

interface BodyProps {
  ex: Expression;
  asleep: boolean;
  animate: boolean;
}

export function Body({ ex, asleep, animate }: BodyProps) {
  return (
    <>
      <rect x="26" y="54" width="36" height="28" rx="7" fill={C.shell} stroke={C.outline} strokeWidth="2" />

      {/* chest light */}
      <circle cx="44" cy="66" r="5" fill={C.screen} stroke={ex.led} strokeWidth="1.5" />
      <circle cx="44" cy="66" r="2" fill={ex.led}>
        {animate && !asleep && (
          <animate attributeName="r" values="2;3;2" dur="2.2s" repeatCount="indefinite" />
        )}
      </circle>

      {/* thruster glow */}
      <ellipse cx="44" cy="90" rx="14" ry="4" fill={ex.led} opacity={asleep ? '.08' : '.25'}>
        {animate && !asleep && (
          <animate attributeName="rx" values="14;10;14" dur="3.2s" repeatCount="indefinite" />
        )}
      </ellipse>
    </>
  );
}
