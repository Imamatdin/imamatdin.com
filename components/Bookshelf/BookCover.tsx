import { Box, Text, Image, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';

interface BookCoverProps {
  book: {
    slug: string;
    title: string;
    author: string;
    coverImage?: string | null;
    spineColor?: string | null;
    textColor?: string | null;
  };
  width?: string;
  height?: string;
}

export function BookCover({ book, width = '120px', height = '180px' }: BookCoverProps) {
  const defaultSpineColor = useColorModeValue('#5a4a3a', '#3a2a1a');
  const defaultTextColor = useColorModeValue('#f5f0e8', '#d4c4a8');

  const hasImage = book.coverImage && book.coverImage.length > 0;
  const spineColor = book.spineColor || defaultSpineColor;
  const textColor = book.textColor || defaultTextColor;

  return (
    <NextLink href={`/reading/${book.slug}`}>
      <Box
        w={width}
        h={height}
        flexShrink={0}
        position="relative"
        cursor="pointer"
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-8px)' }}
      >
        {hasImage ? (
          <Image
            src={book.coverImage!}
            alt={book.title}
            w="100%"
            h="100%"
            objectFit="cover"
            boxShadow="4px 4px 8px rgba(0,0,0,0.3)"
          />
        ) : (
          // Generated book spine
          <Box
            w="100%"
            h="100%"
            bg={spineColor}
            boxShadow="4px 4px 8px rgba(0,0,0,0.3)"
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            {/* Spine text - vertical */}
            <Text
              fontFamily="body"
              fontSize="xs"
              color={textColor}
              transform="rotate(-90deg)"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW={height}
              textAlign="center"
              px={2}
            >
              {book.title}
            </Text>

            {/* Spine decoration lines */}
            <Box
              position="absolute"
              top={2}
              left={2}
              right={2}
              h="2px"
              bg="rgba(255,255,255,0.2)"
            />
            <Box
              position="absolute"
              bottom={2}
              left={2}
              right={2}
              h="2px"
              bg="rgba(255,255,255,0.2)"
            />
          </Box>
        )}
      </Box>
    </NextLink>
  );
}

export default BookCover;
