import { Box, Container, Flex, Grid, HStack, Link as ChakraLink, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import { Project, getProjects } from '../../lib/projects';
import { AsciiCanvas } from '../../components/experiments/AsciiCanvas';
import { AsciiFilm } from '../../components/experiments/AsciiFilm';
import { Eyebrow } from '../../components/experiments/ExperimentShell';
import { Scene, field } from '../../components/experiments/scenes';
import {
  DIAGRAMS,
  buildcoredReadout,
  coolingReadout,
  diagram,
  sentinelReadout,
  thermoReadout,
  zerothReadout,
} from '../../components/experiments/diagrams';

interface Entry extends Omit<Project, 'content'> {
  stack: string[];
}

interface PageProps {
  projects: Entry[];
  minor: Entry[];
}

const ORDER = [
  'radiative-cooling-control',
  'zeroth-law-traffic',
  'sentinel',
  'thermotouch',
  'buildcored',
  'flowcored',
  'agentic-os',
  'aral-basin-platform',
];

const CATEGORY: Record<string, string> = {
  'radiative-cooling-control': 'research',
  'aral-basin-platform': 'research',
  thermotouch: 'hardware',
  sentinel: 'ai',
  'zeroth-law-traffic': 'ai',
  'agentic-os': 'ai',
  flowcored: 'automation',
  buildcored: 'community',
};
const CATEGORIES = ['research', 'hardware', 'ai', 'automation', 'community'];

// Pulled from each project's own write-up; a frontmatter `metric` field would
// replace this if the design graduates.
const METRICS = [
  { value: '94.4%', label: 'water saved, seattle', slug: 'radiative-cooling-control' },
  { value: '1,500+', label: 'builders', slug: 'buildcored' },
  { value: '10–15×', label: 'faster cooling than peltier', slug: 'thermotouch' },
  { value: '50+ yr', label: 'satellite record', slug: 'aral-basin-platform' },
];

type Panel = 'film' | 'diagram' | 'readout';

const PANELS: Record<string, Panel[][]> = {
  'radiative-cooling-control': [['film', 'diagram'], ['readout']],
  'zeroth-law-traffic': [['film', 'diagram'], ['readout']],
  sentinel: [['diagram', 'readout']],
  thermotouch: [['film', 'readout']],
  buildcored: [['film', 'readout']],
  flowcored: [['diagram']],
  'agentic-os': [['diagram']],
  'aral-basin-platform': [['film', 'diagram']],
};

const READOUTS: Record<string, { scene: Scene; rows: number }> = {
  'radiative-cooling-control': { scene: coolingReadout, rows: 11 },
  sentinel: { scene: sentinelReadout, rows: 12 },
  'zeroth-law-traffic': { scene: zerothReadout, rows: 13 },
  thermotouch: { scene: thermoReadout, rows: 18 },
  buildcored: { scene: buildcoredReadout, rows: 14 },
};

const DIAGRAM_SCENES: Record<string, Scene> = Object.fromEntries(
  Object.entries(DIAGRAMS).map(([slug, spec]) => [slug, diagram(spec)])
);

const CAPTION: Record<Panel, string> = {
  film: 'render — blender → ascii',
  diagram: 'architecture',
  readout: 'results',
};

const STATUS: Record<Project['status'], { label: string; dot: string; color: string }> = {
  'in-progress': { label: 'building', dot: '●', color: 'var(--live)' },
  completed: { label: 'shipped', dot: '○', color: 'subtle' },
  archived: { label: 'archived', dot: '◌', color: 'subtle' },
};

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const LAYERS = ['subtle', 'text', 'var(--live)'];
const year = (date: string) => (date ? new Date(date).getFullYear() : null);

function CliPanel({ projects }: { projects: Entry[] }) {
  const building = projects.filter((p) => p.status === 'in-progress').length;
  const years = projects.map((p) => year(p.date)).filter((y): y is number => y !== null);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';

  return (
    <Box border="1px solid" borderColor="border" px={4} py={3} fontFamily="mono" fontSize="12px" lineHeight="1.8">
      <Text as="div" color="text">
        ▲ ls ~/projects --sort=intent
      </Text>
      <Text as="div" color="subtle">
        <Box as="span" color="var(--ok)">
          ✓
        </Box>{' '}
        {projects.length} entries · {building} building · {span}
      </Text>
    </Box>
  );
}

function Hero() {
  return (
    <Box position="relative" bg="text" color="background" mt={6}>
      <AsciiCanvas scene={field} rows={12} fontSize={10} label="Animated dithered flow field" opacity={0.85} />
      <Flex position="absolute" inset={0} p={3} justify="space-between" align="flex-end" pointerEvents="none">
        <Eyebrow color="background" bg="text" px={1}>
          fig. 0 — flow field, ordered dither
        </Eyebrow>
        <Eyebrow color="background" bg="text" px={1} display={{ base: 'none', md: 'block' }}>
          move the cursor
        </Eyebrow>
      </Flex>
    </Box>
  );
}

function Metrics({ projects }: { projects: Entry[] }) {
  const known = new Set(projects.map((p) => p.slug));
  const metrics = METRICS.filter((m) => known.has(m.slug));

  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', md: `repeat(${metrics.length}, 1fr)` }}
      gap="1px"
      bg="border"
      border="1px solid"
      borderColor="border"
      mt={6}
    >
      {metrics.map((m) => (
        <NextLink key={m.slug} href={`/projects/${m.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box bg="background" px={3} py={4} height="100%" cursor="pointer" role="group">
            <Eyebrow mb={2}>{m.label}</Eyebrow>
            <Text
              as="div"
              fontFamily="mono"
              fontSize="24px"
              fontWeight={400}
              letterSpacing="-0.02em"
              lineHeight="1"
              color="text"
              transition={`color 0.15s ${EASE}`}
              _groupHover={{ color: 'accent' }}
            >
              {m.value}
            </Text>
          </Box>
        </NextLink>
      ))}
    </Grid>
  );
}

function Tabs({ projects, active, onChange }: { projects: Entry[]; active: string; onChange: (c: string) => void }) {
  const count = (c: string) => projects.filter((p) => c === 'all' || CATEGORY[p.slug] === c).length;
  const tabs = ['all', ...CATEGORIES].filter((c) => count(c) > 0);

  return (
    <Flex gap={5} flexWrap="wrap" role="tablist" aria-label="Filter projects">
      {tabs.map((c) => (
        <Box
          as="button"
          key={c}
          role="tab"
          aria-selected={active === c}
          onClick={() => onChange(c)}
          fontFamily="mono"
          fontSize="12px"
          pb="3px"
          borderBottom="1px solid"
          borderColor={active === c ? 'text' : 'transparent'}
          color={active === c ? 'text' : 'subtle'}
          transition={`color 0.15s ${EASE}, border-color 0.15s ${EASE}`}
          _hover={{ color: 'text' }}
        >
          {c}{' '}
          <Box as="span" color="subtle">
            {count(c)}
          </Box>
        </Box>
      ))}
    </Flex>
  );
}

function PanelView({ slug, kind, title }: { slug: string; kind: Panel; title: string }) {
  if (kind === 'film') return <AsciiFilm slug={slug} label={`3D render of ${title}, drawn in ASCII`} />;
  if (kind === 'diagram') {
    const spec = DIAGRAMS[slug];
    return (
      <AsciiCanvas
        scene={DIAGRAM_SCENES[slug]}
        rows={spec.rows}
        fitCols={spec.cols}
        maxFontSize={13}
        fps={24}
        layerColors={LAYERS}
        label={`Architecture of ${title}`}
      />
    );
  }
  const readout = READOUTS[slug];
  return (
    <AsciiCanvas
      scene={readout.scene}
      rows={readout.rows}
      fitCols={64}
      maxFontSize={13}
      lineHeight={1.3}
      fps={24}
      layerColors={LAYERS}
      label={`Results for ${title}`}
    />
  );
}

function ProjectEntry({ project, index }: { project: Entry; index: number }) {
  const status = STATUS[project.status] ?? STATUS['in-progress'];
  const rows = PANELS[project.slug] ?? [];
  let fig = 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box py={10} borderTop="1px solid" borderColor="border">
        <Box maxW="650px" mx="auto">
          <Flex justify="space-between" fontFamily="mono" fontSize="11px" color="subtle" letterSpacing="0.071em">
            <Box as="span" textTransform="uppercase">
              {String(index + 1).padStart(2, '0')}
              {year(project.date) && ` · ${year(project.date)}`} · {CATEGORY[project.slug]}
            </Box>
            <Box as="span" textTransform="uppercase">
              <Box as="span" color={status.color}>
                {status.dot}
              </Box>{' '}
              {status.label}
            </Box>
          </Flex>

          <Text as="div" mt={3} fontFamily="mono" fontSize="18px" fontWeight={500} letterSpacing="-0.02em" lineHeight="1.3">
            <NextLink href={`/projects/${project.slug}`} className="ink-link">
              {project.title}
            </NextLink>
          </Text>
          <Text as="div" mt={2} fontFamily="mono" fontSize="13px" color="subtle" lineHeight="1.7">
            {project.description}
          </Text>
        </Box>

        {rows.length > 0 && (
          <Box mt={6} border="1px solid" borderColor="border" bg="border" display="grid" gap="1px">
            {rows.map((row, r) => (
              <Grid key={r} templateColumns={{ base: '1fr', md: `repeat(${row.length}, minmax(0, 1fr))` }} gap="1px">
                {row.map((kind) => {
                  fig += 1;
                  return (
                    <Box key={kind} bg="background" p={4} minW={0}>
                      <Eyebrow mb={3}>
                        fig. {index + 1}.{fig} — {CAPTION[kind]}
                      </Eyebrow>
                      <PanelView slug={project.slug} kind={kind} title={project.title} />
                    </Box>
                  );
                })}
              </Grid>
            ))}
          </Box>
        )}

        <Box maxW="650px" mx="auto" mt={5}>
          {project.stack.length > 0 && (
            <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" lineHeight="1.7">
              {project.stack.join(' · ')}
            </Text>
          )}
          {project.links && project.links.length > 0 && (
            <HStack spacing={4} mt={2} flexWrap="wrap">
              {project.links.map((link) => (
                <ChakraLink
                  key={link.href}
                  href={link.href}
                  isExternal={link.href.startsWith('http')}
                  className="ink-link"
                  fontFamily="mono"
                  fontSize="12px"
                >
                  {link.label.toLowerCase()} ↗
                </ChakraLink>
              ))}
            </HStack>
          )}
        </Box>
      </Box>
    </motion.article>
  );
}

const ProjectsPage = ({ projects, minor }: PageProps) => {
  const [category, setCategory] = useState('all');
  const shown = projects.filter((p) => category === 'all' || CATEGORY[p.slug] === category);

  return (
    <>
      <NextSeo title="Projects | Imamatdin" description="Things I've built or am currently building." />

      <Container maxW="650px" py={4}>
        <Box width="100%">
          <Eyebrow mb={3}>index / projects</Eyebrow>
          <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" lineHeight="1.1" color="text">
            Projects
          </Text>
          <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3} mb={6}>
            Things I&apos;ve built or am currently building.
          </Text>

          <CliPanel projects={projects} />
          <Hero />
          <Metrics projects={projects} />

          <Box mt={12} mb={2}>
            <Tabs projects={projects} active={category} onChange={setCategory} />
          </Box>

          {/* The figures need more room than the reading column: break out to
              a wider band centred on the page, text stays at 650px inside. */}
          <Box width="min(980px, calc(100vw - 32px))" position="relative" left="50%" transform="translateX(-50%)" mt={4}>
            {shown.map((project) => (
              <ProjectEntry key={project.slug} project={project} index={projects.indexOf(project)} />
            ))}
          </Box>

          {category === 'all' && minor.length > 0 && (
            <Box mt={6} pt={8} borderTop="1px solid" borderColor="border">
              <Eyebrow mb={4}>also</Eyebrow>
              {minor.map((p) => (
                <Grid key={p.slug} templateColumns="1fr auto" gap={4} py={2} fontFamily="mono" fontSize="13px">
                  <Box minW={0}>
                    <NextLink href={`/projects/${p.slug}`} className="ink-link">
                      {p.title}
                    </NextLink>
                    <Box as="span" color="subtle">
                      {' '}
                      — {p.description}
                    </Box>
                  </Box>
                  <Box color="subtle" fontSize="12px">
                    {year(p.date)}
                  </Box>
                </Grid>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };

  const all = getProjects()
    .sort((a, b) => {
      const byOrder = rank(a.slug) - rank(b.slug);
      if (byOrder !== 0) return byOrder;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map(({ content, ...p }) => {
      const line = content?.match(/\*\*Stack:\*\*\s*([\s\S]+?)(?:\n\s*\n|$)/);
      const stack = line ? line[1].replace(/\s+/g, ' ').split(/,\s*/).map((s) => s.trim()).filter(Boolean) : [];
      return { ...p, stack };
    });

  return {
    props: {
      projects: all.filter((p) => PANELS[p.slug]),
      minor: all.filter((p) => !PANELS[p.slug]),
    },
  };
};

export default ProjectsPage;
