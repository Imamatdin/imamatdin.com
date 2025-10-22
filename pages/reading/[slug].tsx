import { VStack, Heading, Text, Divider, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const bookNotes = {
  "the-war-of-art": {
    title: "The War of Art",
    author: "Steven Pressfield",
    notes: `This is where my detailed reflection on The War of Art goes.
Pressfield's concept of "Resistance" is a powerful mental model. He defines
it as the universal force that acts against human creativity. My main takeaway
was the idea of "turning pro." This means you show up and do the work regardless
of inspiration or fear. It is the act of committing to the craft.`,
  },
  dune: {
    title: "Dune",
    author: "Frank Herbert",
    notes: `Here are my detailed notes on Dune. The world-building is immense,
exploring themes of ecology, religion, and politics. The idea of "spice"
as a resource that controls the universe is a clear allegory for oil.
I was most interested in the Bene Gesserit and their manipulation of
bloodlines and religion for political control.`,
  },
};

const BookNotesPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const book = bookNotes[slug as keyof typeof bookNotes];

  if (!book) {
    return <Text>Loading notes...</Text>;
  }

  return (
    <>
      <NextSeo title={`${book.title} | Reading Notes`} />
      <VStack spacing={4} w="full" align="flex-start">
        <Heading as="h1" size="xl">
          {book.title}
        </Heading>
        <Text color="gray.500" mt="-2 !important">
          by {book.author}
        </Text>
        <Divider />
        <Text whiteSpace="pre-wrap">{book.notes}</Text>
        <Divider />
        <NextLink href="/reading" passHref>
          <Link color="blue.500">← Back to Reading List</Link>
        </NextLink>
      </VStack>
    </>
  );
};

export default BookNotesPage;