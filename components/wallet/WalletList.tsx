"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletListProps {
  onSelect: (walletName: WalletName) => void;
}

export const WalletList = ({ onSelect }: WalletListProps) => {
  const { wallets } = useWallet();

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-10">
      <CardContent className="py-2">
        <div className="flex flex-col gap-2">
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onSelect(wallet.adapter.name)}
            >
              <Wallet className="w-4 h-4" />
              {wallet.adapter.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
