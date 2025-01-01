import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightLeft, Coins } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

export interface TokenCardProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    mint?: PublicKey;
    balance?: number;
  };
  onTrade?: () => void;
}

export const TokenCard = ({ token, onTrade }: TokenCardProps) => {
  return (
    <Card className="overflow-hidden border-none bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            {token.name || "Loading..."}
          </CardTitle>
          <div className="rounded-full bg-primary/10 p-2">
            <Coins className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Symbol</span>
            <span className="font-medium">{token.symbol || "..."}</span>
          </div>
          {token.balance !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Balance</span>
              <span className="font-medium">
                {token.balance.toLocaleString()} {token.symbol}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-primary/10 text-primary hover:bg-primary/20"
          variant="ghost"
          onClick={onTrade}
          disabled={!onTrade}
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Trade
        </Button>
      </CardFooter>
    </Card>
  );
};
