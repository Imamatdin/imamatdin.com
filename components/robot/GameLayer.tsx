import { C } from './expressions';
import type { GameState } from './types';

interface GameLayerProps {
  game: GameState;
  cellCount: number;
  registerCell: (index: number, node: HTMLElement | null) => void;
  onRestart: () => void;
  onExit: () => void;
}

const panel: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  top: '32%',
  transform: 'translateX(-50%)',
  background: C.shell,
  border: `1px solid ${C.outline}`,
  color: C.text,
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  padding: '18px 22px',
  textAlign: 'center',
  zIndex: 60,
  pointerEvents: 'auto',
  minWidth: 240,
};

/**
 * Collectibles and the HUD. Positions are written by the game loop straight to
 * these nodes — nothing here re-renders per frame.
 */
export function GameLayer({ game, cellCount, registerCell, onRestart, onExit }: GameLayerProps) {
  if (game.status === 'off') return null;

  return (
    <div data-robot-hud>
      {Array.from({ length: cellCount }, (_, i) => (
        <div
          key={i}
          ref={(node) => registerCell(i, node)}
          aria-hidden
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 14,
            height: 14,
            marginLeft: -7,
            marginTop: -7,
            background: C.accent,
            boxShadow: '0 0 12px color-mix(in srgb, var(--accent) 55%, transparent)',
            zIndex: 39,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
      ))}

      <div
        style={{
          position: 'fixed',
          // Bottom rather than top: the site header lives up there and the
          // two collided.
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: C.shell,
          border: `1px solid ${C.outline}`,
          color: C.text,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          padding: '6px 12px',
          zIndex: 60,
          pointerEvents: 'none',
          display: 'flex',
          gap: 12,
        }}
      >
        <span>
          {game.collected} / {game.total}
        </span>
        <span style={{ color: C.subtle }}>arrows / wasd &nbsp; esc to stop</span>
      </div>

      {game.status === 'lost' && (
        <div style={panel} role="alertdialog" aria-label="You fell">
          <div style={{ marginBottom: 6, fontSize: 18 }}>you fell</div>
          <div style={{ color: C.subtle, fontSize: 12, marginBottom: 14 }}>
            {game.message ?? 'the text is the floor. mind the gaps.'}
          </div>
          <GameButton onClick={onRestart}>try again</GameButton>
          <GameButton onClick={onExit}>back to the dock</GameButton>
          <div style={{ color: C.subtle, fontSize: 11, marginTop: 10 }}>or press space</div>
        </div>
      )}

      {game.status === 'won' && (
        <div style={panel} role="alertdialog" aria-label="You won">
          <div style={{ marginBottom: 6, fontSize: 18 }}>all {game.total} collected</div>
          <div style={{ color: C.subtle, fontSize: 12, marginBottom: 14 }}>
            {game.message ?? 'genuinely impressive.'}
          </div>
          <GameButton onClick={onRestart}>play again</GameButton>
          <GameButton onClick={onExit}>back to the dock</GameButton>
        </div>
      )}
    </div>
  );
}

function GameButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1px solid ${C.outline}`,
        color: C.text,
        font: 'inherit',
        padding: '7px 14px',
        margin: '0 4px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
