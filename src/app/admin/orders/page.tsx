'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { Order } from '@/types';
import {
  Package,
  Search,
  Filter,
  Eye,
  MapPin,
  Clock,
  User,
  Truck,
  CreditCard,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell
      appType="admin"
      title="Platform Orders & Fulfillment Oversight"
      subtitle="Track end-to-end commercial purchase orders, dispatch status, payment reconciliation, and yard fulfillment."
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by order #, customer, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white placeholder-charcoal-400 focus:outline-none focus:border-construction-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-charcoal-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-construction-500"
            >
              <option value="ALL">All Statuses ({orders.length})</option>
              <option value="PLACED">Placed</option>
              <option value="ACCEPTED">Accepted by Yard</option>
              <option value="PREPARING">Preparing Materials</option>
              <option value="READY_FOR_DISPATCH">Ready for Dispatch</option>
              <option value="ASSIGNED">Driver Assigned</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order List Table */}
          <div className="lg:col-span-7 bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-charcoal-850 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer & Yard</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800">
                  {filtered.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-charcoal-800/80' : 'hover:bg-charcoal-800/40'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-construction-400">
                          {order.orderNumber}
                          <span className="block text-[10px] text-charcoal-400 font-normal">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{order.customerName}</p>
                          <p className="text-[11px] text-charcoal-400">{order.businessName}</p>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-700"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Detail Panel */}
          <div className="lg:col-span-5 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card space-y-5">
            {selectedOrder ? (
              <>
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400">
                      Order Details
                    </span>
                    <h3 className="text-base font-bold text-white font-mono">{selectedOrder.orderNumber}</h3>
                  </div>
                  <StatusBadge status={selectedOrder.status} size="md" />
                </div>

                {/* Customer & Location */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2 text-charcoal-300">
                    <User className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">{selectedOrder.customerName}</span>
                      <span className="block text-[11px] text-charcoal-400">{selectedOrder.customerPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-charcoal-300">
                    <MapPin className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.locality},{' '}
                      {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
                    </span>
                  </div>

                  {selectedOrder.deliveryPartnerName && (
                    <div className="flex items-start space-x-2 text-charcoal-300 pt-2 border-t border-charcoal-800">
                      <Truck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Assigned Driver: {selectedOrder.deliveryPartnerName}</span>
                        <span className="block text-[11px] text-charcoal-400 font-mono">
                          Phone: {selectedOrder.deliveryPartnerPhone} &bull; OTP: {selectedOrder.deliveryOtp}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2 pt-2 border-t border-charcoal-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Material Manifest</h4>
                  <div className="space-y-1.5">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-charcoal-850 border border-charcoal-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{item.productName}</p>
                          <p className="text-[10px] text-charcoal-400">
                            {item.quantity} {item.unit} @ ₹{item.unitPrice.toLocaleString('en-IN')}/{item.unit}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-white">₹{item.total.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="p-3 rounded-lg bg-charcoal-950 border border-charcoal-800 space-y-1 text-xs">
                  <div className="flex justify-between text-charcoal-400">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>Delivery & Handling:</span>
                    <span className="font-mono">₹{selectedOrder.deliveryFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>Taxes (GST):</span>
                    <span className="font-mono">₹{selectedOrder.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-charcoal-800">
                    <span>Total Amount:</span>
                    <span className="font-mono text-construction-400">
                      ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    Payment: {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-charcoal-400 text-xs">Select an order to view manifest</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

