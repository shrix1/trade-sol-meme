import { AlertCircle, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { WalletName } from "@solana/wallet-adapter-base";

interface ListWalletsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  wallets: any[];
  isLoading: boolean;
  handleConnect: (walletName: WalletName) => void;
}

export const ListWallets = ({
  open,
  setOpen,
  wallets,
  isLoading,
  handleConnect,
}: ListWalletsProps) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          className="w-full relative bg-primary/10 text-primary hover:bg-primary/20"
          variant="ghost"
          disabled={isLoading}
        >
          <Wallet className="w-5 h-5 mr-2" />
          {isLoading ? "Connecting..." : "Select Wallet"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4" align="center">
        {wallets.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium leading-none">Available Wallets</h3>
              <p className="text-sm text-muted-foreground">
                Select a wallet to connect to this app
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleConnect(wallet.adapter.name)}
                  disabled={isLoading}
                >
                  {wallet.adapter.icon && (
                    <img
                      src={wallet.adapter.icon}
                      alt={`${wallet.adapter.name} icon`}
                      className="w-4 h-4"
                    />
                  )}
                  {!wallet.adapter.icon && <Wallet className="w-4 h-4" />}
                  {wallet.adapter.name}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="w-4 h-4" />
              <h3 className="font-medium leading-none">No Wallet Detected</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Please install a Solana wallet like Phantom to continue
            </p>
            <Button
              className="w-full"
              onClick={() => window.open("https://phantom.app/", "_blank")}
            >
              Get Phantom Wallet
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
