import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

export interface ShelfBook {
  slug: string;
  title: string;
  author: string;
  cover: string;
  spine: string;
  ink: string;
  /** Narrow gap before this book: the boundary between plan stages. */
  breakBefore?: boolean;
}

const SPINE_W = 38;

// Real shelves aren't level: heights vary a little, deterministically per book.
const heightFor = (slug: string) => {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return 196 + ((h >>> 0) % 27);
};

// The spine only has room for the title proper.
const spineTitle = (title: string) => title.split(':')[0].trim();
const COVER_W = SPINE_W * 4;
const HEIGHT = 222;
const EASE = '500ms cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * A shelf of real books in CSS 3D: each one is a spine and a cover hinged at
 * the corner. Click pulls the book out and swings the cover into view; click
 * the cover to open the book's page.
 */
export function Bookshelf({ books }: { books: ShelfBook[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<{ slug: string; x: number; w: number } | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: number) => rowRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  const hovered = hover && books.find((b) => b.slug === hover.slug);

  return (
    <Box position="relative">
      <Box
        ref={rowRef}
        display="flex"
        alignItems="flex-end"
        gap="4px"
        overflowX="auto"
        overflowY="hidden"
        pt="34px"
        pb="2px"
        px="2px"
        sx={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        onScroll={() => setHover(null)}
      >
        {books.map((book) => {
          const isOpen = open === book.slug;
          return (
            <Box
              as="button"
              type="button"
              key={book.slug}
              aria-label={`${book.title} by ${book.author}`}
              aria-expanded={isOpen}
              onClick={() => {
                if (isOpen) router.push(`/library/${book.slug}`);
                else setOpen(book.slug);
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                const row = rowRef.current!.getBoundingClientRect();
                const r = e.currentTarget.getBoundingClientRect();
                setHover({ slug: book.slug, x: r.left - row.left + SPINE_W / 2, w: row.width });
              }}
              onMouseLeave={() => setHover(null)}
              flexShrink={0}
              display="flex"
              ml={book.breakBefore ? '22px' : 0}
              width={`${isOpen ? SPINE_W + COVER_W : SPINE_W}px`}
              height={`${heightFor(book.slug)}px`}
              transition={`width ${EASE}, transform 0.2s ${EASE}`}
              transform={isOpen ? 'none' : 'translateY(0)'}
              _hover={{ transform: isOpen ? 'none' : 'translateY(-6px)' }}
              sx={{ perspective: '1000px' }}
            >
              {/* Spine */}
              <Box
                position="relative"
                flexShrink={0}
                width={`${SPINE_W}px`}
                height="100%"
                bg={book.spine}
                color={book.ink}
                transformOrigin="right"
                transform={`rotateY(${isOpen ? '-60deg' : '0deg'})`}
                transition={`transform ${EASE}`}
                sx={{ transformStyle: 'preserve-3d' }}
                // Rounded-spine shading: darker at both edges, lit down the middle.
                backgroundImage="linear-gradient(to right, rgba(0,0,0,0.28), rgba(255,255,255,0.08) 22%, rgba(255,255,255,0.12) 48%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0.3))"
              >
                <Box
                  position="absolute"
                  top="14px"
                  bottom="14px"
                  left={0}
                  right={0}
                  display="flex"
                  justifyContent="center"
                >
                  <Box
                    as="span"
                    display="block"
                    maxHeight="100%"
                    overflow="hidden"
                    fontFamily="mono"
                    fontSize="10.5px"
                    fontWeight={500}
                    letterSpacing="0.03em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    sx={{ writingMode: 'vertical-rl' }}
                  >
                    {spineTitle(book.title)}
                  </Box>
                </Box>
              </Box>
              {/* Cover */}
              <Box
                position="relative"
                flexShrink={0}
                width={`${COVER_W}px`}
                height="100%"
                overflow="hidden"
                transformOrigin="left"
                transform={`rotateY(${isOpen ? '30deg' : '88.8deg'})`}
                transition={`transform ${EASE}`}
                sx={{ transformStyle: 'preserve-3d' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.cover}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* The hinge crease near the spine, as on a hardback. */}
                <Box
                  position="absolute"
                  inset={0}
                  pointerEvents="none"
                  backgroundImage="linear-gradient(to right, rgba(255,255,255,0) 2px, rgba(255,255,255,0.45) 3px, rgba(255,255,255,0.2) 5px, transparent 8px, transparent 10px, rgba(0,0,0,0.15) 11px, transparent 14px)"
                />
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* The plank. */}
      <Box height="3px" bg="text" />
      <Box height="6px" borderBottom="1px solid" borderColor="border" />

      {hovered && hover && (
        <Box
          position="absolute"
          top="2px"
          // Centred on the spine, but pinned inside the shelf near either end.
          left={hover.x < 140 ? '0px' : hover.x > hover.w - 140 ? 'auto' : `${hover.x}px`}
          right={hover.x > hover.w - 140 ? '0px' : 'auto'}
          transform={hover.x < 140 || hover.x > hover.w - 140 ? 'none' : 'translateX(-50%)'}
          bg="text"
          color="background"
          fontFamily="mono"
          fontSize="11px"
          px="7px"
          py="3px"
          whiteSpace="nowrap"
          pointerEvents="none"
          zIndex={2}
        >
          {hovered.title}
        </Box>
      )}

      <Box
        as="button"
        type="button"
        aria-label="Scroll shelf left"
        onClick={() => nudge(-1)}
        position="absolute"
        left="-30px"
        top="34px"
        height={`${HEIGHT}px`}
        width="24px"
        color="subtle"
        _hover={{ color: 'text' }}
        display={{ base: 'none', md: 'block' }}
        fontFamily="mono"
      >
        ‹
      </Box>
      <Box
        as="button"
        type="button"
        aria-label="Scroll shelf right"
        onClick={() => nudge(1)}
        position="absolute"
        right="-30px"
        top="34px"
        height={`${HEIGHT}px`}
        width="24px"
        color="subtle"
        _hover={{ color: 'text' }}
        display={{ base: 'none', md: 'block' }}
        fontFamily="mono"
      >
        ›
      </Box>
    </Box>
  );
}
