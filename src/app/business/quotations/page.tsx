'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { Quotation } from '@/types';
import {
  FileText,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function BusinessQuotationsPage() {
  const { activeBusinessId, businesses, quotations, respondToQuotation, setDemoStep } = useDemoStore();
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(quotations[0] || null);
  const [modalOpen, setModalOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState('380');
  const [deliveryFee, setDeliveryFee] = useState('1200');
  const [taxAmount, setTaxAmount] = useState('6840');
  const [validityDays, setValidityDays] = useState('7');
  const [notes, setNotes] = useState('Direct ground floor unloading included. Valid for 7 calendar days.');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const storeQuotes = quotations.filter((q) => q.businessId === business.id);

  const handleOpenRespond = (q: Quotation) => {
    setSelectedQuote(q);
    const item = q.items[0];
    setUnitPrice(item ? item.quotedUnitPrice.toString() : '380');
    setDeliveryFee(q.deliveryCharges ? q.deliveryCharges.toString() : '1200');
    setTaxAmount(q.taxCharges ? q.taxCharges.toString() : '6840');
    setValidityDays(q.validityDays ? q.validityDays.toString() : '7');
    setNotes(q.termsAndNotes || 'Bulk commercial rate approved.');
    setModalOpen(true);
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    respondToQuotation(selectedQuote.id, {
      quotedUnitPrice: Number(unitPrice) || 380,
      deliveryCharges: Number(deliveryFee) || 1200,
      taxCharges: Number(taxAmount) || 6840,
      validityDays: Number(validityDays) || 7,
      termsAndNotes: notes,
    });

    setToastMsg(`Official quotation #${selectedQuote.quotationNumber} transmitted to customer ${selectedQuote.customerName}!`);
    setModalOpen(false);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <AppShell
      appType="business"
      title="Commercial Material Quotations & Bids"
      subtitle={`Review incoming contractor material requests and submit official pricing for ${business.name}.`}
    >
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{toastMsg}</span>
            </div>
            <button
              onClick={() => {
                setDemoStep(5);
                window.location.href = '/customer/quotations';
              }}
              className="text-xs text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md transition flex items-center space-x-1"
            >
              <span>Continue to Step 5 (Customer Accept)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Demo Hint Banner for Step 4 */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 4:</strong>
              <span>
                Contractor <strong>Ramesh Kumar (InfraBuild)</strong> requested a bulk estimate for 100 bags of UltraTech Cement. Click <strong>Formulate Quote & Submit</strong> to send official pricing!
              </span>
            </div>
          </div>
        </div>

        {/* Quotations Mobile Card Feed */}
        <div className="space-y-3">
          {storeQuotes.map((quote) => (
            <div
              key={quote.id}
              className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
            >
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
                <div>
                  <span className="font-mono font-bold text-construction-400 text-xs">
                    {quote.quotationNumber}
                  </span>
                  <span className="block text-[10px] text-charcoal-500 font-mono">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <StatusBadge status={quote.status} />
              </div>

              {/* Customer & Locality */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{quote.customerName}</span>
                  <span className="text-[10px] font-mono text-charcoal-400">{quote.customerPhone}</span>
                </div>
                <p className="text-[11px] text-charcoal-400 flex items-center">
                  <User className="w-3 h-3 mr-1 text-charcoal-500" />
                  Site: {quote.customerAddress.locality}, {quote.customerAddress.city}
                </p>
              </div>

              {/* Material Items List */}
              <div className="p-2.5 rounded-xl bg-charcoal-850 border border-charcoal-800/80 space-y-1 text-xs">
                {quote.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-charcoal-300">
                    <span>
                      <strong className="text-white">{it.requestedQty} {it.unit}</strong> &bull; {it.productName}
                    </span>
                    <span className="font-mono text-construction-400 font-bold">
                      ₹{(it.quotedUnitPrice || 380)}/{it.unit}
                    </span>
                  </div>
                ))}
                <div className="pt-1.5 mt-1 border-t border-charcoal-800 flex justify-between font-bold text-white text-xs">
                  <span>Total Bid:</span>
                  <span className="font-mono text-construction-400 text-sm">
                    ₹{quote.totalEstimatedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenRespond(quote)}
                className="w-full py-2.5 px-3 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Formulate Quote & Submit</span>
              </button>
            </div>
          ))}
        </div>

        {/* Modal: Formulate Official Quote */}
        {modalOpen && selectedQuote && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400">
                    Formulate Commercial Bid
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{selectedQuote.quotationNumber}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-charcoal-400 hover:text-white">
                  &times;
                </button>
              </div>

              <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 text-xs space-y-1">
                <p className="text-white font-semibold">Customer: {selectedQuote.customerName}</p>
                <p className="text-charcoal-400 text-[11px]">
                  Site: {selectedQuote.customerAddress.locality}, {selectedQuote.customerAddress.city}
                </p>
                <p className="text-construction-400 font-mono text-[11px] pt-1">
                  Requested Material: {selectedQuote.items[0]?.requestedQty} {selectedQuote.items[0]?.unit} of {selectedQuote.items[0]?.productName}
                </p>
              </div>

              <form onSubmit={handleSendResponse} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">
                      Quoted Rate / Unit (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">
                      Haulage & Transport Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">
                      Statutory GST Tax (18% ₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">
                      Quote Validity (Days)
                    </label>
                    <input
                      type="number"
                      required
                      value={validityDays}
                      onChange={(e) => setValidityDays(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">Delivery Terms & Unloading Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
                  />
                </div>

                <div className="pt-3 border-t border-charcoal-800 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-charcoal-400 hover:bg-charcoal-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold transition shadow-sm flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Official Quotation</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

