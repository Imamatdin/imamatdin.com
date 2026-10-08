import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { AsciiCanvas } from '../../components/experiments/AsciiCanvas';
import { Eyebrow, ExperimentShell } from '../../components/experiments/ExperimentShell';
import { field } from '../../components/experiments/scenes';

const EXPERIMENTS = [
  {
    href: '/design-experiments/projects',
    title: 'projects — figures',
    date: '2026-10-08',
    summary:
      'Each project as numbered figures: a Blender render converted to edge-aware ASCII, its real architecture with a signal stepping through it, and its measured results.',
    refs: 'husanisomiddinov · husanmavlonov · teenage engineering · vercel · paper shaders',
  },
];

const SWATCHES = [
  { mode: 'noon', bg: '#FFFFFF', text: '#100F0F', note: 'default · neutral' },
  { mode: 'candle', bg: '#FFFCF0', text: '#100F0F', note: 'flexoki paper' },
  { mode: 'night', bg: '#100F0F', text: '#CECDC3', note: 'flexoki black' },
];

const DesignExperiments = () => (
  <>
    <NextSeo title="Design experiments | Imamatdin" noindex nofollow />

    <Container maxW="650px" py={4}>
      <ExperimentShell>
        <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" color="text">
          Design experiments
        </Text>
        <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3} mb={8} lineHeight="1.7">
          Copies of live pages with a new direction applied. Nothing here touches the real site.
        </Text>

        <Box bg="text" color="background" mb={10}>
          <AsciiCanvas scene={field} rows={6} label="Animated dithered flow field" opacity={0.85} />
        </Box>

        <Eyebrow mb={3}>experiments</Eyebrow>
        <Box borderTop="1px solid" borderColor="border">
          {EXPERIMENTS.map((exp, i) => (
            <NextLink key={exp.href} href={exp.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Grid
                templateColumns="3ch 1fr"
                gap={3}
                py={4}
                borderBottom="1px solid"
                borderColor="border"
                cursor="pointer"
                role="group"
              >
                <Text as="div" fontFamily="mono" fontSize="12px" color="subtle">
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Box>
                  <Flex justify="space-between" gap={3} flexWrap="wrap">
                    <Text
                      as="div"
                      fontFamily="mono"
                      fontSize="14px"
                      fontWeight={500}
                      color="text"
                      _groupHover={{ color: 'accent' }}
                      transition="color 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      {exp.title}
                    </Text>
                    <Text as="div" fontFamily="mono" fontSize="12px" color="subtle">
                      {exp.date}
                    </Text>
                  </Flex>
                  <Text as="div" fontFamily="mono" fontSize="12.5px" color="subtle" mt={1} lineHeight="1.65">
                    {exp.summary}
                  </Text>
                  <Eyebrow mt={2}>refs: {exp.refs}</Eyebrow>
                </Box>
              </Grid>
            </NextLink>
          ))}
        </Box>

        <Eyebrow mt={12} mb={3}>
          modes
        </Eyebrow>
        <Grid templateColumns="repeat(3, 1fr)" gap="1px" bg="border" border="1px solid" borderColor="border">
          {SWATCHES.map((s) => (
            <Box key={s.mode} bg="background">
              <Flex bg={s.bg} color={s.text} height="56px" align="flex-end" p={2} fontFamily="mono" fontSize="18px">
                Aa
              </Flex>
              <Box px={2} py={2}>
                <Eyebrow color="text">{s.mode}</Eyebrow>
                <Text as="div" fontFamily="mono" fontSize="11px" color="subtle" mt={1}>
                  {s.bg} · {s.note}
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
        <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" mt={3} lineHeight="1.7">
          Site-wide now: hover the toggle in the header to pick, click it to cycle. Flexoki has no pure white; its
          lightest tone, paper, is warm on purpose, which is why the old site read beige. Noon keeps Flexoki&apos;s ink
          and greys on neutral white. Hacker mode (konami) still overrides all three.
        </Text>
      </ExperimentShell>
    </Container>
  </>
);

export default DesignExperiments;
