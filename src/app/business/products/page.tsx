'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Product } from '@/types';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function BusinessProductsPage() {
  const { activeBusinessId, businesses, products, addProduct, updateProduct, setDemoStep } = useDemoStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const storeProducts = products.filter((p) => p.businessId === business.id);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [grade, setGrade] = useState('');
  const [unit, setUnit] = useState('Bags (50kg)');
  const [price, setPrice] = useState('385');
  const [minQty, setMinQty] = useState('20');
  const [stock, setStock] = useState('500');
  const [category, setCategory] = useState('cat-cement');
  const [handling, setHandling] = useState('Store in dry elevated warehouse.');

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setBrand('UltraTech');
    setGrade('OPC 53 Grade IS 269:2015');
    setUnit('Bags (50kg)');
    setPrice('385');
    setMinQty('20');
    setStock('500');
    setCategory('cat-cement');
    setHandling('Keep away from moisture; store on pallets.');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setGrade(p.gradeSpecification);
    setUnit(p.unit);
    setPrice(p.pricePerUnit.toString());
    setMinQty(p.minOrderQty.toString());
    setStock(p.availableStock.toString());
    setCategory(p.categoryId);
    setHandling(p.handlingNotes);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        brand,
        gradeSpecification: grade,
        unit,
        pricePerUnit: Number(price) || 100,
        minOrderQty: Number(minQty) || 1,
        availableStock: Number(stock) || 0,
        handlingNotes: handling,
      });
      setToastMsg(`Updated product attributes for ${name}!`);
    } else {
      addProduct({
        businessId: business.id,
        businessName: business.name,
        name,
        categoryId: category,
        categoryName: category === 'cat-cement' ? 'Cement & Binders' : 'TMT Steel & Rebar',
        brand,
        gradeSpecification: grade,
        unit,
        pricePerUnit: Number(price) || 100,
        minOrderQty: Number(minQty) || 1,
        availableStock: Number(stock) || 0,
        reservedStock: 0,
        lowStockThreshold: 50,
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        handlingNotes: handling,
        isArchived: false,
      });
      setToastMsg(`Successfully added ${name} to your store catalog!`);
    }

    setModalOpen(false);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <AppShell
      appType="business"
      title="Store Catalog & Material Specification"
      subtitle={`Configure commercial rates, minimum order quantities (MOQ), and packaging units for ${business.name}.`}
      action={
        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Construction Material</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Toast */}
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{toastMsg}</span>
            </div>
            <button
              onClick={() => {
                setDemoStep(3);
                window.location.href = '/customer/stores';
              }}
              className="text-xs text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md transition flex items-center space-x-1"
            >
              <span>Continue to Step 3 (Customer Discovery)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Demo Hint Banner for Step 2 */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 2:</strong>
              <span>
                You are currently acting as <strong>{business.name}</strong>. Inspect your UltraTech cement pricing or add a new material SKU. When satisfied, proceed to <strong>Step 3 (Customer App)</strong> to place an order!
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setDemoStep(3);
              window.location.href = '/customer/stores';
            }}
            className="px-3 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs shrink-0 transition flex items-center space-x-1"
          >
            <span>Proceed to Step 3</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Products Mobile Card List */}
        <div className="space-y-3">
          {storeProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-construction-400 uppercase">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-tight mt-0.5">{prod.name}</h4>
                  <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">{prod.gradeSpecification}</p>
                </div>
                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="px-2 py-1 rounded-lg border border-charcoal-700 bg-charcoal-800 text-charcoal-300 hover:text-white text-[11px] transition inline-flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-charcoal-800/60 text-xs">
                <div>
                  <span className="font-mono font-bold text-white text-sm">
                    ₹{prod.pricePerUnit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-mono"> / {prod.unit}</span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-emerald-400 font-bold">{prod.availableStock} in stock</span>
                  {prod.reservedStock > 0 && (
                    <span className="block text-[9px] text-amber-400 font-mono">
                      ({prod.reservedStock} reserved)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add / Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'Edit Material SKU' : 'Add New Construction Material'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-charcoal-400 hover:text-white">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. UltraTech Super OPC 53 Cement"
                    className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. UltraTech"
                      className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">Unit of Measure (UOM)</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500 font-mono"
                    >
                      <option value="Bags (50kg)">Bags (50kg)</option>
                      <option value="Metric Tonne">Metric Tonne</option>
                      <option value="Cubic Feet (cft)">Cubic Feet (cft)</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Bundle">Bundle</option>
                      <option value="Truckload">Truckload</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">Grade / Technical Specification</label>
                  <input
                    type="text"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. IS 269:2015 High Early Strength OPC 53"
                    className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">Price / Unit (₹)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">Minimum Order Qty</label>
                    <input
                      type="number"
                      required
                      value={minQty}
                      onChange={(e) => setMinQty(e.target.value)}
                      className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-300 font-semibold mb-1">Physical Stock</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">Handling & Storage Notes</label>
                  <textarea
                    rows={2}
                    value={handling}
                    onChange={(e) => setHandling(e.target.value)}
                    className="w-full p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
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
                    {editingProduct ? 'Save Changes' : 'Add to Catalog'}
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

