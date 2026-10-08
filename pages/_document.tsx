import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="view-transition" content="same-origin" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          as="style"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M61FCSRJR9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-M61FCSRJR9');
        `}
        </Script>
      </Head>
      <body>
        <ColorModeScript initialColorMode="light" />
        {/* Applies the saved mode before first paint (?mode= overrides it for a
            shareable link). Visitors from before the three modes keep night if
            Chakra had them on dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var q=new URLSearchParams(location.search).get('mode');var m=q||localStorage.getItem('site-mode');if(m!=='noon'&&m!=='candle'&&m!=='night'){m=localStorage.getItem('chakra-ui-color-mode')==='dark'?'night':'noon'}document.documentElement.setAttribute('data-mode',m)}catch(e){}})()`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
