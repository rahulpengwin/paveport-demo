'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { Business } from '@/types';
import {
  Building2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Eye,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function AdminBusinessesPage() {
  const { businesses, approveBusiness, suspendBusiness, reactivateBusiness, setDemoStep } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filtered = businesses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenApproveModal = (business: Business) => {
    setSelectedBusiness(business);
    setAdminNotes('Verified Government GSTIN REG-06 and Karnataka Municipal Commercial Trade Permit.');
    setApprovalModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedBusiness) return;
    approveBusiness(selectedBusiness.id, adminNotes);
    setApprovalModalOpen(false);
    setSuccessToast(`Successfully verified and approved ${selectedBusiness.name}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSuspend = (id: string, name: string) => {
    const reason = prompt(`Enter suspension reason for ${name}:`, 'Pending annual trade compliance documentation.');
    if (reason) {
      suspendBusiness(id, reason);
      setSuccessToast(`Suspended ${name}. Catalog frozen.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleReactivate = (id: string, name: string) => {
    reactivateBusiness(id);
    setSuccessToast(`Reactivated ${name} for active trading.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <AppShell
      appType="admin"
      title="Business Directory & KYC Verification"
      subtitle="Manage registered construction material vendors, inspect trade permits, and grant marketplace trading access."
    >
      <div className="space-y-6">
        {/* Success Alert */}
        {successToast && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{successToast}</span>
            </div>
            <button
              onClick={() => {
                setDemoStep(2);
                window.location.href = '/business/products';
              }}
              className="text-xs text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md transition flex items-center space-x-1"
            >
              <span>Continue to Step 2 (Business App)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Demo Hint Banner for Step 1 */}
        {businesses.some((b) => b.verificationStatus === 'PENDING') && (
          <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 1:</strong>
                <span>
                  Notice <strong>DecoRock Precast, Pavers & AAC Blocks</strong> has a <StatusBadge status="PENDING" /> status. Click <strong>Review KYC & Approve</strong> below to activate their store!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by vendor, GSTIN, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white placeholder-charcoal-400 focus:outline-none focus:border-construction-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-charcoal-400" />
            <span className="text-xs text-charcoal-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-construction-500"
            >
              <option value="ALL">All Statuses ({businesses.length})</option>
              <option value="APPROVED">Approved ({businesses.filter((b) => b.verificationStatus === 'APPROVED').length})</option>
              <option value="PENDING">Pending Approval ({businesses.filter((b) => b.verificationStatus === 'PENDING').length})</option>
              <option value="SUSPENDED">Suspended ({businesses.filter((b) => b.verificationStatus === 'SUSPENDED').length})</option>
            </select>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-850 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Business Details</th>
                  <th className="py-3 px-4">Registration / GSTIN</th>
                  <th className="py-3 px-4">Categories & Service Area</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {filtered.map((business) => (
                  <tr key={business.id} className="hover:bg-charcoal-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-construction-400 font-bold shrink-0">
                          {business.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{business.name}</p>
                          <p className="text-[11px] text-charcoal-400">
                            {business.ownerName} &bull; {business.ownerPhone}
                          </p>
                          <p className="text-[11px] text-charcoal-500 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1" />
                            {business.address.locality}, {business.address.city} ({business.address.pincode})
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-charcoal-300">
                      <span className="block font-semibold text-white">{business.registrationNumber}</span>
                      <span className="text-[10px] text-charcoal-400">
                        {business.documents.length} verified KYC document(s)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {business.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-1.5 py-0.5 rounded bg-charcoal-800 text-[10px] text-charcoal-300 font-mono"
                          >
                            {cat.replace('cat-', '')}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-charcoal-400 font-mono mt-1">
                        Coverage: {business.serviceablePincodes.join(', ')}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={business.verificationStatus} />
                      {business.verificationNotes && (
                        <p className="text-[10px] text-charcoal-400 mt-1 max-w-xs leading-normal">
                          {business.verificationNotes}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {business.verificationStatus === 'PENDING' && (
                        <button
                          onClick={() => handleOpenApproveModal(business)}
                          className="px-3 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm inline-flex items-center space-x-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Review KYC & Approve</span>
                        </button>
                      )}

                      {business.verificationStatus === 'APPROVED' && (
                        <button
                          onClick={() => handleSuspend(business.id, business.name)}
                          className="px-2.5 py-1 rounded-lg border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs transition"
                        >
                          Suspend Store
                        </button>
                      )}

                      {business.verificationStatus === 'SUSPENDED' && (
                        <button
                          onClick={() => handleReactivate(business.id, business.name)}
                          className="px-2.5 py-1 rounded-lg border border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/40 text-xs transition"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KYC Document Verification Modal */}
        {approvalModalOpen && selectedBusiness && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between border-b border-charcoal-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-construction-500/10 border border-construction-500/20 text-construction-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Review Vendor Registration</h3>
                    <p className="text-xs text-charcoal-400">{selectedBusiness.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setApprovalModalOpen(false)}
                  className="p-1 rounded text-charcoal-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Submitted Documents Inspection */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-charcoal-300 uppercase tracking-wider font-mono">
                  Submitted Government Legal Documents
                </h4>
                <div className="space-y-2">
                  {selectedBusiness.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-construction-400" />
                        <div>
                          <p className="font-semibold text-white">{doc.documentName}</p>
                          <p className="font-mono text-[10px] text-charcoal-400">Doc #: {doc.documentNumber}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 font-mono text-[10px] font-bold">
                        VERIFIED SAMPLE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Compliance Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-300">Administrative Decision Note</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-construction-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-charcoal-400 hover:bg-charcoal-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  className="px-5 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Grant Trading License (Approve)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

