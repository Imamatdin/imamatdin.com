import { GetStaticProps } from "next";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { Book, getAllBooks } from "../lib/books";
import { CategorizedBookshelf, RunningBookshelf } from "../components/Bookshelf";

interface PageProps {
  books: Book[];
}

export default function Reading({ books }: PageProps) {
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');
  const tabSelectedBg = useColorModeValue('rgba(139, 90, 43, 0.1)', 'rgba(168, 144, 96, 0.1)');

  // Stats
  const thisYear = new Date().getFullYear().toString();
  const booksThisYear = books.filter(b =>
    b.date && new Date(b.date).getFullYear().toString() === thisYear
  ).length;

  return (
    <>
      <NextSeo
        title="Library | Imamatdin"
        description="Books I've read and my notes on them."
      />

      <Box
        minH="100vh"
        bg={bgColor}
        position="relative"
        className="parchment-bg"
      >
        <Container maxW="1200px" py={12}>
          {/* Header */}
          <VStack align="stretch" spacing={8} mb={12}>
            <Heading
              as="h1"
              fontFamily="handwriting"
              fontSize={{ base: '4xl', md: '5xl' }}
              color={inkColor}
              textAlign="center"
              transform="rotate(-1deg)"
            >
              My Library
            </Heading>

            <Text
              fontFamily="body"
              fontSize="lg"
              color={inkLight}
              textAlign="center"
              maxW="600px"
              mx="auto"
            >
              Books I've read and my notes on them.
            </Text>

            {/* Stats */}
            <HStack justify="center" spacing={8}>
              <VStack spacing={0}>
                <Text fontFamily="handwriting" fontSize="3xl" color={inkColor}>
                  {booksThisYear}
                </Text>
                <Text fontFamily="handwriting" fontSize="sm" color={inkLight}>
                  this year
                </Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontFamily="handwriting" fontSize="3xl" color={inkColor}>
                  {books.length}
                </Text>
                <Text fontFamily="handwriting" fontSize="sm" color={inkLight}>
                  total volumes
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Bookshelf display options */}
          <Tabs variant="unstyled" defaultIndex={0}>
            <TabList justifyContent="center" mb={8}>
              <Tab
                fontFamily="handwriting"
                fontSize="sm"
                color={inkLight}
                px={4}
                py={2}
                border="1px solid"
                borderColor={borderColor}
                borderRight="none"
                _selected={{
                  color: inkColor,
                  bg: tabSelectedBg,
                }}
              >
                by category
              </Tab>
              <Tab
                fontFamily="handwriting"
                fontSize="sm"
                color={inkLight}
                px={4}
                py={2}
                border="1px solid"
                borderColor={borderColor}
                _selected={{
                  color: inkColor,
                  bg: tabSelectedBg,
                }}
              >
                running shelf
              </Tab>
            </TabList>

            <TabPanels>
              {/* Option A: Categorized Bookshelf */}
              <TabPanel px={0}>
                <CategorizedBookshelf books={books} />
              </TabPanel>

              {/* Option B: Running Bookshelf */}
              <TabPanel px={0}>
                <RunningBookshelf books={books} speed={40} />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Empty state */}
          {books.length === 0 && (
            <Text
              fontFamily="handwriting"
              fontSize="lg"
              color={inkLight}
              textAlign="center"
              py={12}
            >
              The library is empty...
            </Text>
          )}

          {/* Page number */}
          <Text
            position="fixed"
            bottom={4}
            right={8}
            fontFamily="handwriting"
            fontSize="sm"
            color={inkLight}
            zIndex={10}
          >
            folio iii
          </Text>
        </Container>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allBooks = getAllBooks();

  // Remove content to reduce page size
  const books = allBooks.map(({ content, ...book }) => book);

  return {
    props: {
      books,
    },
  };
};
