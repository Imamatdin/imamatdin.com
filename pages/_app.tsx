import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { Prose, withProse } from '@nikolovlazar/chakra-ui-prose';
import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { DefaultSeo } from 'next-seo';
import { Lora, JetBrains_Mono, Cedarville_Cursive } from '@next/font/google';
import '../styles/parchment.css';

// --- 1. FONT CONFIGURATION (Da Vinci Style) ---
const lora = Lora({ subsets: ['latin'], display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' });
const handwriting = Cedarville_Cursive({ weight: '400', subsets: ['latin'], display: 'swap' });

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// --- 2. COLORS (Da Vinci / Parchment Palette) ---
const semanticTokens = {
  colors: {
    // Light: Parchment | Dark: Aged Parchment Dark
    background: { default: '#f5f0e8', _dark: '#1a1612' },
    // Light: Dark Ink | Dark: Light Parchment
    text: { default: '#3a2a1a', _dark: '#e8dfd0' },
    // Light: Sepia Accent | Dark: Rust
    accent: { default: '#704214', _dark: '#8b4513' },
    // Muted text colors (faded ink)
    subtle: { default: '#6b5c4a', _dark: '#a89060' },
    // Parchment shades
    parchment: {
      default: '#f5f0e8',
      _dark: '#2a1a0a',
    },
    // Ink colors
    ink: {
      default: '#3a2a1a',
      _dark: '#d4c4a8',
    },
  },
};

// --- 3. GLOBAL STYLES (Clean & Simple) ---
const styles = {
  global: {
    body: {
      bg: 'background',
      color: 'text',
    },
  },
};

// --- 4. COMPONENT OVERRIDES ---
const components = {
  Divider: { baseStyle: { borderColor: 'subtle' } },
  Tag: {
    variants: { solid: { container: { bg: 'accent', color: 'background' } } },
  },
  // Make code blocks look like terminals
  Code: {
    baseStyle: {
      fontFamily: 'mono',
      fontSize: 'sm',
    }
  }
};

// --- 5. THEME ASSEMBLY (Da Vinci Style) ---
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
      heading: lora.style.fontFamily,
      body: lora.style.fontFamily,
      mono: mono.style.fontFamily,
      handwriting: handwriting.style.fontFamily,
    },
  },
  withProse({
    baseStyle: {
      'h1, h2, h3, h4, h5, h6': { color: 'text', fontFamily: 'heading' },
      a: { color: 'accent', textDecoration: 'none', borderBottom: '1px dashed', borderColor: 'accent' },
      code: { fontFamily: 'mono', color: 'accent', bg: 'transparent' },
    },
  })
);

const getDefaultLayout = (page: ReactElement) => (
  <Layout>
    <Prose>{page}</Prose>
  </Layout>
);

// --- 6. MAIN APP COMPONENT ---
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      {/* Inject CSS variables for use in custom components */}
      <style jsx global>{`
        :root {
          --font-lora: ${lora.style.fontFamily};
          --font-mono: ${mono.style.fontFamily};
          --font-handwriting: ${handwriting.style.fontFamily};
          --color-parchment: #f5f0e8;
          --color-ink: #3a2a1a;
          --color-sepia: #704214;
        }
      `}</style>
      
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