import { GetStaticProps } from "next";
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Link as ChakraLink,
  Tag,
  Wrap,
  WrapItem,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorMode
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { Book, getAllBooks } from "../lib/books";
import { useState } from "react";

interface PageProps {
  books: Book[];
}

export default function Reading({ books }: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorMode } = useColorMode();

  // Extract unique categories from books
  const allCategories = new Set<string>();
  books.forEach(book => {
    if (book.category) {
      if (Array.isArray(book.category)) {
        book.category.forEach(cat => allCategories.add(cat));
      } else {
        allCategories.add(book.category);
      }
    }
  });
  const categories = Array.from(allCategories);

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
                           (book.category && (
                             Array.isArray(book.category) 
                               ? book.category.includes(selectedCategory)
                               : book.category === selectedCategory
                           ));
    return matchesSearch && matchesCategory;
  });

  // Group by year
  const booksByYear: { [key: string]: Book[] } = {};
  filteredBooks.forEach(book => {
    const year = book.date ? new Date(book.date).getFullYear().toString() : 'Undated';
    if (!booksByYear[year]) {
      booksByYear[year] = [];
    }
    booksByYear[year].push(book);
  });

  const years = Object.keys(booksByYear).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return parseInt(b) - parseInt(a);
  });

  // Stats
  const thisYear = new Date().getFullYear().toString();
  const booksThisYear = books.filter(b => 
    b.date && new Date(b.date).getFullYear().toString() === thisYear
  ).length;

  return (
    <Container maxW="5xl" py={12}>
      {/* Header */}
      <VStack align="stretch" spacing={8} mb={12}>
        <Box>
          <Heading size="2xl" mb={2}>Reading</Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
            Books I&apos;ve read and my notes on them.
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Stat 
            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'} 
            p={4} 
            borderRadius="lg"
            border="1px solid"
            borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
          >
            <StatLabel fontSize="sm">This Year</StatLabel>
            <StatNumber fontSize="3xl">{booksThisYear}</StatNumber>
          </Stat>
          <Stat 
            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'} 
            p={4} 
            borderRadius="lg"
            border="1px solid"
            borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
          >
            <StatLabel fontSize="sm">Total Books</StatLabel>
            <StatNumber fontSize="3xl">{books.length}</StatNumber>
          </Stat>
          <Stat 
            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'} 
            p={4} 
            borderRadius="lg"
            border="1px solid"
            borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
          >
            <StatLabel fontSize="sm">Categories</StatLabel>
            <StatNumber fontSize="3xl">{categories.length || '—'}</StatNumber>
          </Stat>
          <Stat 
            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'} 
            p={4} 
            borderRadius="lg"
            border="1px solid"
            borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
          >
            <StatLabel fontSize="sm">Avg Rating</StatLabel>
            <StatNumber fontSize="3xl">
              {books.filter(b => b.rating).length > 0
                ? (books.reduce((acc, b) => acc + (b.rating || 0), 0) / 
                   books.filter(b => b.rating).length).toFixed(1)
                : '—'}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Search */}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
          />
        </InputGroup>

        {/* Category Filters */}
        {categories.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600" _dark={{ color: "gray.400" }}>
              Categories
            </Text>
            <Wrap spacing={2}>
              <WrapItem>
                <Tag
                  size="lg"
                  cursor="pointer"
                  onClick={() => setSelectedCategory(null)}
                  bg={!selectedCategory ? 'blue.500' : 'gray.200'}
                  color={!selectedCategory ? 'white' : 'gray.700'}
                  _dark={{ 
                    bg: !selectedCategory ? 'blue.400' : 'whiteAlpha.200',
                    color: !selectedCategory ? 'white' : 'gray.300'
                  }}
                  _hover={{ opacity: 0.8 }}
                  transition="all 0.2s"
                >
                  All ({books.length})
                </Tag>
              </WrapItem>
              {categories.map(category => {
                const count = books.filter(b => 
                  b.category && (
                    Array.isArray(b.category) 
                      ? b.category.includes(category)
                      : b.category === category
                  )
                ).length;
                
                return (
                  <WrapItem key={category}>
                    <Tag
                      size="lg"
                      cursor="pointer"
                      onClick={() => setSelectedCategory(category)}
                      bg={selectedCategory === category ? 'blue.500' : 'gray.200'}
                      color={selectedCategory === category ? 'white' : 'gray.700'}
                      _dark={{ 
                        bg: selectedCategory === category ? 'blue.400' : 'whiteAlpha.200',
                        color: selectedCategory === category ? 'white' : 'gray.300'
                      }}
                      _hover={{ opacity: 0.8 }}
                      transition="all 0.2s"
                    >
                      {category} ({count})
                    </Tag>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Box>
        )}
      </VStack>

      {/* Books List */}
      <VStack spacing={10} align="stretch">
        {years.map(year => (
          <Box key={year}>
            <Heading size="md" mb={4} color="gray.500" _dark={{ color: "gray.400" }}>
              {year}
            </Heading>
            <VStack spacing={3} align="stretch">
              {booksByYear[year].map((book) => {
                const date = book.date ? new Date(book.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                
                return (
                  <HStack 
                    key={book.slug} 
                    justify="space-between" 
                    align="center"
                    p={3}
                    borderRadius="md"
                    _hover={{ 
                      bg: colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50',
                    }}
                    transition="all 0.2s"
                  >
                    <NextLink href={`/books/${book.slug}`} passHref legacyBehavior>
                      <ChakraLink
                        fontSize="lg"
                        fontWeight="medium"
                        color="accent"
                        _hover={{ opacity: 0.8 }}
                      >
                        {book.title}
                      </ChakraLink>
                    </NextLink>
                    <Text fontSize="sm" color="gray.500" flexShrink={0}>
                      {date}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </Box>
        ))}
      </VStack>

      {filteredBooks.length === 0 && (
        <Text color="gray.500" textAlign="center" py={8}>
          No books found. Try adjusting your filters.
        </Text>
      )}
    </Container>
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