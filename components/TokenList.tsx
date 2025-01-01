"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork, WalletName } from "@solana/wallet-adapter-base";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletCard } from "./wallet/WalletCard";
import { BalanceCard } from "./wallet/BalanceCard";
import { TokenCard } from "./wallet/TokenCard";

interface Token {
  id: string;
  name: string;
  symbol: string;
}

const TokenList = () => {
  const { connected, publicKey, connect, select } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      toast.success("Connected to wallet");
      fetchBalance();
      // fetchTokens();
    }
  }, [connected, publicKey]);

  const handleConnect = async (walletName?: WalletName) => {
    try {
      setIsLoading(true);
      if (walletName) {
        await select(walletName);
      }
      await connect();
    } catch (error) {
      toast.error("Failed to connect wallet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!publicKey) return;
    try {
      const network = WalletAdapterNetwork.Devnet;
      const connection = new Connection(clusterApiUrl(network));
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      toast.error("Error fetching balance");
      console.error("Error fetching balance:", error);
    }
  };

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.pump.fun/v1/tokens");
      const data = await response.json();
      setTokens(data.tokens);
      toast.success("Tokens fetched");
    } catch (error) {
      toast.error("Error fetching tokens");
      console.error("Error fetching tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <WalletCard isLoading={isLoading} onConnect={handleConnect} />

      {connected ? (
        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="balance">
            <BalanceCard balance={balance} />
          </TabsContent>
          <TabsContent value="tokens">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <TokenCard
                      key={index}
                      token={{ id: `loading-${index}`, name: "", symbol: "" }}
                    />
                  ))
                : tokens.map((token) => (
                    <TokenCard key={token.id} token={token} />
                  ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-center text-lg mb-4">
              Please connect your wallet to view your balance and tokens.
            </p>
            <Button onClick={() => handleConnect()}>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TokenList;
