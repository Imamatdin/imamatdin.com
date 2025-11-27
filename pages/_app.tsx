import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { Prose, withProse } from '@nikolovlazar/chakra-ui-prose';
import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { DefaultSeo } from 'next-seo';
import { Lora, JetBrains_Mono, Cedarville_Cursive } from '@next/font/google';

// --- 1. FONT CONFIGURATION ---
const lora = Lora({ subsets: ['latin'], display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap' });
const handwriting = Cedarville_Cursive({ weight: '400', subsets: ['latin'], display: 'swap' });

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// --- 2. COLORS (Flexoki Warm Palette) ---
const semanticTokens = {
  colors: {
    // Light: Warm Paper | Dark: True Black
    background: { default: '#FFFCF0', _dark: '#100F0F' },
    // Light: Black Text | Dark: Soft Paper
    text: { default: '#100F0F', _dark: '#F2F0E5' },
    // Light: Orange Accent | Dark: Lighter Orange
    accent: { default: '#BC5215', _dark: '#DA702C' },
    // Muted text colors
    subtle: { default: '#6F6E69', _dark: '#878580' },
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

// --- 5. THEME ASSEMBLY ---
const theme = extendTheme(
  {
    config,
    semanticTokens,
    styles,
    components,
    colors: { glow: '#87D3C3' },
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