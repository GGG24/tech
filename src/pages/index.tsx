import Head from 'next/head'
import CssProblemsDemo from '@/components/CssProblemsDemo'

export default function Home() {
  return (
    <>
      <Head>
        <title>CSS Problems Demo</title>
        <meta name="description" content="Demonstration of common CSS problems and solutions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CssProblemsDemo />
      </main>
    </>
  )
}
