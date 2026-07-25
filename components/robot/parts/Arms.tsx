import { C } from '../expressions';
import type { Expression } from '../expressions';

interface ArmsProps {
  ex: Expression;
  animate: boolean;
}

export function Arms({ ex, animate }: ArmsProps) {
  const transition = animate ? 'transform .3s' : 'none';

  return (
    <>
      <g style={{ transition, transformOrigin: '20px 58px', transform: `rotate(${ex.armL}deg)` }}>
        <rect x="16" y="58" width="7" height="17" rx="3.5" fill={C.outline} />
      </g>
      <g style={{ transition, transformOrigin: '68px 58px', transform: `rotate(${ex.armR}deg)` }}>
        <rect x="65" y="58" width="7" height="17" rx="3.5" fill={C.outline} />
      </g>
    </>
  );
}
