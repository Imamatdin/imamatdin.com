import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eyebrow } from '../../components/Eyebrow';
import { getAllBooks } from '../../lib/books';
import { SHELVES, shelfFor } from '../../lib/shelves';

// WebGL, window and fonts: nothing to render on the server.
const Hall = dynamic(() => import('../../components/library/Hall'), { ssr: false });

interface Volume {
  slug: string;
  title: string;
  author: string;
  shelf: string;
  excerpt: string;
}

interface LibraryProps {
  volumes: Volume[];
}

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

const hash = (s: string, salt = 0) => {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

function Spine({ volume, hue, open, onOpen }: { volume: Volume; hue: string; open: boolean; onOpen: () => void }) {
  const width = 34 + Math.round(hash(volume.slug) * 16);
  const height = 156 + Math.round(hash(volume.slug, 7) * 44);

  return (
    <Box
      as="button"
      type="button"
      onClick={onOpen}
      aria-expanded={open}
      aria-label={`${volume.title} by ${volume.author}`}
      title={`${volume.title} — ${volume.author}`}
      position="relative"
      flexShrink={0}
      width={`${width}px`}
      height={`${height}px`}
      bg={hue}
      color="var(--sp-ink)"
      transform={open ? 'translateY(-22px)' : 'translateY(0)'}
      transition={`transform 0.22s ${EASE}`}
      _hover={{ transform: open ? 'translateY(-22px)' : 'translateY(-12px)' }}
      _focusVisible={{ transform: 'translateY(-12px)' }}
      // Gilt bands top and bottom, as on a bound spine.
      boxShadow="inset 0 9px 0 -7px var(--gilt), inset 0 -9px 0 -7px var(--gilt), inset 0 15px 0 -13px var(--gilt), inset 0 -15px 0 -13px var(--gilt)"
    >
      <Box
        position="absolute"
        inset="22px 0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        fontFamily="mono"
        fontSize="10.5px"
        letterSpacing="0.06em"
        textTransform="uppercase"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        {volume.title}
      </Box>
    </Box>
  );
}

function Bay({
  index,
  label,
  numeral,
  hue,
  volumes,
  openSlug,
  setOpenSlug,
}: {
  index: number;
  label: string;
  numeral: string;
  hue: string;
  volumes: Volume[];
  openSlug: string | null;
  setOpenSlug: (s: string | null) => void;
}) {
  const open = volumes.find((v) => v.slug === openSlug);

  return (
    <Box as="section" data-bay={index} pt={12}>
      <Flex justify="space-between" align="baseline" mb={6}>
        <Eyebrow color="text">
          bay {numeral} — {label}
        </Eyebrow>
        <Eyebrow>
          {volumes.length} {volumes.length === 1 ? 'volume' : 'volumes'}
        </Eyebrow>
      </Flex>

      <Flex
        align="flex-end"
        gap="3px"
        px={2}
        pt={6}
        overflowX="auto"
        overflowY="hidden"
        borderBottom="3px solid"
        borderColor="text"
        sx={{ scrollbarWidth: 'none' }}
      >
        {volumes.map((v) => (
          <Spine
            key={v.slug}
            volume={v}
            hue={hue}
            open={v.slug === openSlug}
            onOpen={() => setOpenSlug(v.slug === openSlug ? null : v.slug)}
          />
        ))}
      </Flex>
      <Box height="6px" borderBottom="1px solid" borderColor="border" />

      {open && (
        <Grid templateColumns="6px 1fr" gap={4} mt={5} key={open.slug}>
          <Box bg={hue} />
          <Box py={1}>
            <Text as="div" fontFamily="mono" fontSize="16px" fontWeight={500} color="text" letterSpacing="-0.01em">
              {open.title}
            </Text>
            <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" mt={1}>
              {open.author}
            </Text>
            {open.excerpt && (
              <Text as="div" fontFamily="mono" fontSize="13px" color="text" lineHeight="1.8" mt={3}>
                {open.excerpt}
              </Text>
            )}
            <Text as="div" fontFamily="mono" fontSize="12px" mt={3}>
              <NextLink href={`/library/${open.slug}`} className="ink-link">
                open the notes →
              </NextLink>
            </Text>
          </Box>
        </Grid>
      )}
    </Box>
  );
}

export default function Library({ volumes }: LibraryProps) {
  const bays = useMemo(
    () =>
      SHELVES.map((s) => ({ ...s, volumes: volumes.filter((v) => v.shelf === s.id) })).filter(
        (b) => b.volumes.length > 0
      ),
    [volumes]
  );
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const progress = useRef(0);
  const walkRef = useRef<HTMLDivElement>(null);

  // Scrolling through the bays walks the camera down the nave.
  useEffect(() => {
    const onScroll = () => {
      const el = walkRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight * 0.5);
      const p = Math.min(1, Math.max(0, -r.top / span));
      progress.current = p;
      setCurrent(Math.min(bays.length - 1, Math.floor(p * bays.length)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [bays.length]);

  const here = bays[current];

  return (
    <>
      <NextSeo title="Library | Imamatdin" description="Books I've read and found worth rereading." />

      <Container maxW="650px" py={4}>
        <Eyebrow mb={3}>index / library</Eyebrow>
        <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" lineHeight="1.1" color="text">
          Library
        </Text>
        <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3}>
          Books I&apos;ve read and found worth rereading. {volumes.length} volumes in {bays.length} bays — pull one off
          the shelf.
        </Text>

        <Box ref={walkRef} mt={8}>
          <Box
            position={{ base: 'relative', md: 'sticky' }}
            top={0}
            zIndex={2}
            bg="background"
            width="min(980px, calc(100vw - 32px))"
            left="50%"
            transform="translateX(-50%)"
            height={{ base: '240px', md: 'clamp(240px, 42vh, 400px)' }}
            borderBottom="1px solid"
            borderColor="border"
          >
            <Hall progress={progress} bays={bays.length} />
            {here && (
              <Flex
                position="absolute"
                left={0}
                right={0}
                bottom={0}
                p={3}
                justify="space-between"
                pointerEvents="none"
              >
                <Eyebrow bg="background" color="text" px={1}>
                  bay {here.numeral} — {here.label}
                </Eyebrow>
                <Eyebrow bg="background" px={1} display={{ base: 'none', md: 'block' }}>
                  after admont, 1776
                </Eyebrow>
              </Flex>
            )}
          </Box>

          {bays.map((b, i) => (
            <Bay
              key={b.id}
              index={i}
              label={b.label}
              numeral={b.numeral}
              hue={b.hue}
              volumes={b.volumes}
              openSlug={openSlug}
              setOpenSlug={setOpenSlug}
            />
          ))}
          <Box height="30vh" />
        </Box>
      </Container>
    </>
  );
}

const plain = (md: string) =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getStaticProps: GetStaticProps<LibraryProps> = async () => {
  const volumes = getAllBooks()
    .map((b) => {
      const body = (b.content ?? '').split('## My Notes')[0];
      const first = body.split(/\n\s*\n/).map(plain).find((p) => p.length > 0) ?? '';
      return {
        slug: b.slug,
        title: b.title,
        author: b.author,
        shelf: shelfFor(b.category).id,
        excerpt: first.length > 420 ? `${first.slice(0, 417).trimEnd()}…` : first,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
  return { props: { volumes } };
};
