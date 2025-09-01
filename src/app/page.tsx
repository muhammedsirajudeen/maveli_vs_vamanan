import Head from "next/head";
import Hero from "./components/hero";
import { StickyCTA } from "./components/sticky-cta";

export default function Page() {
  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="https://onam.ciltriq.com/winner.png"
        />
      </Head>
      <main>
        <Hero />
        <StickyCTA />
      </main>
    </>
  );
}
