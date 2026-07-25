import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { C, expressionFor } from './expressions';
import { Priority } from './types';
import type { RobotState } from './types';
import { visibleTrayItems } from './tray';
import { Head } from './parts/Head';
import { Body } from './parts/Body';
import { Arms } from './parts/Arms';
import { Zzz } from './parts/Zzz';
import { DjKit } from './parts/DjKit';

interface RobotProps {
  state: RobotState;
  /** The dock element. The game loop writes transforms to it directly. */
  dockRef: React.RefObject<HTMLDivElement>;
  blink: boolean;
  /** False under prefers-reduced-motion — decorative motion is dropped, not the face. */
  animate: boolean;
  /** True below the mobile breakpoint, where the bubble would cover content. */
  compact: boolean;
  konami: boolean;
  onTap: () => void;
  onTraySelect: (id: string) => void;
}

/**
 * Presentational only. This file holds no behavior and should not need editing
 * to add one — see behaviors/index.ts. Tray entries come from tray.ts.
 */
export const Robot = forwardRef<HTMLButtonElement, RobotProps>(function Robot(
  { state, dockRef, blink, animate, compact, konami, onTap, onTraySelect },
  ref
) {
  const { asleep, bubble, dnd, pose, trayOpen } = state;
  const playing = state.game.status !== 'off';
  // Sleeping and sulking outrank whatever mood a line left behind. Without
  // this, the hold timer from the acknowledgement ("i'll be over here") expires
  // a few seconds later and snaps the face back to neutral, so the robot sits
  // in the corner looking perfectly cheerful about it.
  const ex = expressionFor(asleep ? 'sleepy' : dnd ? 'sad' : state.mood);
  const isDj = state.prop === 'headphones';

  // On phones the bubble is opt-in: it only appears for something the visitor
  // actually asked for, so idle chatter can never sit on top of the content.
  const showBubble =
    bubble.visible &&
    !state.quiet &&
    !trayOpen &&
    !playing &&
    (!compact || bubble.priority >= Priority.User);

  const scale = playing ? 0.6 : (compact ? 0.72 : 1) * (pose === 'corner' ? 0.75 : 1);
  const trayItems = visibleTrayItems(state, konami, compact);

  const animation = !animate || playing
    ? 'none'
    : state.hop
    ? 'robot-hop .35s ease-in-out 2'
    : isDj
    ? 'robot-bob .47s ease-in-out infinite'
    : asleep
    ? 'robot-breathe 4.5s ease-in-out infinite'
    : dnd
    ? 'none'
    : 'robot-float 3.2s ease-in-out infinite';

  // While playing, the loop owns position: React pins the origin to the top
  // left and writes nothing else, so the two never fight over the same
  // properties. Otherwise the corner is the sulking spot.
  const anchored: CSSProperties = playing
    ? { left: 0, top: 0, right: 'auto', bottom: 'auto' }
    : pose === 'corner'
    ? { left: compact ? 8 : 18, right: 'auto', bottom: compact ? 8 : 14 }
    : { right: compact ? 12 : 34, left: 'auto', bottom: compact ? 12 : 26 };

  const dock: CSSProperties = {
    position: 'fixed',
    ...anchored,
    display: 'flex',
    flexDirection: 'column',
    alignItems: pose === 'corner' ? 'flex-start' : 'flex-end',
    gap: 10,
    zIndex: 40,
    pointerEvents: 'none',
    ...(playing
      ? { willChange: 'transform', transition: 'none' }
      : {
          transform: `translateX(${state.nudge}px)`,
          transition: animate
            ? 'left .9s ease, right .9s ease, bottom .9s ease, transform .5s ease'
            : 'none',
        }),
    opacity: dnd ? 0.75 : 1,
  };

  return (
    <div ref={dockRef} style={dock} data-robot-dock data-robot-pose={pose}>
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
            [pose === 'corner' ? 'left' : 'right']: 34,
            width: 10,
            height: 10,
            background: C.shell,
            borderRight: `1px solid ${C.outline}`,
            borderBottom: `1px solid ${C.outline}`,
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      {trayOpen && !playing && (
        <div
          role="menu"
          aria-label="Robot commands"
          style={{
            background: C.shell,
            border: `1px solid ${C.outline}`,
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            minWidth: 150,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {trayItems.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              onClick={() => onTraySelect(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${C.outline}`,
                color: C.text,
                font: 'inherit',
                textAlign: 'left',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--highlight)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              &gt; {item.label}
            </button>
          ))}
        </div>
      )}

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
        aria-label={trayOpen ? 'Close robot menu' : 'Robot companion'}
        aria-expanded={trayOpen}
        aria-haspopup="menu"
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
          {isDj && <DjKit ex={ex} animate={animate} />}
          {asleep && <Zzz animate={animate} />}
        </svg>
      </button>

      <style>{`
        @keyframes robot-float   { 0%,100% { transform: translateY(0); }          50% { transform: translateY(-7px); } }
        @keyframes robot-hop     { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-16px) scale(1.06); } }
        @keyframes robot-breathe { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(2px) scale(.985); } }
        @keyframes robot-bob     { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-5px) rotate(2deg); } }
      `}</style>
    </div>
  );
});
