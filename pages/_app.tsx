import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import { MantineProvider } from '@mantine/core';


// Partials
import { Header } from "../partials/Header";

function MyApp({ Component, pageProps }: AppProps) {
  const { session, account } = pageProps;

  return (
    <MantineProvider theme={{ colorScheme: 'light' }}>
      <SessionProvider session={session}>
        <Header account={account} />
        <Component 
          {...pageProps}  
          style={{
            padding: "2rem 0rem 1rem 0rem",
          }}
        />
        <footer>
        </footer>
      </SessionProvider>
    </MantineProvider>
  );
}

export default MyApp
