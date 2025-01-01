import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

interface TokenCardProps {
  token: {
    id: string;
    name: string;
    symbol: string;
  };
}

export const TokenCard = ({ token }: TokenCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{token.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Symbol: {token.symbol}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Trade
        </Button>
      </CardFooter>
    </Card>
  );
};
