import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
}

export function StatCard({ title, value, subtext, icon, trend, trendValue, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Background gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-white/5 rounded-xl text-primary border border-white/5">
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`
            px-2 py-1 rounded-lg text-xs font-semibold flex items-center
            ${trend === 'up' ? 'bg-green-500/10 text-green-400' : 
              trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-white/10 text-white/60'}
          `}>
            {trend === 'up' && '↑'} {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-muted-foreground font-medium text-sm tracking-wide uppercase">{title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            {value}
          </span>
          {subtext && <span className="text-sm text-white/40">{subtext}</span>}
        </div>
      </div>
    </motion.div>
  );
}
