import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { C, expressionFor } from './expressions';
import { Priority } from './types';
import type { RobotState } from './types';
import { Head } from './parts/Head';
import { Body } from './parts/Body';
import { Arms } from './parts/Arms';
import { Zzz } from './parts/Zzz';

interface RobotProps {
  state: RobotState;
  blink: boolean;
  /** False under prefers-reduced-motion — decorative motion is dropped, not the face. */
  animate: boolean;
  /** True below the mobile breakpoint, where the bubble would cover content. */
  compact: boolean;
  onTap: () => void;
}

/**
 * Presentational only. This file holds no behavior and should not need editing
 * to add one — see behaviors/index.ts.
 */
export const Robot = forwardRef<HTMLButtonElement, RobotProps>(function Robot(
  { state, blink, animate, compact, onTap },
  ref
) {
  const { asleep, bubble } = state;
  // Being asleep outranks whatever mood a line left behind, so a hold timer
  // expiring can't snap a sleeping face back to neutral.
  const ex = expressionFor(asleep ? 'sleepy' : state.mood);

  // On phones the bubble is opt-in: it only appears for something the visitor
  // actually asked for, so idle chatter can never sit on top of the content.
  const showBubble =
    bubble.visible && !state.quiet && (!compact || bubble.priority >= Priority.User);

  const scale = compact ? 0.72 : 1;

  const animation = !animate
    ? 'none'
    : state.hop
    ? 'robot-hop .35s ease-in-out 2'
    : asleep
    ? 'robot-breathe 4.5s ease-in-out infinite'
    : 'robot-float 3.2s ease-in-out infinite';

  const dock: CSSProperties = {
    position: 'fixed',
    right: compact ? 12 : 34,
    bottom: compact ? 12 : 26,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
    zIndex: 40,
    pointerEvents: 'none',
  };

  return (
    <div style={dock} data-robot-dock>
      <div
        style={{
          background: C.shell,
          color: C.text,
          border: `1px solid ${C.outline}`,
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          maxWidth: 260,
          lineHeight: 1.5,
          position: 'relative',
          opacity: showBubble ? 1 : 0,
          transform: showBubble ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity .35s, transform .35s',
          pointerEvents: 'none',
          visibility: showBubble ? 'visible' : 'hidden',
        }}
        aria-hidden={!showBubble}
      >
        {bubble.text}
        <span
          style={{
            position: 'absolute',
            bottom: -6,
            right: 34,
            width: 10,
            height: 10,
            background: C.shell,
            borderRight: `1px solid ${C.outline}`,
            borderBottom: `1px solid ${C.outline}`,
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      {/* Announced politely: the bubble is decoration, this is the live text. */}
      <span
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        {showBubble ? bubble.text : ''}
      </span>

      <button
        ref={ref}
        onClick={onTap}
        aria-label="Robot companion"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 0,
          pointerEvents: 'auto',
          animation,
          filter: 'drop-shadow(0 6px 16px color-mix(in srgb, var(--accent) 18%, transparent))',
        }}
      >
        <svg
          width={88 * scale}
          height={104 * scale}
          viewBox="0 0 88 104"
          shapeRendering="crispEdges"
          role="presentation"
        >
          <Head ex={ex} blink={blink} pupil={state.pupil} asleep={asleep} animate={animate} />
          <Body ex={ex} asleep={asleep} animate={animate} />
          <Arms ex={ex} animate={animate} />
          {asleep && <Zzz animate={animate} />}
        </svg>
      </button>

      <style>{`
        @keyframes robot-float   { 0%,100% { transform: translateY(0); }              50% { transform: translateY(-7px); } }
        @keyframes robot-hop     { 0%,100% { transform: translateY(0) scale(1); }     50% { transform: translateY(-16px) scale(1.06); } }
        @keyframes robot-breathe { 0%,100% { transform: translateY(0) scale(1); }     50% { transform: translateY(2px) scale(.985); } }
      `}</style>
    </div>
  );
});
