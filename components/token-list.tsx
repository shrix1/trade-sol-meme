"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import { WalletAdapterNetwork, WalletName } from "@solana/wallet-adapter-base";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from "lucide-react";
import { WalletCard } from "./wallet/wallet-card";
import { BalanceCard } from "./wallet/balance-card";
import { TokenCard } from "./wallet/token-card";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { ListWallets } from "./wallet/list-wallets";

interface Token {
  id: string;
  name: string;
  symbol: string;
  mint?: PublicKey;
  balance?: number;
}

const MEMECOINS: Token[] = [
  { id: "doge", name: "Solana Doge", symbol: "SDOGE" },
  { id: "pepe", name: "Pepe on Solana", symbol: "PEPE" },
  { id: "shib", name: "Shiba Inu SOL", symbol: "SHIB" },
];

// Helper function to add delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TokenList = () => {
  const { connected, publicKey, connect, select, sendTransaction, wallets } =
    useWallet();
  const [tokens, setTokens] = useState<Token[]>(MEMECOINS);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connection] = useState(
    new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet), {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000,
    })
  );
  const [openListWallets, setOpenListWallets] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      toast.success("Connected to wallet");
      fetchBalance();
      initializeTokens();
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
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      toast.error("Error fetching balance");
      console.error("Error fetching balance:", error);
    }
  };

  const fetchTokenBalances = async () => {
    if (!publicKey) return;
    try {
      const updatedTokens = await Promise.all(
        tokens.map(async (t) => {
          if (t.mint) {
            try {
              const tokenAddress = await getAssociatedTokenAddress(
                t.mint,
                publicKey
              );
              const account = await getAccount(connection, tokenAddress);
              return {
                ...t,
                balance: Number(account.amount) / LAMPORTS_PER_SOL,
              };
            } catch (error) {
              console.error(`Error fetching balance for ${t.symbol}:`, error);
              return t;
            }
          }
          return t;
        })
      );
      setTokens(updatedTokens);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  const initializeTokens = async () => {
    if (!publicKey) return;
    try {
      setIsLoading(true);
      const payer = Keypair.generate();

      // Check if the connected wallet has enough SOL first
      const walletBalance = await connection.getBalance(publicKey);
      if (walletBalance < LAMPORTS_PER_SOL * 0.1) {
        toast.error(
          "Insufficient SOL balance. Please get SOL from the Solana Faucet",
          {
            action: {
              label: "Get SOL",
              onClick: () => window.open("https://faucet.solana.com", "_blank"),
            },
          }
        );
        return;
      }

      // Try to get SOL for the payer
      try {
        const airdropSignature = await connection.requestAirdrop(
          payer.publicKey,
          LAMPORTS_PER_SOL * 0.1 // Request less SOL to avoid hitting limits
        );
        await connection.confirmTransaction(airdropSignature);
      } catch (airdropError: any) {
        if (airdropError?.message?.includes("429")) {
          toast.error(
            "Airdrop limit reached. Please get SOL from the Solana Faucet",
            {
              action: {
                label: "Get SOL",
                onClick: () =>
                  window.open("https://faucet.solana.com", "_blank"),
              },
            }
          );
          return;
        }
        throw airdropError;
      }

      // Add delay after airdrop
      await delay(2000);

      const updatedTokens = [];
      for (const t of tokens) {
        if (!t.mint) {
          try {
            // Create token mint
            const mint = await createMint(
              connection,
              payer,
              publicKey,
              publicKey,
              9
            );

            // Add delay between token creation
            await delay(2000);

            // Create associated token account
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
              connection,
              payer,
              mint,
              publicKey
            );

            // Add delay before minting
            await delay(2000);

            // Mint some initial tokens
            await mintTo(
              connection,
              payer,
              mint,
              tokenAccount.address,
              payer,
              1000000000 // 1000 tokens
            );

            updatedTokens.push({ ...t, mint });
            toast.success(`Created ${t.symbol} token`);
          } catch (error) {
            console.error(`Error creating token ${t.symbol}:`, error);
            toast.error(`Failed to create ${t.symbol} token`);
            updatedTokens.push(t);
          }
          // Add delay between tokens
          await delay(2000);
        } else {
          updatedTokens.push(t);
        }
      }

      setTokens(updatedTokens);
      if (updatedTokens.some((t) => t.mint)) {
        toast.success("Some tokens were initialized successfully");
      }
      await fetchTokenBalances();
    } catch (error) {
      console.error("Error initializing tokens:", error);
      toast.error(
        "Error initializing tokens. Make sure you have enough SOL in your wallet",
        {
          action: {
            label: "Get SOL",
            onClick: () => window.open("https://faucet.solana.com", "_blank"),
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrade = async (token: Token) => {
    if (!publicKey || !token.mint) return;

    try {
      setIsLoading(true);

      // Get the associated token addresses
      const fromTokenAddress = await getAssociatedTokenAddress(
        token.mint,
        publicKey
      );

      const toTokenAddress = await getAssociatedTokenAddress(
        token.mint,
        publicKey
      );

      // Create the transfer instruction
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAddress,
          toTokenAddress,
          publicKey,
          1000000000 // 1 token with 9 decimals
        )
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      toast.success(`Traded 1 ${token.symbol}`);
      await delay(2000);
      await fetchTokenBalances();
      await fetchBalance();
    } catch (error) {
      toast.error("Error trading token");
      console.error("Error trading token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background/95 py-12 sm:py-16">
      <div className="container max-w-6xl px-4 mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Solana Memecoins
            </h1>
            <p className="mt-2 text-muted-foreground">
              Trade your favorite memecoins on Solana devnet
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="w-full max-w-md mx-auto">
            <WalletCard isLoading={isLoading} />
          </div>

          {connected ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Tabs defaultValue="balance" className="w-full">
                <TabsList className="w-full max-w-xs mx-auto grid grid-cols-2 mb-8">
                  <TabsTrigger value="balance">Balance</TabsTrigger>
                  <TabsTrigger value="tokens">Tokens</TabsTrigger>
                </TabsList>

                <TabsContent value="balance" className="mt-0">
                  <div className="max-w-md mx-auto">
                    <BalanceCard balance={balance} />
                  </div>
                </TabsContent>

                <TabsContent value="tokens" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading
                      ? Array.from({ length: MEMECOINS.length }).map(
                          (_, index) => (
                            <div key={index} className="animate-pulse">
                              <TokenCard
                                token={{
                                  id: `loading-${index}`,
                                  name: "",
                                  symbol: "",
                                }}
                                onTrade={() => {}}
                              />
                            </div>
                          )
                        )
                      : tokens.map((token) => (
                          <div
                            key={token.id}
                            className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                          >
                            <TokenCard
                              token={token}
                              onTrade={() => handleTrade(token)}
                            />
                          </div>
                        ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary/10 p-4 mb-6">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <p className="text-center text-lg mb-6">
                  Connect your wallet to start trading memecoins
                </p>
                <ListWallets
                  open={openListWallets}
                  setOpen={setOpenListWallets}
                  wallets={wallets}
                  isLoading={isLoading}
                  handleConnect={handleConnect}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenList;
