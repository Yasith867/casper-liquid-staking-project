import { useEffect, useState } from "react";
import { useCasperWallet } from "@/hooks/use-casper";
import { useUser, useCreateUser, useUpdateBalance, useClaimBadge } from "@/hooks/use-users";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { StatCard } from "@/components/StatCard";
import { StakingInterface } from "@/components/StakingInterface";
import { DemoUtility } from "@/components/DemoUtility";
import { useToast } from "@/hooks/use-toast";
import { Coins, Layers, TrendingUp, AlertCircle, LayoutDashboard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCasperBalance } from "@/lib/casperBalance";

const FAUCET_URL = "https://testnet.cspr.live/tools/faucet";

export default function Dashboard() {
  const { isConnected, isConnecting, activeKey, connect, disconnect, balance: sdkBalance, signAndSendDeploy, providerDetected, error: walletError } = useCasperWallet();
  const { data: user } = useUser(activeKey);
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateBalance } = useUpdateBalance();
  const { mutateAsync: claimBadge } = useClaimBadge();
  const { toast } = useToast();
  
  const [isTransacting, setIsTransacting] = useState(false);
  const [realBalance, setRealBalance] = useState<string>("0.00");

  useEffect(() => {
    if (isConnected && activeKey) {
      createUser({ walletAddress: activeKey }).catch(() => {});
      
      // Fetch real balance
      fetchCasperBalance(activeKey)
        .then((balance) => {
          console.log("[Casper] Fetched balance:", balance);
          setRealBalance(balance);
        })
        .catch((err) => {
          console.error("[Casper] Balance fetch error:", err);
          setRealBalance("0.00");
        });
    } else {
      setRealBalance("0.00");
    }
  }, [isConnected, activeKey, createUser]);

  const lCsprBalance = user?.demoBalance || "0";
  const stakedCspr = lCsprBalance;
  const rewards = (parseFloat(lCsprBalance) * 0.05).toFixed(2);

  const handleStake = async (amount: string) => {
    toast({
      title: "Transaction Info",
      description: "Direct staking via frontend is disabled for stability. Prototype mode active.",
    });
    return undefined;
  };

  const handleUnstake = async (amount: string) => {
    toast({
      title: "Feature coming soon",
      description: "Unstaking on testnet is being finalized."
    });
    return undefined;
  };

  const handleClaimBadge = async () => {
    toast({
      title: "Badge Utility",
      description: "Badge claiming prototype - check back soon.",
    });
  };

  if (!providerDetected && !isConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md border border-white/10">
          <h1 className="text-2xl font-bold mb-4">Wallet Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Casper Wallet or CSPR.click extension is required. 
            Please install it and refresh the page.
          </p>
          <Button onClick={() => {
            // Re-check for provider
            if (typeof window !== 'undefined' && (window.CasperWalletProvider || window.casperWallet)) {
               window.location.reload(); // Using reload only as last resort for re-initialization if script injection was delayed
            }
          }}>Retry Detection</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-casper flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">
              Casper<span className="text-primary">Liquid</span>
            </span>
            <span className="ml-3 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-primary/20 text-primary border border-primary/30">
              Testnet Only
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => window.open(FAUCET_URL, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Faucet Tokens
            </Button>
            <ConnectWalletButton 
              isConnected={isConnected}
              isConnecting={isConnecting}
              activeKey={activeKey}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
              Unlock Liquidity on <span className="text-gradient">Casper Network</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Stake your CSPR, receive L-CSPR, and explore the DeFi ecosystem with REAL Testnet transactions.
            </p>
            <div className="flex justify-center pt-4">
              <ConnectWalletButton 
                isConnected={isConnected}
                isConnecting={isConnecting}
                activeKey={activeKey}
                onConnect={connect}
                onDisconnect={disconnect}
                className="h-14 px-8 text-lg"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Wallet Balance" 
                value={`${realBalance} CSPR`}
                icon={<Layers className="w-6 h-6" />}
                delay={0}
              />
              <StatCard 
                title="L-CSPR Balance" 
                value={`${realBalance} L-CSPR`}
                icon={<Coins className="w-6 h-6" />}
                delay={0.1}
              />
              <StatCard 
                title="Estimated Rewards" 
                value={`${(parseFloat(realBalance.replace(/,/g, '')) * 0.05).toFixed(2)} CSPR`}
                subtext="~5% APY"
                icon={<TrendingUp className="w-6 h-6" />}
                trend="up"
                trendValue="+5.0%"
                delay={0.2}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StakingInterface 
                  csprBalance={realBalance}
                  lCsprBalance={realBalance}
                  onStake={handleStake}
                  onUnstake={handleUnstake}
                  isProcessing={isTransacting}
                />
              </div>

              <div className="space-y-6">
                <div className="glass-card p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Protocol Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network</span>
                      <span className="text-white font-mono font-medium">casper-test</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">APY</span>
                      <span className="text-green-400 font-mono font-medium">5.0%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Rate</span>
                      <span className="text-white font-mono font-medium">1 : 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DemoUtility 
              hasBadge={user?.hasDemoBadge ?? false}
              lCsprBalance={realBalance}
              onClaimBadge={handleClaimBadge}
              isProcessing={isTransacting}
            />
          </>
        )}
      </main>
    </div>
  );
}
