import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";

interface BalanceCardProps {
  balance: number | null;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <Card className="overflow-hidden border-none bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">SOL Balance</CardTitle>
          <div className="rounded-full bg-primary/10 p-2">
            <Coins className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Available</span>
          {balance !== null ? (
            <span className="text-2xl font-bold tracking-tight">
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}{" "}
              SOL
            </span>
          ) : (
            <Skeleton className="h-8 w-32" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
