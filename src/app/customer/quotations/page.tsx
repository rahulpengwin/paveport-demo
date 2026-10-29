'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { Quotation, Order } from '@/types';
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

export default function CustomerQuotationsPage() {
  const router = useRouter();
  const { quotations, acceptQuotation, setDemoStep } = useDemoStore();
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const handleAccept = (quoteId: string) => {
    const order = acceptQuotation(quoteId);
    setCreatedOrder(order);
  };

  return (
    <AppShell
      appType="customer"
      title="Commercial Bulk Quotations & Estimates"
      subtitle="Review firm supplier bids, inspect volume pricing discounts, and execute binding purchase orders."
    >
      <div className="space-y-6">
        {/* Success Alert when quote is accepted */}
        {createdOrder && (
          <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 shadow-2xl space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Quotation Accepted! Live Order Created</h4>
                <p className="text-xs text-emerald-300">
                  Purchase Order <strong className="font-mono text-white">{createdOrder.orderNumber}</strong> has been
                  transmitted to <strong className="text-white">{createdOrder.businessName}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setDemoStep(6);
                  router.push('/business/orders');
                }}
                className="px-4 py-2 rounded-xl bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm flex items-center space-x-1.5"
              >
                <span>Continue to Step 6 (Business Prepares Order)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => router.push(`/customer/orders/${createdOrder.id}`)}
                className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-700 text-white font-semibold text-xs transition"
              >
                <span>Track Order Timeline</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Hint Banner for Step 5 */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 5:</strong>
              <span>
                Review the official quote response from <strong>Sri Lakshmi Cement</strong> for 100 bags of UltraTech Cement. Click <strong>Accept Quotation & Generate Order</strong> to trigger live fulfillment!
              </span>
            </div>
          </div>
        </div>

        {/* Quotations Mobile Card List */}
        <div className="space-y-3">
          {quotations.map((quote) => {
            const isQuoted = quote.status === 'REVIEWED_AND_QUOTED';
            const isConverted = quote.status === 'CONVERTED_TO_ORDER';

            return (
              <div
                key={quote.id}
                className={`p-4 rounded-2xl bg-charcoal-900 border transition shadow-card space-y-3 ${
                  isQuoted ? 'border-construction-500/60 ring-1 ring-construction-500/20' : 'border-charcoal-800'
                }`}
              >
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-construction-400">
                      {quote.quotationNumber}
                    </span>
                    <StatusBadge status={quote.status} size="sm" />
                  </div>
                  <span className="text-[10px] font-mono text-charcoal-400">
                    Valid: {new Date(quote.validUntil).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-[10px] text-charcoal-400 font-mono block">Supplier Yard</span>
                  <h4 className="text-sm font-bold text-white">{quote.businessName}</h4>
                  <p className="text-[11px] text-charcoal-400">
                    Site: {quote.customerAddress.locality}, {quote.customerAddress.city}
                  </p>
                </div>

                {/* Quoted Items */}
                <div className="space-y-1.5 pt-2 border-t border-charcoal-800">
                  {quote.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-charcoal-850 border border-charcoal-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{it.productName}</span>
                        <span className="text-[10px] text-charcoal-400 font-mono">
                          {it.requestedQty} {it.unit} &bull; Rate: ₹{it.quotedUnitPrice}/{it.unit}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-white">
                        ₹{it.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-charcoal-400">
                    <span>Materials:</span>
                    <span className="font-mono text-white">₹{quote.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>Haulage & Transport:</span>
                    <span className="font-mono text-white">₹{quote.deliveryCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>GST (18%):</span>
                    <span className="font-mono text-white">₹{quote.taxCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-1.5 border-t border-charcoal-800 flex justify-between font-bold text-white">
                    <span>Grand Total:</span>
                    <span className="font-mono text-construction-400 text-sm">
                      ₹{quote.totalEstimatedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Acceptance Action */}
                <div>
                  {isQuoted && (
                    <button
                      onClick={() => handleAccept(quote.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Quotation & Generate Order</span>
                    </button>
                  )}

                  {isConverted && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono text-center font-semibold">
                      ✓ Converted to Active Order ({quote.orderId})
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

