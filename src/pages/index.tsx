import Navbar from "@/components/Navbar";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter()
  const title = `${router.query.slug ?? 'Dashboard'}`;
  return (
    <div>
      <Head>
        <title>IGR CPG | {title}</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Selamat datang!???</h1>
      </main>
    </div>
  );
}
