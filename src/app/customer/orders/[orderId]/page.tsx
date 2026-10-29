'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  Package,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Phone,
  AlertCircle,
  Key,
} from 'lucide-react';

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { orders } = useDemoStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const timelineSteps = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Commercial purchase order received by platform' },
    { key: 'ACCEPTED', title: 'Yard Accepted', desc: 'Supplier confirmed availability & reserved stock' },
    { key: 'PREPARING', title: 'Materials Packing', desc: 'Palletizing and loading onto yard staging bay' },
    { key: 'READY_FOR_DISPATCH', title: 'Ready for Dispatch', desc: 'Material ready, broadcasted to logistics fleet' },
    { key: 'ASSIGNED', title: 'Driver Assigned', desc: 'Carrier accepted haulage assignment' },
    { key: 'PICKED_UP', title: 'Picked Up at Yard', desc: 'Materials loaded onto truck and verified' },
    { key: 'IN_TRANSIT', title: 'In Transit to Site', desc: 'Vehicle traveling along arterial corridor' },
    { key: 'DELIVERED', title: 'Site Delivery Complete', desc: 'OTP verified & materials safely unloaded' },
  ];

  const statusOrder = [
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY_FOR_DISPATCH',
    'ASSIGNED',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
  ];

  const currentIndex = statusOrder.indexOf(order.status);

  return (
    <AppShell
      appType="customer"
      title={`Order ${order.orderNumber} Tracking`}
      subtitle={`Live Fulfillment Status • Expected Delivery: ${new Date(order.expectedDeliveryDate).toLocaleDateString()}`}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-charcoal-400 uppercase">Purchase Order</span>
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-white font-mono">{order.orderNumber}</h3>
              <StatusBadge status={order.status} size="md" />
            </div>
            <p className="text-xs text-charcoal-400">Supplier: {order.businessName}</p>
          </div>

          {/* Secure Delivery OTP Box */}
          <div className="p-3.5 rounded-xl bg-charcoal-850 border border-construction-500/40 text-center space-y-0.5 shrink-0">
            <span className="text-[10px] font-mono uppercase text-construction-400 font-bold tracking-wider block">
              Site Delivery OTP Code
            </span>
            <span className="text-2xl font-black font-mono text-white tracking-widest block">
              {order.deliveryOtp}
            </span>
            <span className="text-[9px] text-charcoal-400 block">Share with driver upon site unloading</span>
          </div>
        </div>

        {/* Visual 8-Stage Progress Timeline - Mobile Vertical Tracker */}
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Fulfillment Lifecycle
            </h4>
            <span className="text-[10px] font-mono text-construction-400 font-bold">
              Stage {currentIndex + 1} of 8
            </span>
          </div>

          <div className="space-y-0 relative pl-2">
            {timelineSteps.map((step, idx) => {
              const isPassed = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const isLast = idx === timelineSteps.length - 1;

              return (
                <div key={step.key} className="flex items-start space-x-3 relative pb-3 last:pb-0">
                  {/* Connecting Vertical Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${
                        isPassed && idx < currentIndex ? 'bg-emerald-500' : 'bg-charcoal-800'
                      }`}
                    />
                  )}

                  {/* Step Icon / Number */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 z-10 ${
                      isCurrent
                        ? 'bg-construction-500 text-charcoal-950 ring-4 ring-construction-500/20 animate-pulse'
                        : isPassed
                        ? 'bg-emerald-500 text-charcoal-950 font-bold'
                        : 'bg-charcoal-800 text-charcoal-500 border border-charcoal-700'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </span>

                  {/* Step Text */}
                  <div className="min-w-0 flex-1">
                    <h5
                      className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-construction-400' : isPassed ? 'text-white' : 'text-charcoal-500'
                      }`}
                    >
                      {step.title}
                    </h5>
                    <p className="text-[10px] text-charcoal-400 leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schematic Route & Manifest */}
        <div className="space-y-4">
          {/* Schematic Route Map Visualizer */}
          <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-card space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Haulage Corridor
            </h4>

            {/* Schematic Route Graphics */}
            <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800 space-y-3 relative overflow-hidden">
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <span className="text-[9px] text-charcoal-400 font-mono uppercase block">Origin Yard</span>
                  <span className="font-bold text-white">{order.businessName}</span>
                  <p className="text-[10px] text-charcoal-400">KR Puram Industrial Corridor</p>
                </div>
              </div>

              {/* Waypoint Line */}
              <div className="pl-3.5 py-0.5">
                <div className="border-l-2 border-dashed border-construction-500/60 pl-4 py-1.5 space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-[10px] text-construction-400 font-mono">
                    <Truck className="w-3 h-3" />
                    <span>ORR Corridor &bull; 14.2 km haul</span>
                  </div>
                  <span className="text-[9px] text-charcoal-500 block font-mono">
                    Tata Ace High-Deck (KA-01-EA-4821)
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <span className="text-[9px] text-charcoal-400 font-mono uppercase block">Destination Site</span>
                  <span className="font-bold text-white">{order.customerName}</span>
                  <p className="text-[10px] text-charcoal-400">
                    {order.deliveryAddress.street}, {order.deliveryAddress.locality}
                  </p>
                </div>
              </div>
            </div>

            {order.deliveryPartnerName && (
              <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-charcoal-400 block text-[9px] uppercase font-mono">Assigned Carrier</span>
                  <span className="font-bold text-white text-xs">{order.deliveryPartnerName}</span>
                  <span className="block text-[10px] text-charcoal-400 font-mono">{order.deliveryPartnerPhone}</span>
                </div>
                <a
                  href={`tel:${order.deliveryPartnerPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-construction-400 text-xs font-semibold flex items-center space-x-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            )}
          </div>

          {/* Manifest Breakdown */}
          <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-card space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Material Manifest & Billing
            </h4>

            <div className="space-y-1.5">
              {order.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-charcoal-850 border border-charcoal-800 flex justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{it.productName}</span>
                    <span className="text-[10px] text-charcoal-400 font-mono">
                      {it.quantity} {it.unit} @ ₹{it.unitPrice.toLocaleString('en-IN')}/{it.unit}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white self-center">
                    ₹{it.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-charcoal-950 border border-charcoal-800 space-y-1 text-xs">
              <div className="flex justify-between text-charcoal-400">
                <span>Material Subtotal:</span>
                <span className="font-mono text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-400">
                <span>Haulage & Unloading:</span>
                <span className="font-mono text-white">₹{order.deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-400">
                <span>GST (18%):</span>
                <span className="font-mono text-white">₹{order.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-1.5 border-t border-charcoal-800 flex justify-between font-bold text-white">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-construction-400 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-0.5 text-[9px] text-emerald-400 font-mono">
                Method: {order.paymentMethod} &bull; {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

