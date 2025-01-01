import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";

interface BalanceCardProps {
  balance: number | null;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          SOL Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balance !== null ? (
          <p className="text-3xl font-bold">{balance.toFixed(4)} SOL</p>
        ) : (
          <Skeleton className="h-9 w-32" />
        )}
      </CardContent>
    </Card>
  );
};
