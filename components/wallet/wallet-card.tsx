"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, LogOut, Wallet } from "lucide-react";

interface WalletCardProps {
  isLoading: boolean;
}

export const WalletCard = ({ isLoading }: WalletCardProps) => {
  const { publicKey, disconnect } = useWallet();

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
    <Card className="overflow-hidden border-none bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-muted-foreground">
                Connected Wallet
              </span>
              <span className="font-medium">
                {shortenAddress(publicKey?.toBase58() || "")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-primary/10 hover:bg-primary/20"
              onClick={() => {
                navigator.clipboard.writeText(publicKey?.toBase58() || "");
                toast.success("Address copied to clipboard");
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
              onClick={handleDisconnect}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
