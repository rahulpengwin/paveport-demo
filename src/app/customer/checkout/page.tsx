'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Order } from '@/types';
import {
  CreditCard,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function CustomerCheckoutPage() {
  const router = useRouter();
  const { cart, customers, activeCustomerId, clearCart, setDemoStep } = useDemoStore();
  const customer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [siteNotes, setSiteNotes] = useState('Call site supervisor 30 mins before arrival.');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return;

    // Directly convert cart to order in store
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `PV-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.defaultAddress,
      businessId: cart.businessId || 'biz-lakshmi',
      businessName: cart.businessName || 'Sri Lakshmi Cement & Building Supplies',
      items: cart.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        brand: it.brand,
        unit: it.unit,
        quantity: it.quantity,
        unitPrice: it.pricePerUnit,
        total: it.subtotal,
      })),
      subtotal: cart.subtotal,
      deliveryFee: cart.estimatedDeliveryFee,
      taxAmount: cart.estimatedTax,
      totalAmount: cart.totalEstimatedAmount,
      paymentStatus: 'SIMULATED_PAID',
      paymentMethod: `Simulated ${paymentMethod}`,
      status: 'PLACED',
      deliveryOtp: '4829',
      expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString(),
      notes: siteNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useDemoStore.setState((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    useDemoStore.getState().addAuditLog(
      'ORDER_CHECKOUT',
      'ORDER',
      newOrder.id,
      `Customer placed direct order ${newOrder.orderNumber}`
    );

    clearCart();
    setCreatedOrder(newOrder);
  };

  return (
    <AppShell
      appType="customer"
      title="Simulated Construction Order Checkout"
      subtitle="Finalize job site drop-off destination and simulated corporate purchase payment."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {createdOrder ? (
          <div className="p-8 rounded-2xl bg-charcoal-900 border border-emerald-500/40 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Simulated Payment Confirmed!</h3>
            <p className="text-xs text-charcoal-300 max-w-md mx-auto">
              Order <strong className="font-mono text-construction-400">{createdOrder.orderNumber}</strong> has been placed with {createdOrder.businessName}.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => router.push(`/customer/orders/${createdOrder.id}`)}
                className="px-5 py-2.5 rounded-xl bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center space-x-2"
              >
                <span>Track Live Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Warning notice */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Demonstration Environment Notice:</strong> No real payment cards or financial transactions are
                processed. All orders simulate authentic clearing for demo purposes.
              </span>
            </div>

            {/* Delivery Destination */}
            <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                1. Delivery Job Site Address
              </h3>
              <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
                <p className="font-semibold text-white">{customer.name} ({customer.companyName})</p>
                <p className="text-charcoal-300">{customer.defaultAddress.street}</p>
                <p className="text-charcoal-400 font-mono">
                  {customer.defaultAddress.locality}, {customer.defaultAddress.city} - {customer.defaultAddress.pincode}
                </p>
              </div>

              <div>
                <label className="block text-charcoal-300 font-semibold mb-1">Site Access Instructions</label>
                <input
                  type="text"
                  value={siteNotes}
                  onChange={(e) => setSiteNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-2.5 text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                2. Simulated Payment Method
              </h3>
              <div className="space-y-2">
                {['UPI Instant (Demo)', 'Corporate Credit Line (30 Days)', 'NetBanking RTGS'].map((m) => (
                  <div
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === m
                        ? 'bg-construction-500/10 border-construction-500 text-white font-bold'
                        : 'bg-charcoal-850 border-charcoal-800 text-charcoal-400 hover:border-charcoal-700'
                    }`}
                  >
                    <span className="text-xs">{m}</span>
                    <span className="text-[9px] text-charcoal-500 font-mono">Instant Clearing</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total & Submit */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-400 font-mono">Total Order Value:</span>
                <h4 className="text-lg font-bold text-white font-mono">
                  ₹{cart.totalEstimatedAmount.toLocaleString('en-IN')}
                </h4>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center justify-center space-x-2"
              >
                <span>Authorize Simulated Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}

