import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

// Partials
import { Header } from "../partials/Header";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Header />
      <Component 
        {...pageProps}  
        style={{
          padding: "2rem 0rem 1rem 0rem",
        }}
      />
      <footer>
      </footer>
    </>
  );
}

export default MyApp
