import { VStack, Heading, Text, Container, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { DeepDive, getDeepDives } from '../lib/deep-dives';

interface PageProps {
  dives: DeepDive[];
}

const DeepDivesListPage = ({ dives }: PageProps) => (
  <>
    <NextSeo
      title="Deep Dives | Imamatdin"
      description="Ideas I had and am exploring."
    />

    <Container maxW="650px" py={4}>
      <Heading fontFamily="mono" fontSize="xl" color="text" mb={6}>
        Deep Dives
      </Heading>

      <Box border="1px solid" borderColor="border" px={5} py={4}>
        <Text fontFamily="mono" fontSize="12px" color="subtle" mb={4}>
          Ideas I had and am exploring
        </Text>

        <VStack align="stretch" spacing={3}>
          {dives.map((dive) => (
            <NextLink href={`/deep-dives/${dive.slug}`} key={dive.slug}>
              <Text
                fontFamily="mono"
                fontSize="14px"
                fontWeight="bold"
                color="accent"
                textDecoration="underline"
                cursor="pointer"
                _hover={{ opacity: 0.7 }}
              >
                {dive.title}
              </Text>
            </NextLink>
          ))}
        </VStack>
      </Box>
    </Container>
  </>
);

export const getStaticProps: GetStaticProps<PageProps> = async () => ({
  props: { dives: getDeepDives() },
});

export default DeepDivesListPage;
