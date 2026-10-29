'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Product } from '@/types';
import { Layers, Plus, Minus, History, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BusinessInventoryPage() {
  const { activeBusinessId, businesses, products, adjustInventory, inventoryMovements } = useDemoStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState('50');
  const [adjustmentReason, setAdjustmentReason] = useState('New manufacturer truckload delivery');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const storeProducts = products.filter((p) => p.businessId === business.id);

  const handleOpenAdjust = (p: Product) => {
    setSelectedProduct(p);
    setAdjustmentDelta('50');
    setAdjustmentReason('New manufacturer bulk delivery');
    setModalOpen(true);
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const delta = Number(adjustmentDelta) || 0;
    adjustInventory(selectedProduct.id, delta, adjustmentReason);
    setToastMsg(`Adjusted inventory for ${selectedProduct.name} by ${delta > 0 ? `+${delta}` : delta} units!`);
    setModalOpen(false);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AppShell
      appType="business"
      title="Physical Yard Stock Ledger & Inventory Movements"
      subtitle={`Track physical available stock, unfulfilled order reservations, and ledger audit history for ${business.name}.`}
    >
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Stock Mobile Ledger Cards */}
        <div className="space-y-3">
          {storeProducts.map((p) => {
            const isLow = p.availableStock <= p.lowStockThreshold;
            return (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{p.name}</h4>
                    <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">{p.gradeSpecification}</p>
                  </div>
                  <button
                    onClick={() => handleOpenAdjust(p)}
                    className="px-2.5 py-1 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-construction-400 font-semibold border border-charcoal-700 text-[11px] transition"
                  >
                    Adjust
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-charcoal-800/60 text-center font-mono text-xs">
                  <div className="p-1.5 rounded-lg bg-charcoal-850">
                    <span className="text-[9px] text-charcoal-400 uppercase block font-sans">Available</span>
                    <span className="font-bold text-emerald-400">{p.availableStock}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-charcoal-850">
                    <span className="text-[9px] text-charcoal-400 uppercase block font-sans">Reserved</span>
                    <span className="font-bold text-amber-400">{p.reservedStock}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-charcoal-850">
                    <span className="text-[9px] text-charcoal-400 uppercase block font-sans">Threshold</span>
                    <span className="font-bold text-charcoal-300">{p.lowStockThreshold}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Adjust Stock Modal */}
        {modalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Adjust Stock: {selectedProduct.name}</h3>

              <form onSubmit={handleConfirmAdjust} className="space-y-3 text-xs">
                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">
                    Stock Change (Units: {selectedProduct.unit})
                  </label>
                  <p className="text-[11px] text-charcoal-500 mb-1">
                    Enter positive number for inbound arrivals, or negative for shrinkage/breakage.
                  </p>
                  <input
                    type="number"
                    required
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">Adjustment Reason / Notes</label>
                  <input
                    type="text"
                    required
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
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
                    className="px-5 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold transition shadow-sm"
                  >
                    Commit Adjustment
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

