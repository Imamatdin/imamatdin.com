import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

interface Command {
  id: string;
  name: string;
  shortcut: string;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    { id: 'home', name: 'Home', shortcut: 'g h', action: () => router.push('/') },
    { id: 'about', name: 'About', shortcut: 'g a', action: () => router.push('/about') },
    { id: 'reading', name: 'Reading', shortcut: 'g r', action: () => router.push('/reading') },
    { id: 'writing', name: 'Writing', shortcut: 'g w', action: () => router.push('/writing') },
    { id: 'projects', name: 'Projects', shortcut: 'g p', action: () => router.push('/projects') },
    { id: 'deep-dives', name: 'Deep Dives', shortcut: 'g d', action: () => router.push('/deep-dives') },
    { id: 'now', name: 'Now', shortcut: 'g n', action: () => router.push('/now') },
    { id: 'theme', name: 'Toggle Theme', shortcut: 't', action: () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }},
  ];

  // Fuzzy search
  const filteredCommands = commands.filter(cmd => {
    const q = query.toLowerCase();
    const name = cmd.name.toLowerCase();
    // Simple fuzzy: check if all chars in query appear in order
    let qi = 0;
    for (let i = 0; i < name.length && qi < q.length; i++) {
      if (name[i] === q[qi]) qi++;
    }
    return qi === q.length;
  });

  // Open/close handlers
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const executeCommand = useCallback((cmd: Command) => {
    close();
    cmd.action();
  }, [close]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // cmd+k or ctrl+k to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? close() : open();
        return;
      }

      // g + key shortcuts (only when palette is closed)
      if (!isOpen && e.key === 'g') {
        const handleSecondKey = (e2: KeyboardEvent) => {
          const shortcutMap: Record<string, string> = {
            'h': '/', 'a': '/about', 'r': '/reading', 'w': '/writing',
            'p': '/projects', 'd': '/deep-dives', 'n': '/now'
          };
          if (shortcutMap[e2.key]) {
            e2.preventDefault();
            router.push(shortcutMap[e2.key]);
          }
          window.removeEventListener('keydown', handleSecondKey);
        };
        window.addEventListener('keydown', handleSecondKey, { once: true });
        setTimeout(() => window.removeEventListener('keydown', handleSecondKey), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open, close, router]);

  // Palette keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, filteredCommands, selectedIndex, executeCommand]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
        onClick={close}
      />

      {/* Palette */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '500px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          zIndex: 9999,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text)',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />

        {/* Results */}
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          {filteredCommands.map((cmd, index) => (
            <div
              key={cmd.id}
              onClick={() => executeCommand(cmd)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: index === selectedIndex ? 'var(--highlight)' : 'transparent',
              }}
            >
              <span>{cmd.name}</span>
              <span style={{ opacity: 0.5, fontSize: '12px' }}>[{cmd.shortcut}]</span>
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div style={{ padding: '10px 16px', opacity: 0.5 }}>
              No commands found
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border)',
            fontSize: '12px',
            opacity: 0.5,
            display: 'flex',
            gap: '16px',
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </>
  );
}
