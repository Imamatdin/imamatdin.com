import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { Prose, withProse } from '@nikolovlazar/chakra-ui-prose';
import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { DefaultSeo } from 'next-seo';
import { Lora } from '@next/font/google';

const lora = Lora({ subsets: ['latin'], display: 'swap' });

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const semanticTokens = {
  colors: {
    background: { default: '#F5F1E8', _dark: '#2D323A' },
    text: { default: '#4C4237', _dark: '#D8DCE2' },
    accent: { default: '#8C2D2D', _dark: '#8AA895' },
    subtle: { default: '#8C7D6B', _dark: '#7A828E' },
  },
};

const styles = {
  global: {
    body: { bg: 'background', color: 'text' },
  },
};

const components = {
  Divider: { baseStyle: { borderColor: 'subtle' } },
  Tag: {
    variants: { solid: { container: { bg: 'accent', color: 'background' } } },
  },
};

const theme = extendTheme(
  {
    config,
    semanticTokens,
    styles,
    components,
    colors: { glow: '#87D3C3' }, // Your custom glow color
    fonts: {
      heading: lora.style.fontFamily,
      body: lora.style.fontFamily,
    },
  },
  withProse({
    baseStyle: {
      'h1, h2, h3, h4, h5, h6': { color: 'text' },
      a: { color: 'accent' },
    },
  })
);

const getDefaultLayout = (page: ReactElement) => (
  <Layout>
    <Prose>{page}</Prose>
  </Layout>
);

export default function App({ Component, pageProps }: AppProps) {
  // PostHog analytics and other logic remains unchanged
  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo title="Imamatdin | Personal Website" description="My personal website" />
      {getDefaultLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}