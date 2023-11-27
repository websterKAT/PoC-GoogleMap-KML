import Head from 'next/head';
import styles from '../styles/Home.module.css';
import NewMap from '../components/NewMap.js';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>PoC KML Display on Google maps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <NewMap />


       {/* <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>  */}

      <style jsx>{`
       
      `}</style>

      <style jsx global>{`
       
      `}</style>
    </div>
  );
}
