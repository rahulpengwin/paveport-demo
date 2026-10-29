'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  Building2,
  MapPin,
  Star,
  ShieldCheck,
  Package,
  ShoppingCart,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function CustomerStoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params?.storeId as string;

  const { businesses, products, addToCart, submitQuotationRequest, setDemoStep } = useDemoStore();
  const [quoteQty, setQuoteQty] = useState(100);
  const [quoteNotes, setQuoteNotes] = useState('Ground floor site unloading for slab pour.');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const business = businesses.find((b) => b.id === storeId) || businesses[0];
  const storeProducts = products.filter((p) => p.businessId === business.id);

  const handleRequestQuote = (productId: string) => {
    submitQuotationRequest({
      businessId: business.id,
      items: [{ productId, requestedQty: Number(quoteQty) || 50, notes: quoteNotes }],
      notes: quoteNotes,
    });

    setToastMsg(`Submitted formal commercial quotation request for ${quoteQty} units!`);
    setTimeout(() => {
      setDemoStep(4);
      router.push('/business/quotations');
    }, 1500);
  };

  return (
    <AppShell
      appType="customer"
      title={business.name}
      subtitle={`Verified Yard • ${business.address.street}, ${business.address.locality} • Operating Hours: ${business.operatingHours}`}
    >
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{toastMsg}</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">Switching to Business App...</span>
          </div>
        )}

        {/* Store Trust Header */}
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-2 shadow-card">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              GSTIN: {business.registrationNumber}
            </span>
            <span className="text-xs text-amber-400 font-bold flex items-center">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" />
              {business.rating} ★
            </span>
          </div>

          <div className="text-[11px] text-charcoal-400 flex items-center justify-between font-mono pt-1 border-t border-charcoal-800">
            <span>SLA: {business.estimatedDeliveryHours}</span>
            <span>Min Order: ₹{business.minOrderValue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Product Catalog Cards - Mobile Feed */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Available Stock at this Yard
          </h3>

          <div className="space-y-3">
            {storeProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-construction-400 uppercase">
                        {p.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">{p.name}</h4>
                      <p className="text-[11px] text-charcoal-400 font-mono mt-0.5">{p.gradeSpecification}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-charcoal-800 text-charcoal-300">
                      {p.availableStock} in stock
                    </span>
                  </div>

                  <p className="text-[11px] text-charcoal-400 mt-1.5">{p.handlingNotes}</p>
                </div>

                <div className="pt-2.5 border-t border-charcoal-800 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-white">
                      ₹{p.pricePerUnit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-charcoal-400 font-mono">per {p.unit} (MOQ: {p.minOrderQty})</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRequestQuote(p.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Request Bulk Quote (100 Bags)</span>
                    </button>

                    <button
                      onClick={() => addToCart(p, p.minOrderQty)}
                      className="w-full py-2 px-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 active:scale-[0.98] text-white font-semibold text-xs transition border border-charcoal-700 flex items-center justify-center space-x-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart ({p.minOrderQty} {p.unit})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

