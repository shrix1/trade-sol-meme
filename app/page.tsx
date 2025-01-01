import TokenList from "@/components/token-list";
import WalletProvider from "@/components/wallet-provider";

export default function Home() {
  return (
    <WalletProvider>
      <main className="container mx-auto p-4 h-screen w-screen flex flex-col items-center justify-center">
        <TokenList />
      </main>
    </WalletProvider>
  );
}
