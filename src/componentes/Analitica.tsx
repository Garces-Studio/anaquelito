'use client';

import Script from 'next/script';

const ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analitica() {
  if (!ID || !/^G-[A-Z0-9]+$/.test(ID)) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
    <Script id="anaquelito-ga4" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${ID}', { send_page_view: true });
    `}</Script>
  </>;
}
