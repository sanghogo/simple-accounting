import '@/styles/globals.css'
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <Component {...pageProps} />
    </>
  );
}
