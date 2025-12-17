import { Box, Image, Text, useColorModeValue } from "@chakra-ui/react";

interface FigureProps {
  src: string;
  alt?: string;
  caption?: string;
}

export function Figure({ src, alt, caption }: FigureProps) {
  const captionColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box my={8} textAlign="center">
      <Image
        src={src}
        alt={alt || caption || ""}
        maxW="100%"
        mx="auto"
        borderRadius="md"
        boxShadow="0 4px 16px rgba(0,0,0,0.1)"
      />
      {caption && (
        <Text
          mt={3}
          fontSize="sm"
          fontFamily="handwriting"
          color={captionColor}
          fontStyle="italic"
        >
          {caption}
        </Text>
      )}
    </Box>
  );
}

export default Figure;
