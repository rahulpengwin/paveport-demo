import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'amber' | 'blue' | 'emerald' | 'charcoal';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'amber',
}) => {
  const colorMap = {
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    charcoal: 'text-slate-400 bg-slate-800 border-slate-700',
  };

  return (
    <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-3.5 sm:p-5 shadow-card hover:border-charcoal-700 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-charcoal-400">{title}</p>
        <div className={`p-1.5 sm:p-2 rounded-lg border ${colorMap[accentColor]}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
        <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{value}</h3>
        {trend && (
          <span
            className={`inline-flex items-center text-[10px] sm:text-xs font-medium ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1" /> : <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-[10px] sm:text-xs text-charcoal-400 leading-tight">{subtitle}</p>}
    </div>
  );
};

