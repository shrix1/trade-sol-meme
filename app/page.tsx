import WalletProvider from "@/components/WalletProvider";
import TokenList from "@/components/TokenList";

export default function Home() {
  return (
    <WalletProvider>
      <main className="container mx-auto p-4 h-screen w-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Solana Trading App</h1>
        <TokenList />
      </main>
    </WalletProvider>
  );
}
