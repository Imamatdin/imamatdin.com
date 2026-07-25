import { C } from '../expressions';

export function Zzz({ animate }: { animate: boolean }) {
  return (
    <text x="68" y="14" fill={C.subtle} fontSize="10" fontFamily="monospace">
      z
      {animate && (
        <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" />
      )}
    </text>
  );
}
