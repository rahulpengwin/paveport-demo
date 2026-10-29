'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '@/stores/useDemoStore';
import { hasPermission } from '@/lib/permissions/rbac';
import { PermissionKey } from '@/types';
import { PhoneMockup } from './PhoneMockup';
import {
  LayoutDashboard,
  Building2,
  Users,
  Truck,
  Package,
  Layers,
  FileText,
  MapPin,
  ShieldAlert,
  BarChart3,
  Settings,
  History,
  Store,
  ShoppingCart,
  Clock,
  Menu,
  X,
  PlusCircle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  permission?: PermissionKey;
}

interface AppShellProps {
  appType: 'admin' | 'business' | 'customer' | 'delivery' | 'architecture';
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  appType,
  children,
  title,
  subtitle,
  action,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRole, orders, quotations, businesses, deliveryAssignments, cart } = useDemoStore();

  const pendingApprovalsCount = businesses.filter((b) => b.verificationStatus === 'PENDING').length;
  const pendingQuotesCount = quotations.filter((q) => q.status === 'SUBMITTED').length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
  const availableJobsCount = deliveryAssignments.filter((a) => a.status === 'AVAILABLE').length;

  const adminNav: NavItem[] = [
    { label: 'Overview', href: '/admin/overview', icon: LayoutDashboard, permission: 'dashboard.read' },
    { label: 'Businesses', href: '/admin/businesses', icon: Building2, badge: pendingApprovalsCount, permission: 'businesses.read' },
    { label: 'Customers', href: '/admin/customers', icon: Users, permission: 'customers.read' },
    { label: 'Delivery Partners', href: '/admin/delivery-partners', icon: Truck, permission: 'deliveries.read' },
    { label: 'Orders', href: '/admin/orders', icon: Package, badge: activeOrdersCount, permission: 'orders.read' },
    { label: 'Products', href: '/admin/products', icon: Layers, permission: 'products.read' },
    { label: 'Inventory Oversight', href: '/admin/inventory', icon: Package, permission: 'inventory.read' },
    { label: 'Quotations', href: '/admin/quotations', icon: FileText, badge: pendingQuotesCount, permission: 'quotations.read' },
    { label: 'Locations & Coverage', href: '/admin/locations', icon: MapPin, permission: 'locations.manage' },
    { label: 'RBAC & Roles', href: '/admin/roles', icon: ShieldAlert, permission: 'roles.read' },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3, permission: 'reports.read' },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History, permission: 'audit_logs.read' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, permission: 'settings.manage' },
  ];

  const businessNav: NavItem[] = [
    { label: 'Yard Overview', href: '/business/overview', icon: LayoutDashboard },
    { label: 'Inventory', href: '/business/inventory', icon: Layers },
    { label: 'Orders', href: '/business/orders', icon: Package, badge: activeOrdersCount },
    { label: 'Quotations', href: '/business/quotations', icon: FileText, badge: pendingQuotesCount },
    { label: 'Deliveries', href: '/business/deliveries', icon: Truck },
    { label: 'Products Catalog', href: '/business/products', icon: Package },
    { label: 'Store Onboarding', href: '/business/onboarding', icon: Building2 },
    { label: 'Store Analytics', href: '/business/analytics', icon: BarChart3 },
    { label: 'Yard Settings', href: '/business/settings', icon: Settings },
  ];

  const customerNav: NavItem[] = [
    { label: 'Materials', href: '/customer/home', icon: Store },
    { label: 'Yards', href: '/customer/stores', icon: Building2 },
    { label: 'Quotations', href: '/customer/quotations', icon: FileText, badge: pendingQuotesCount },
    { label: 'Cart', href: '/customer/cart', icon: ShoppingCart, badge: cart.items.length || undefined },
    { label: 'Orders', href: '/customer/orders', icon: Clock, badge: activeOrdersCount },
    { label: 'All Products', href: '/customer/products', icon: Package },
    { label: 'Account Profile', href: '/customer/profile', icon: Users },
  ];

  const deliveryNav: NavItem[] = [
    { label: 'Fleet Dashboard', href: '/delivery/overview', icon: LayoutDashboard },
    { label: 'Available Jobs', href: '/delivery/available-jobs', icon: Package, badge: availableJobsCount },
    { label: 'Active Delivery', href: '/delivery/active-delivery', icon: Truck },
    { label: 'Trip History', href: '/delivery/history', icon: History },
    { label: 'Earnings & Payouts', href: '/delivery/earnings', icon: BarChart3 },
    { label: 'Driver Profile', href: '/delivery/profile', icon: Users },
  ];

  const architectureNav: NavItem[] = [
    { label: 'System Overview', href: '/architecture/overview', icon: LayoutDashboard },
    { label: 'Backend (Go REST)', href: '/architecture/backend', icon: Package },
    { label: 'PostgreSQL Database', href: '/architecture/database', icon: Layers },
    { label: 'Mobile Architecture', href: '/architecture/mobile', icon: Truck },
    { label: 'Security & RBAC', href: '/architecture/security', icon: ShieldAlert },
    { label: 'DevOps & AWS Cloud', href: '/architecture/devops', icon: Settings },
  ];

  let currentNav: NavItem[] = [];
  let appBadgeLabel = '';
  let appThemeColor = 'text-amber-400';

  switch (appType) {
    case 'admin':
      currentNav = adminNav;
      appBadgeLabel = 'Admin Operations Portal';
      appThemeColor = 'text-emerald-400';
      break;
    case 'business':
      currentNav = businessNav;
      appBadgeLabel = 'Business Supplier App';
      appThemeColor = 'text-amber-400';
      break;
    case 'customer':
      currentNav = customerNav;
      appBadgeLabel = 'Customer Commerce App';
      appThemeColor = 'text-blue-400';
      break;
    case 'delivery':
      currentNav = deliveryNav;
      appBadgeLabel = 'Delivery Partner App';
      appThemeColor = 'text-purple-400';
      break;
    case 'architecture':
      currentNav = architectureNav;
      appBadgeLabel = 'Technical Blueprint';
      appThemeColor = 'text-cyan-400';
      break;
  }

  // Filter based on RBAC permissions for admin app
  const visibleNav = currentNav.map((item) => {
    if (appType === 'admin' && item.permission) {
      const allowed = hasPermission(currentRole, item.permission);
      return { ...item, allowed };
    }
    return { ...item, allowed: true };
  });

  // Render Business, Customer, and Delivery apps as native In-Hand Phone Mockups
  if (appType === 'business' || appType === 'customer' || appType === 'delivery') {
    return (
      <PhoneMockup
        appType={appType}
        title={title}
        subtitle={subtitle}
        action={action}
        navItems={visibleNav}
      >
        {children}
      </PhoneMockup>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-charcoal-900 border-b border-charcoal-800">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${appThemeColor}`}>
            {appBadgeLabel}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-charcoal-300 hover:text-white bg-charcoal-800"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-charcoal-900 border-r border-charcoal-800 shrink-0 md:min-h-[calc(100vh-3.5rem)] flex flex-col justify-between`}
      >
        <div className="p-4 space-y-4">
          <div className="hidden md:block pb-3 border-b border-charcoal-800">
            <p className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400">Application Shell</p>
            <h2 className={`text-sm font-bold tracking-tight ${appThemeColor}`}>{appBadgeLabel}</h2>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {visibleNav.map((item) => {
              const active = pathname === item.href;
              const isAllowed = item.allowed !== false;

              if (!isAllowed) {
                return (
                  <div
                    key={item.href}
                    title="Action not permitted for active role in RBAC matrix"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-charcoal-500 cursor-not-allowed opacity-50 bg-charcoal-950/20"
                  >
                    <div className="flex items-center space-x-2.5">
                      <item.icon className="w-4 h-4 text-charcoal-600" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-rose-500 uppercase">Locked</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-construction-500/10 text-construction-400 border border-construction-500/30 font-semibold shadow-sm'
                      : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <item.icon className={`w-4 h-4 ${active ? 'text-construction-400' : 'text-charcoal-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {Boolean(item.badge) && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-construction-500 text-charcoal-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Context */}
        <div className="p-4 border-t border-charcoal-800/80 bg-charcoal-950/40 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-charcoal-400">Current Actor:</span>
            <span className="font-mono text-construction-400 font-bold">{currentRole}</span>
          </div>
          <p className="text-[10px] text-charcoal-400 leading-normal">
            Real-time cross-app synchronization active. Mutations propagate across Admin, Business, Customer & Fleet.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-charcoal-950 pb-16 md:pb-8">
        {(title || action) && (
          <div className="border-b border-charcoal-800 bg-charcoal-900/60 px-4 sm:px-8 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>}
                {subtitle && <p className="text-xs sm:text-sm text-charcoal-400 mt-1">{subtitle}</p>}
              </div>
              {action && <div className="flex items-center space-x-2 shrink-0">{action}</div>}
            </div>
          </div>
        )}

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">{children}</div>
      </main>
    </div>
  );
};

