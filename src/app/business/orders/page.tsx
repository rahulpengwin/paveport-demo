'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { Order } from '@/types';
import {
  Package,
  CheckCircle,
  Truck,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  User,
  Check,
} from 'lucide-react';

export default function BusinessOrdersPage() {
  const {
    activeBusinessId,
    businesses,
    orders,
    acceptOrder,
    prepareOrder,
    markOrderReadyForDispatch,
    setDemoStep,
  } = useDemoStore();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const storeOrders = orders.filter((o) => o.businessId === business.id);

  const handleAccept = (orderId: string, orderNumber: string) => {
    acceptOrder(orderId);
    setToastMsg(`Accepted order ${orderNumber}! Stock reserved in warehouse.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePrepare = (orderId: string, orderNumber: string) => {
    prepareOrder(orderId);
    setToastMsg(`Materials for ${orderNumber} are being palletized and wrapped.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleReadyForDispatch = (orderId: string, orderNumber: string) => {
    markOrderReadyForDispatch(orderId);
    setToastMsg(`Order ${orderNumber} marked Ready for Dispatch! Broadcasted to delivery fleet.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <AppShell
      appType="business"
      title="Purchase Order Processing & Dispatch Staging"
      subtitle={`Manage warehouse preparation, order acceptance, and delivery fleet dispatch for ${business.name}.`}
    >
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{toastMsg}</span>
            </div>
            <button
              onClick={() => {
                setDemoStep(7);
                window.location.href = '/delivery/available-jobs';
              }}
              className="text-xs text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md transition flex items-center space-x-1"
            >
              <span>Continue to Step 7 (Driver App)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Demo Hint Banner for Step 6 */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 6:</strong>
              <span>
                Review contractor orders below. Click <strong>Accept Order</strong>, then <strong>Mark Ready for Dispatch</strong> to signal nearby delivery trucks!
              </span>
            </div>
          </div>
        </div>

        {/* Orders Mobile Card List */}
        <div className="space-y-3">
          {storeOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
            >
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
                <div>
                  <span className="font-mono text-sm font-bold text-construction-400">{order.orderNumber}</span>
                  <span className="block text-[10px] font-mono text-charcoal-500">
                    {new Date(order.createdAt).toLocaleDateString()} &bull; {order.paymentStatus}
                  </span>
                </div>
                <StatusBadge status={order.status} size="sm" />
              </div>

              {/* Customer & Delivery Site */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{order.customerName}</span>
                  <span className="text-[10px] font-mono text-charcoal-400">{order.customerPhone}</span>
                </div>
                <p className="text-[11px] text-charcoal-400 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-construction-400 shrink-0" />
                  {order.deliveryAddress.street}, {order.deliveryAddress.locality}
                </p>
              </div>

              {/* Material Manifest Summary */}
              <div className="p-2.5 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-1 text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-charcoal-300">
                    <span className="truncate pr-2">
                      <strong className="text-white">{it.quantity} {it.unit}</strong> &bull; {it.productName}
                    </span>
                    <span className="font-mono font-bold text-white shrink-0">₹{it.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="pt-1.5 mt-1 border-t border-charcoal-800 flex justify-between font-bold text-white text-xs">
                  <span>Order Total:</span>
                  <span className="font-mono text-construction-400 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Fulfillment Actions */}
              <div className="pt-2 border-t border-charcoal-800 space-y-2">
                <div className="text-[11px] text-charcoal-400 font-mono">
                  {order.deliveryPartnerName ? (
                    <span className="text-purple-400 flex items-center">
                      <Truck className="w-3 h-3 mr-1 shrink-0" />
                      Carrier: {order.deliveryPartnerName} (OTP: {order.deliveryOtp})
                    </span>
                  ) : (
                    <span>Carrier: Awaiting Driver Assignment</span>
                  )}
                </div>

                <div>
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() => handleAccept(order.id, order.orderNumber)}
                      className="w-full py-2.5 px-4 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Order & Reserve Stock</span>
                    </button>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handlePrepare(order.id, order.orderNumber)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Start Preparing Materials</span>
                    </button>
                  )}

                  {(order.status === 'PREPARING' || order.status === 'ACCEPTED') && (
                    <button
                      onClick={() => handleReadyForDispatch(order.id, order.orderNumber)}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Mark Ready for Dispatch</span>
                    </button>
                  )}

                  {order.status === 'READY_FOR_DISPATCH' && (
                    <div className="w-full py-2 px-3 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 font-mono text-xs font-semibold text-center animate-pulse">
                      Awaiting driver pickup at loading bay...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

