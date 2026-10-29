'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function CustomerCartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useDemoStore();

  return (
    <AppShell
      appType="customer"
      title="Commercial Procurement Cart"
      subtitle="Review quantities, check single-supplier staging, and calculate freight logistics."
    >
      <div className="space-y-6">
        {cart.items.length > 0 ? (
          <div className="space-y-4">
            {/* Cart Header Card */}
            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-charcoal-400 font-mono block">Supplier Yard</span>
                <span className="font-bold text-white text-xs">{cart.businessName}</span>
              </div>
              <button
                onClick={clearCart}
                className="text-rose-400 hover:text-rose-300 font-mono text-[11px] flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* Cart Items Mobile List */}
            <div className="space-y-2.5">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3.5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3 shadow-card"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-construction-400 uppercase">
                        {item.brand}
                      </span>
                      <h4 className="text-xs font-bold text-white">{item.productName}</h4>
                      <p className="text-[11px] text-charcoal-400 font-mono">
                        ₹{item.pricePerUnit.toLocaleString('en-IN')} / {item.unit}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-white block">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center justify-between pt-2 border-t border-charcoal-800">
                    <span className="text-[10px] font-mono text-charcoal-400">Quantity:</span>
                    <div className="flex items-center space-x-2 bg-charcoal-850 border border-charcoal-700 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 10)}
                        className="p-1.5 rounded text-charcoal-400 hover:text-white hover:bg-charcoal-700 active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-white px-2 text-xs">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 10)}
                        className="p-1.5 rounded text-charcoal-400 hover:text-white hover:bg-charcoal-700 active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Pricing Calculation */}
            <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-4 shadow-card space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-charcoal-800 pb-2">
                Cost Breakdown
              </h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-charcoal-300">
                  <span>Materials Subtotal:</span>
                  <span className="font-mono text-white">₹{cart.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-charcoal-300">
                  <span>Haulage & Transport:</span>
                  <span className="font-mono text-white">₹{cart.estimatedDeliveryFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-charcoal-300">
                  <span>Estimated GST (18%):</span>
                  <span className="font-mono text-white">₹{cart.estimatedTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-charcoal-800 flex justify-between font-bold text-white">
                  <span>Estimated Total:</span>
                  <span className="font-mono text-construction-400 text-base">
                    ₹{cart.totalEstimatedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/customer/checkout"
                  className="w-full py-3 px-4 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Simulated Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[10px] text-charcoal-500 text-center leading-normal">
                  Standard 3-6 hour site delivery. Final weighbridge loadout at yard.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-charcoal-500 mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Your Procurement Cart is Empty</h3>
            <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
              Discover local yards and add cement bags, TMT rebar, or sand to calculate wholesale rates and delivery.
            </p>
            <Link
              href="/customer/home"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm"
            >
              <span>Explore Materials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

