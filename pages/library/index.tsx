import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { useMemo, useRef, useState } from 'react';
import { Eyebrow } from '../../components/Eyebrow';
import { getAllBooks } from '../../lib/books';
import { SHELVES, shelfFor } from '../../lib/shelves';

// WebGL, window and fonts: nothing to render on the server.
const Hall = dynamic(() => import('../../components/library/Hall'), { ssr: false });

interface Volume {
  slug: string;
  title: string;
  short: string;
  author: string;
  shelf: string;
  excerpt: string;
}

interface LibraryProps {
  volumes: Volume[];
}

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

// The reading column is 650px; the hall and the bookcase take a wider band.
// Margins rather than a transform, so nothing fights sticky or overflow.
const BREAKOUT = {
  width: 'min(980px, calc(100vw - 32px))',
  marginLeft: 'calc(50% - min(490px, 50vw - 16px))',
};

const hash = (s: string, salt = 0) => {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

function Spine({
  volume,
  hue,
  open,
  onOpen,
  onHover,
}: {
  volume: Volume;
  hue: string;
  open: boolean;
  onOpen: () => void;
  onHover: (on: boolean) => void;
}) {
  const width = 27 + Math.round(hash(volume.slug) * 7);
  const height = 184 + Math.round(hash(volume.slug, 7) * 46);

  return (
    <Box
      as="button"
      type="button"
      onClick={onOpen}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-expanded={open}
      aria-label={`${volume.title} by ${volume.author}`}
      title={`${volume.title} — ${volume.author}`}
      position="relative"
      flexShrink={0}
      width={`${width}px`}
      height={`${height}px`}
      bg={hue}
      color="var(--sp-ink)"
      transform={open ? 'translateY(-24px)' : 'translateY(0)'}
      transition={`transform 0.22s ${EASE}`}
      _hover={{ transform: open ? 'translateY(-24px)' : 'translateY(-12px)' }}
      _focusVisible={{ transform: 'translateY(-12px)' }}
      // Double gilt bands top and bottom, as on a bound spine.
      boxShadow="inset 0 9px 0 -7px var(--gilt), inset 0 -9px 0 -7px var(--gilt), inset 0 15px 0 -13px var(--gilt), inset 0 -15px 0 -13px var(--gilt)"
    >
      <Box
        position="absolute"
        top="22px"
        bottom="22px"
        left={0}
        right={0}
        overflow="hidden"
        sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        display="flex"
        alignItems="center"
        fontFamily="mono"
        fontSize="10.5px"
        letterSpacing="0.06em"
        textTransform="uppercase"
        whiteSpace="nowrap"
      >
        {volume.short}
      </Box>
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
  const [hoverBay, setHoverBay] = useState<number | null>(null);
  const focus = useRef<number | null>(null);

  const open = volumes.find((v) => v.slug === openSlug);
  const openBay = open ? bays.findIndex((b) => b.id === open.shelf) : null;
  const activeBay = hoverBay ?? openBay;
  focus.current = activeBay;

  return (
    <>
      <NextSeo title="Library | Imamatdin" description="Books I've read and found worth rereading." />

      <Container maxW="650px" py={4}>
        <Eyebrow mb={3}>index / library</Eyebrow>
        <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" lineHeight="1.1" color="text">
          Library
        </Text>
        <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3}>
          Books I&apos;ve read and found worth rereading. {volumes.length} volumes in {bays.length} bays. Pull one off
          the shelf.
        </Text>

        <Box
          sx={BREAKOUT}
          position="relative"
          mt={8}
          height={{ base: '260px', md: '440px' }}
          border="1px solid"
          borderColor="border"
          bg="background"
        >
          <Hall focus={focus} bays={bays.length} />
          <Flex position="absolute" left={0} right={0} bottom={0} p={3} justify="space-between" pointerEvents="none">
            <Eyebrow bg="background" color="text" px={1}>
              {activeBay !== null ? `bay ${bays[activeBay].numeral} — ${bays[activeBay].label}` : 'the hall'}
            </Eyebrow>
            <Eyebrow bg="background" px={1} display={{ base: 'none', md: 'block' }}>
              after admont, 1776
            </Eyebrow>
          </Flex>
        </Box>

        {/* One bookcase, bays side by side on shared planks. */}
        <Box sx={BREAKOUT} mt={12}>
          <Flex wrap="wrap" align="flex-end" rowGap={10}>
            {bays.map((b, i) => (
              <Box key={b.id} borderBottom="3px solid" borderColor="text" pl={i === 0 ? 2 : 4} pr={1}>
                {/* Zero-width so a long label never pushes its bay apart. */}
                <Eyebrow
                  mb={4}
                  width={0}
                  whiteSpace="nowrap"
                  color={activeBay === i ? 'text' : 'subtle'}
                  transition={`color 0.15s ${EASE}`}
                >
                  {b.numeral} · {b.label}
                </Eyebrow>
                <Flex align="flex-end" gap="3px">
                  {b.volumes.map((v) => (
                    <Spine
                      key={v.slug}
                      volume={v}
                      hue={b.hue}
                      open={v.slug === openSlug}
                      onOpen={() => setOpenSlug(v.slug === openSlug ? null : v.slug)}
                      onHover={(on) => setHoverBay(on ? i : null)}
                    />
                  ))}
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>

        <Box minH="180px" mt={8}>
          {open ? (
            <Grid templateColumns="6px 1fr" gap={4} key={open.slug}>
              <Box bg={shelfFor(open.shelf).hue} />
              <Box py={1}>
                <Eyebrow>
                  bay {shelfFor(open.shelf).numeral} — {shelfFor(open.shelf).label}
                </Eyebrow>
                <Text as="div" fontFamily="mono" fontSize="17px" fontWeight={500} color="text" letterSpacing="-0.01em" mt={2}>
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
          ) : (
            <Text as="div" fontFamily="mono" fontSize="12px" color="subtle">
              Hover a spine to walk to its bay. Click to read what I thought of it.
            </Text>
          )}
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

// A spine only has room for the title proper: drop subtitles and articles.
const shortTitle = (title: string) =>
  title
    .split(/[:(]/)[0]
    .replace(/^(the|a|an)\s+/i, '')
    .trim();

export const getStaticProps: GetStaticProps<LibraryProps> = async () => {
  const order = new Map(SHELVES.map((s, i) => [s.id, i]));
  const volumes = getAllBooks()
    .map((b) => {
      const body = (b.content ?? '').split('## My Notes')[0];
      const first = body.split(/\n\s*\n/).map(plain).find((p) => p.length > 0) ?? '';
      return {
        slug: b.slug,
        title: b.title,
        short: shortTitle(b.title),
        author: b.author,
        shelf: shelfFor(b.category).id,
        excerpt: first.length > 420 ? `${first.slice(0, 417).trimEnd()}…` : first,
      };
    })
    .sort((a, b) => (order.get(a.shelf) ?? 99) - (order.get(b.shelf) ?? 99) || a.title.localeCompare(b.title));
  return { props: { volumes } };
};
