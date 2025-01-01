"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { WalletList } from "./WalletList";
import { Copy, Wallet } from "lucide-react";

interface WalletCardProps {
  isLoading: boolean;
  onConnect: (walletName?: WalletName) => Promise<void>;
}

export const WalletCard = ({ isLoading, onConnect }: WalletCardProps) => {
  const { connected, publicKey, disconnect } = useWallet();
  const [showWalletList, setShowWalletList] = useState(false);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (error) {
      toast.error("Failed to disconnect wallet");
      console.error(error);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(-7)}`;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Solana Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Connected Wallet</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {shortenAddress(publicKey?.toBase58() || "")}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey?.toBase58() || "");
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="px-4"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Button
              className="w-full sm:w-auto"
              onClick={() => setShowWalletList(!showWalletList)}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
            {showWalletList && (
              <WalletList
                onSelect={(walletName) => {
                  onConnect(walletName);
                  setShowWalletList(false);
                }}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
