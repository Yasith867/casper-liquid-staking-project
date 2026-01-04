import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Info, Loader2, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StakingInterfaceProps {
  csprBalance: string;
  lCsprBalance: string;
  onStake: (amount: string) => Promise<string | undefined>;
  onUnstake: (amount: string) => Promise<string | undefined>;
  isProcessing: boolean;
}

export function StakingInterface({
  csprBalance,
  lCsprBalance,
  onStake,
  onUnstake,
  isProcessing
}: StakingInterfaceProps) {
  const [amount, setAmount] = useState("");
  const [deployHash, setDeployHash] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMax = (balance: string) => {
    const max = parseFloat(balance) > 5 ? (parseFloat(balance) - 5).toString() : "0";
    setAmount(max);
  };

  const handleSubmit = async (action: 'stake' | 'unstake') => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setDeployHash(null);
    try {
      let hash;
      if (action === 'stake') {
        if (parseFloat(amount) > parseFloat(csprBalance)) {
          throw new Error("Insufficient CSPR balance");
        }
        hash = await onStake(amount);
      } else {
        if (parseFloat(amount) > parseFloat(lCsprBalance)) {
          throw new Error("Insufficient L-CSPR balance");
        }
        hash = await onUnstake(amount);
      }
      
      if (hash) {
        setDeployHash(hash);
        toast({
          title: "Transaction Sent",
          description: `Deploy Hash: ${hash.slice(0, 10)}...`,
        });
      }
      setAmount("");
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
      <div className="p-6">
        {deployHash && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-400 font-medium mb-1">Success! Transaction Sent</p>
            <a 
              href={`https://testnet.cspr.live/deploy/${deployHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline break-all font-mono"
            >
              View on CSPR.live: {deployHash}
            </a>
          </div>
        )}
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1 mb-6 rounded-xl">
            <TabsTrigger 
              value="stake"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium transition-all"
            >
              Stake CSPR
            </TabsTrigger>
            <TabsTrigger 
              value="unstake"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium transition-all"
            >
              Unstake L-CSPR
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key="stake-content" value="stake" className="mt-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span>Amount to stake</span>
                  <span className="flex items-center gap-1">
                    Balance: <span className="text-white font-mono">{parseFloat(csprBalance).toLocaleString()} CSPR</span>
                  </span>
                </div>
                
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-16 pl-4 pr-32 text-2xl bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl font-mono text-white relative z-10"
                  />
                  <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2 z-20">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMax(csprBalance)}
                      className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 bg-transparent"
                    >
                      MAX
                    </Button>
                    <div className="h-8 px-3 flex items-center bg-white/10 rounded-lg border border-white/10 text-sm font-semibold text-white/80">
                      CSPR
                    </div>
                  </div>
                </div>

                <div className="py-4 flex justify-center text-white/20">
                  <ArrowDownUp className="w-6 h-6" />
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="text-white font-medium font-mono">~ {amount || "0"} L-CSPR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="text-white font-medium">1 CSPR = 1 L-CSPR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span className="text-white font-medium">~ 2.5 CSPR</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubmit('stake')}
                  disabled={isProcessing}
                  className="w-full h-14 mt-6 text-lg font-bold bg-gradient-casper hover:opacity-90 shadow-lg shadow-primary/25 rounded-xl transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Staking...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Stake Now
                    </>
                  )}
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent key="unstake-content" value="unstake" className="mt-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span>Amount to unstake</span>
                  <span className="flex items-center gap-1">
                    Balance: <span className="text-white font-mono">{parseFloat(lCsprBalance).toLocaleString()} L-CSPR</span>
                  </span>
                </div>
                
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-16 pl-4 pr-24 text-2xl bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl font-mono"
                  />
                  <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMax(lCsprBalance)}
                      className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10"
                    >
                      MAX
                    </Button>
                    <div className="h-8 px-3 flex items-center bg-white/5 rounded-lg border border-white/5 text-sm font-semibold text-white/80">
                      L-CSPR
                    </div>
                  </div>
                </div>

                <div className="py-4 flex justify-center text-white/20">
                  <ArrowDownUp className="w-6 h-6" />
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="text-white font-medium font-mono">~ {amount || "0"} CSPR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unbonding Period</span>
                    <span className="text-white font-medium">~ 7 Eras (approx 14 hours)</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubmit('unstake')}
                  disabled={isProcessing}
                  className="w-full h-14 mt-6 text-lg font-bold bg-secondary hover:bg-secondary/80 text-white border border-white/10 rounded-xl transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Unstaking...
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-5 w-5" />
                      Unstake Now
                    </>
                  )}
                </Button>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
      <div className="bg-primary/5 p-4 border-t border-white/5 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Liquid staked tokens (L-CSPR) represent your staked CSPR plus rewards. 
          You can use L-CSPR in DeFi applications while still earning staking rewards.
        </p>
      </div>
    </div>
  );
}
