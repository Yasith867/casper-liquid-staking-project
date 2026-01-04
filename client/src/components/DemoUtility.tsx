import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Lock, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DemoUtilityProps {
  hasBadge: boolean;
  lCsprBalance: string;
  onClaimBadge: () => Promise<void>;
  isProcessing: boolean;
}

export function DemoUtility({ hasBadge, lCsprBalance, onClaimBadge, isProcessing }: DemoUtilityProps) {
  const hasBalance = parseFloat(lCsprBalance) > 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden glass-card rounded-2xl border border-white/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">Liquid Utility Demo</h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              This demo showcases how liquid staked tokens can unlock exclusive features. 
              Holding <span className="text-primary font-bold">L-CSPR</span> grants you access to claim 
              the limited edition Hackathon Badge.
            </p>
            
            <div className="flex items-center gap-4 text-sm pt-2">
              <div className={`flex items-center gap-2 ${hasBalance ? 'text-green-400' : 'text-muted-foreground'}`}>
                <div className={`w-2 h-2 rounded-full ${hasBalance ? 'bg-green-500' : 'bg-gray-600'}`} />
                L-CSPR Balance &gt; 0
              </div>
              <div className={`flex items-center gap-2 ${hasBadge ? 'text-green-400' : 'text-muted-foreground'}`}>
                <div className={`w-2 h-2 rounded-full ${hasBadge ? 'bg-green-500' : 'bg-gray-600'}`} />
                Badge Claimed
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center">
            <div className={`
              w-32 h-32 rounded-full flex items-center justify-center mb-6 relative
              ${hasBadge 
                ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]' 
                : 'bg-white/5 border-2 border-dashed border-white/10'}
            `}>
              {hasBadge ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <Award className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                </motion.div>
              ) : (
                <Lock className="w-12 h-12 text-white/20" />
              )}
              
              {/* Confetti effect on badge when active */}
              {hasBadge && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
                      animate={{
                        x: [0, (Math.random() - 0.5) * 100],
                        y: [0, (Math.random() - 0.5) * 100],
                        opacity: [1, 0],
                        scale: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={onClaimBadge}
              disabled={hasBadge || !hasBalance || isProcessing}
              className={`
                min-w-[180px] h-12 rounded-xl font-bold shadow-lg transition-all duration-300
                ${hasBadge 
                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 cursor-default border border-green-500/20' 
                  : !hasBalance
                    ? 'bg-white/5 text-white/40 border border-white/5'
                    : 'bg-white text-black hover:bg-white/90 shadow-white/10'}
              `}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : hasBadge ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Unlocked
                </>
              ) : (
                "Unlock Badge"
              )}
            </Button>
            
            {!hasBalance && !hasBadge && (
              <p className="text-xs text-red-400 mt-3 animate-pulse">
                Stake CSPR to unlock
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
