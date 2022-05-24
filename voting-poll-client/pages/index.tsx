import type { NextPage } from "next";
import Head from "next/head";
import VotaButton from "../ components/button";
import PollCard from "../ components/poll-card";
import WalletConnected from "../ components/wallet-connected";
import { useAppContext } from "../context";
import { IPoll } from "../hooks/useWallet";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const context: any = useAppContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>Vota</title>
        <meta name="description" content="vota app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>Vota</a>
        </h1>

        <div className={styles.btnContainer}>
          {context.isConnected ? (
            <div>
              <WalletConnected walletAddress={context.address}></WalletConnected>

            </div>
          ) : (
            <VotaButton handleClick={context.connectWallet}></VotaButton>
          )}
        </div>

        <div className={styles.grid}>
          {context.polls.map((data: IPoll, index: number) => (
            <PollCard
              key={`${index}-0x`}
              id={data.id}
              title={data.title}
              description={data.description}
            ></PollCard>
          ))}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
