import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { Prose, withProse } from '@nikolovlazar/chakra-ui-prose';
import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { DefaultSeo } from 'next-seo';
import '../styles/parchment.css';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Colors (Da Vinci / Parchment Palette)
const semanticTokens = {
  colors: {
    background: { default: '#f5f0e8', _dark: '#1a1612' },
    text: { default: '#3a2a1a', _dark: '#e8dfd0' },
    accent: { default: '#704214', _dark: '#8b4513' },
    subtle: { default: '#6b5c4a', _dark: '#a89060' },
    parchment: { default: '#f5f0e8', _dark: '#2a1a0a' },
    ink: { default: '#3a2a1a', _dark: '#d4c4a8' },
  },
};

const styles = {
  global: {
    body: {
      bg: 'background',
      color: 'text',
    },
  },
};

const components = {
  Divider: { baseStyle: { borderColor: 'subtle' } },
  Tag: {
    variants: { solid: { container: { bg: 'accent', color: 'background' } } },
  },
  Code: {
    baseStyle: {
      fontFamily: 'mono',
      fontSize: 'sm',
    }
  }
};

const theme = extendTheme(
  {
    config,
    semanticTokens,
    styles,
    components,
    colors: {
      glow: '#87D3C3',
      parchment: {
        50: '#faf8f5',
        100: '#f5f0e8',
        200: '#e8dfd0',
        300: '#d4c4a8',
        400: '#c4b08a',
        500: '#a89060',
      },
      ink: {
        50: '#6b5c4a',
        100: '#5a4a3a',
        200: '#4a3a2a',
        300: '#3a2a1a',
        400: '#2a1a0a',
      },
      sepia: {
        rust: '#8b4513',
        ochre: '#cc7722',
        umber: '#635147',
        main: '#704214',
      },
    },
    fonts: {
      heading: '"Lora", Georgia, serif',
      body: '"Lora", Georgia, serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
      handwriting: '"Cedarville Cursive", "Homemade Apple", cursive',
    },
  },
  withProse({
    baseStyle: {
      'h1, h2, h3, h4, h5, h6': { color: 'text', fontFamily: 'heading' },
      a: { color: 'accent', textDecoration: 'none', _hover: { opacity: 0.7 } },
      code: { fontFamily: 'mono', color: 'accent', bg: 'transparent' },
    },
  })
);

const getDefaultLayout = (page: ReactElement) => (
  <Layout>
    <Prose>{page}</Prose>
  </Layout>
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo
        title="Imamatdin Sultaniyazov"
        description="18-year-old passionate about emerging tech, engineering, and Karakalpak culture"
        canonical="https://imamatdin.com"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://imamatdin.com',
          siteName: 'Imamatdin Sultaniyazov',
        }}
        twitter={{
          handle: '@Imamatdin_S',
          site: '@Imamatdin_S',
          cardType: 'summary_large_image',
        }}
      />
      {getDefaultLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}
