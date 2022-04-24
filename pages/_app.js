import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import '../styles/globals.css';
import Head from 'next/head';

export default function MyApp({ 
  Component, 
  pageProps: { 
    session, 
    ...pageProps 
  }, }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Head>
          <title>Spotify 2.0</title>
        </Head>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}
