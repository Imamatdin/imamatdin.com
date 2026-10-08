import { Box, Container, Flex, Grid, Link as ChakraLink, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { Eyebrow } from '../../components/Eyebrow';
import { Bookshelf } from '../../components/library/Bookshelf';
import { getAllBooks } from '../../lib/books';

type Status = 'reading' | 'next' | 'later' | 'finished';
type Kind = 'book' | 'essay' | 'talk';

interface Entry {
  slug: string;
  title: string;
  author: string;
  kind: Kind;
  status: Status;
  set: string | null;
  setOrder: number;
  order: number;
  cover: string;
  spine: string;
  ink: string;
  note: string;
  link: string | null;
  rating: number | null;
  read: string | null;
}

interface LibraryProps {
  entries: Entry[];
}

const STAGES: { status: Status; label: string }[] = [
  { status: 'reading', label: 'reading now' },
  { status: 'next', label: 'up next' },
  { status: 'later', label: 'after the applications · from nov' },
  { status: 'finished', label: 'read' },
];

const KINDS: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'book', label: 'books' },
  { id: 'essay', label: 'essays' },
  { id: 'talk', label: 'talks' },
];

function Row({ e }: { e: Entry }) {
  return (
    <Grid templateColumns="72px 1fr" gap={5} py={5} borderBottom="1px solid" borderColor="border">
      <NextLink href={`/library/${e.slug}`} aria-label={e.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e.cover}
          alt=""
          loading="lazy"
          style={{ width: 72, height: 108, objectFit: 'cover', display: 'block', boxShadow: '0 1px 0 var(--border)' }}
        />
      </NextLink>
      <Box minW={0}>
        <Text as="div" fontFamily="mono" fontSize="14px" fontWeight={500} lineHeight="1.4">
          <NextLink href={`/library/${e.slug}`} className="ink-link">
            {e.title}
          </NextLink>
        </Text>
        <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" mt={1}>
          {e.author}
        </Text>
        {(e.kind !== 'book' || e.read || e.rating) && (
          <Eyebrow mt={2}>
            {[e.kind !== 'book' ? e.kind : null, e.read, e.rating ? `${e.rating}/10` : null].filter(Boolean).join(' · ')}
          </Eyebrow>
        )}
        {e.note && (
          <Text as="div" fontFamily="mono" fontSize="13px" color="text" lineHeight="1.75" mt={2}>
            {e.note}
          </Text>
        )}
        {e.link && (
          <Text as="div" fontFamily="mono" fontSize="12px" mt={2}>
            <ChakraLink href={e.link} isExternal className="ink-link">
              {new URL(e.link).hostname.replace(/^www\./, '')} ↗
            </ChakraLink>
          </Text>
        )}
      </Box>
    </Grid>
  );
}

export default function Library({ entries }: LibraryProps) {
  const [kind, setKind] = useState<'all' | Kind>('all');
  const shown = entries.filter((e) => kind === 'all' || e.kind === kind);
  const count = (k: 'all' | Kind) => entries.filter((e) => k === 'all' || e.kind === k).length;

  const shelf = entries.map((e, i) => ({
    slug: e.slug,
    title: e.title,
    author: e.author,
    cover: e.cover,
    spine: e.spine,
    ink: e.ink,
    breakBefore: i > 0 && entries[i - 1].status !== e.status,
  }));

  return (
    <>
      <NextSeo title="Library | Imamatdin" description="What I'm reading, what's next, and what I've read." />

      <Container maxW="650px" py={4}>
        <Eyebrow mb={3}>index / library</Eyebrow>
        <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" lineHeight="1.1" color="text">
          Library
        </Text>
        <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3}>
          Books, essays and talks: what I&apos;m reading, the plan for what&apos;s next, and what I&apos;ve read.
        </Text>

        <Box mt={8}>
          <Bookshelf books={shelf} />
        </Box>

        <Flex gap={5} mt={10} flexWrap="wrap" role="tablist" aria-label="Filter by kind">
          {KINDS.map((k) => (
            <Box
              as="button"
              key={k.id}
              role="tab"
              aria-selected={kind === k.id}
              onClick={() => setKind(k.id)}
              fontFamily="mono"
              fontSize="12px"
              pb="3px"
              borderBottom="1px solid"
              borderColor={kind === k.id ? 'text' : 'transparent'}
              color={kind === k.id ? 'text' : 'subtle'}
              _hover={{ color: 'text' }}
            >
              {k.label}{' '}
              <Box as="span" color="subtle">
                {count(k.id)}
              </Box>
            </Box>
          ))}
        </Flex>

        {STAGES.map(({ status, label }) => {
          const items = shown.filter((e) => e.status === status);
          if (!items.length) return null;
          const sets = Array.from(new Set(items.map((e) => e.set ?? '')));
          return (
            <Box as="section" key={status} mt={12}>
              <Eyebrow color="text" mb={2}>
                {label}
              </Eyebrow>
              {sets.map((set) => (
                <Box key={set}>
                  {set && status !== 'later' && (
                    <Eyebrow mt={6} mb={1}>
                      {set}
                    </Eyebrow>
                  )}
                  <Box borderTop="1px solid" borderColor="border">
                    {items
                      .filter((e) => (e.set ?? '') === set)
                      .map((e) => (
                        <Row key={e.slug} e={e} />
                      ))}
                  </Box>
                </Box>
              ))}
            </Box>
          );
        })}
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

const RANK: Record<Status, number> = { reading: 0, next: 1, later: 2, finished: 3 };

export const getStaticProps: GetStaticProps<LibraryProps> = async () => {
  const entries: Entry[] = getAllBooks()
    .map((b) => {
      const body = (b.content ?? '').split('## My Notes')[0];
      const note = body.split(/\n\s*\n/).map(plain).find((p) => p.length > 0) ?? '';
      const status: Status = b.status === 'reading' || b.status === 'next' || b.status === 'later' ? b.status : 'finished';
      const date = b.date ? new Date(b.date) : null;
      return {
        slug: b.slug,
        title: b.title,
        author: b.author,
        kind: (b.kind as Kind) ?? 'book',
        status,
        set: b.set ?? null,
        setOrder: b.setOrder ?? 99,
        order: b.order ?? 99,
        cover: b.coverImage ?? '',
        spine: b.spineColor ?? '#6F6E69',
        ink: b.textColor ?? '#FFFCF0',
        note: note.length > 360 ? `${note.slice(0, 357).trimEnd()}…` : note,
        link: b.link && b.link.startsWith('http') ? b.link : null,
        rating: b.rating ?? null,
        read:
          status === 'finished' && date && !isNaN(date.getTime())
            ? date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toLowerCase()
            : null,
      };
    })
    .sort(
      (a, b) =>
        RANK[a.status] - RANK[b.status] ||
        a.setOrder - b.setOrder ||
        a.order - b.order ||
        a.title.localeCompare(b.title)
    );
  return { props: { entries } };
};
