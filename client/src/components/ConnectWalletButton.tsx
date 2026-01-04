import { Button } from "@/components/ui/button";
import { Loader2, Wallet, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectWalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  activeKey: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export function ConnectWalletButton({
  isConnected,
  isConnecting,
  activeKey,
  onConnect,
  onDisconnect,
  className
}: ConnectWalletButtonProps) {
  if (isConnected && activeKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "bg-secondary/50 border-white/10 hover:bg-white/5 transition-all duration-300 font-mono text-xs sm:text-sm gap-2",
              className
            )}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {activeKey.slice(0, 5)}...{activeKey.slice(-5)}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black/90 border-white/10 text-white" align="end">
          <DropdownMenuLabel>Wallet Details</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/5" />
          <div className="p-2 px-3 text-xs text-muted-foreground break-all font-mono">
            {activeKey}
          </div>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuItem 
            onClick={onDisconnect}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      className={cn(
        "bg-white text-black hover:bg-white/90 font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300",
        className
      )}
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4 mr-2" />
      )}
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
