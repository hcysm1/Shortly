import Head from "next/head";
import Header from "../components/Header";
import ShortenerForm from "../components/ShortenerForm";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Shortly</title>
      </Head>
      <header>
        <Header />
      </header>
      <main className="flex flex-col items-center justify-center py-10">
        <ShortenerForm />
      </main>
    </div>
  );
}
