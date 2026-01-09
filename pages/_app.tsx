import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { Prose, withProse } from '@nikolovlazar/chakra-ui-prose';
import Layout from '../components/Layout';
import { CommandPalette } from '../components/CommandPalette';
import { ReactElement } from 'react';
import { DefaultSeo } from 'next-seo';
import '../styles/terminal.css';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Colors (Terminal / Monospace Palette)
const semanticTokens = {
  colors: {
    background: { default: '#fafafa', _dark: '#0a0a0a' },
    text: { default: '#1a1a1a', _dark: '#e0e0e0' },
    accent: { default: '#0066cc', _dark: '#66b3ff' },
    subtle: { default: '#666666', _dark: '#999999' },
    border: { default: 'rgba(0, 0, 0, 0.1)', _dark: 'rgba(255, 255, 255, 0.1)' },
    highlight: { default: 'rgba(0, 0, 0, 0.05)', _dark: 'rgba(255, 255, 255, 0.05)' },
  },
};

const styles = {
  global: {
    body: {
      bg: 'background',
      color: 'text',
    },
    // Remove blue focus glow globally
    '*:focus': {
      boxShadow: 'none !important',
      outline: 'none !important',
    },
    '*:focus-visible': {
      boxShadow: 'none !important',
      outline: 'none !important',
    },
    'button:focus, a:focus, [tabindex]:focus': {
      boxShadow: 'none !important',
      outline: 'none !important',
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
    fonts: {
      heading: '"JetBrains Mono", "Fira Code", monospace',
      body: '"JetBrains Mono", "Fira Code", monospace',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
  },
  withProse({
    baseStyle: {
      'h1, h2, h3, h4, h5, h6': { color: 'text', fontFamily: 'mono' },
      a: { color: 'accent', textDecoration: 'underline', _hover: { opacity: 0.7 } },
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
