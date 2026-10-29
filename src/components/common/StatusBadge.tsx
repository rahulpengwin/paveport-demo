import React from 'react';

export type BadgeVariant =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_DISPATCH'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REVIEWED_AND_QUOTED'
  | 'SUBMITTED'
  | 'CONVERTED_TO_ORDER'
  | 'ACTIVE'
  | 'AVAILABLE'
  | 'COMPLETED'
  | 'SIMULATED_PAID';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status.toUpperCase().replace(/\s+/g, '_');

  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (norm) {
    case 'APPROVED':
    case 'COMPLETED':
    case 'DELIVERED':
    case 'ACTIVE':
    case 'CONVERTED_TO_ORDER':
    case 'SIMULATED_PAID':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      break;

    case 'PENDING':
    case 'PLACED':
    case 'SUBMITTED':
    case 'AVAILABLE':
      style = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      break;

    case 'ACCEPTED':
    case 'ASSIGNED':
    case 'PREPARING':
    case 'REVIEWED_AND_QUOTED':
      style = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
      break;

    case 'READY_FOR_DISPATCH':
    case 'PICKED_UP':
    case 'IN_TRANSIT':
      style = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800 animate-pulse';
      break;

    case 'REJECTED':
    case 'SUSPENDED':
    case 'CANCELLED':
      style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
      break;
  }

  const label = norm.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full font-mono tracking-tight ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      } ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75 inline-block" />
      {label}
    </span>
  );
};

