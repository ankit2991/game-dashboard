import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  KeyRound,
  Download,
  Plus,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
  DollarSign
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { mockOperators } from '../../../data/mock/adminData';
import type { Operator, OperatorApprovalStatus } from '../../../types';

export const OperatorManagement: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>(mockOperators);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isNewOperatorModalOpen, setIsNewOperatorModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredOperators = operators.filter((op) => {
    const matchesSearch =
      op.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || op.approvalStatus === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleSetApproval = (status: OperatorApprovalStatus) => {
    if (!selectedOperator) return;
    setOperators((prev) =>
      prev.map((op) =>
        op.id === selectedOperator.id
          ? {
              ...op,
              approvalStatus: status,
              accountStatus: status === 'approved' ? 'active' : status === 'rejected' ? 'disabled' : op.accountStatus,
              productionEnabled: status === 'approved',
              notes: status === 'rejected' ? rejectionReason || op.notes : op.notes
            }
          : op
      )
    );
    showToast(`Operator ${selectedOperator.companyName} set to ${status.toUpperCase()}`);
    setIsReviewModalOpen(false);
    setSelectedOperator(null);
  };

  const pendingCount = operators.filter((o) => o.approvalStatus === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#20C997] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#00D4FF]" />
            B2B Operator Licensing & Partners
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Review aggregator license applications, manage production credentials, and track monthly GGR volume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => showToast('Operator master list exported to CSV.')}
          >
            Export Operators
          </Button>
          <Button
            variant="cyan"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsNewOperatorModalOpen(true)}
          >
            Onboard New Operator
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Active Operators</span>
          <p className="text-xl font-bold text-white font-display mt-1">
            {operators.filter((o) => o.approvalStatus === 'approved').length}
          </p>
          <span className="text-[10px] text-[#20C997]">Commercial Partners</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Pending Compliance</span>
          <p className="text-xl font-bold text-[#FFB547] font-display mt-1">{pendingCount}</p>
          <span className="text-[10px] text-[#FFB547]">Awaiting KYC Review</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Total Monthly Requests</span>
          <p className="text-xl font-bold text-[#7C5CFC] font-display mt-1">85.3M</p>
          <span className="text-[10px] text-[#98A5BF]">Through Provider Gateway</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Total Operator GMV</span>
          <p className="text-xl font-bold text-[#00D4FF] font-display mt-1">$37.5M</p>
          <span className="text-[10px] text-[#20C997]">↑ 18.2% month-over-month</span>
        </div>
      </div>

      {/* Filters & Table */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by company, contact person, country or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#00D4FF] outline-none"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-[#00D4FF] text-[#0B1020] font-bold shadow-sm'
                    : 'bg-[#0B1020] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
                }`}
              >
                {tab === 'pending' ? `Pending (${pendingCount})` : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Company Details</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Country / Reg No.</th>
                <th className="py-3 px-3 text-center">Integrated Games</th>
                <th className="py-3 px-3 text-right">Monthly Requests</th>
                <th className="py-3 px-3 text-right">GMV Volume</th>
                <th className="py-3 px-3 text-center">Approval</th>
                <th className="py-3 px-3 text-center">Account</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#98A5BF]">
                    No operators match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOperators.map((op) => (
                  <tr key={op.id} className="hover:bg-[#182238]/60 transition-colors">
                    {/* Company */}
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-semibold text-white text-sm">{op.companyName}</p>
                        <a
                          href={op.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#00D4FF] hover:underline flex items-center gap-1"
                        >
                          {op.website} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 text-[#98A5BF]">
                      <div className="font-medium text-white">{op.contactPerson}</div>
                      <span className="text-[10px] text-[#64748B]">{op.email}</span>
                    </td>

                    {/* Country */}
                    <td className="py-3 px-3">
                      <span className="text-white font-medium">{op.country}</span>
                      <span className="text-[10px] text-[#64748B] block font-mono">{op.registrationNumber || 'Pending'}</span>
                    </td>

                    {/* Integrated Games */}
                    <td className="py-3 px-3 text-center font-bold text-[#A885FF]">
                      {op.integratedGamesCount}
                    </td>

                    {/* Requests */}
                    <td className="py-3 px-3 text-right font-mono text-[#98A5BF]">
                      {op.monthlyApiRequests > 0 ? `${(op.monthlyApiRequests / 1000000).toFixed(1)}M` : '0'}
                    </td>

                    {/* GMV */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#20C997]">
                      ${(op.totalGmv / 1000000).toFixed(2)}M
                    </td>

                    {/* Approval */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        size="sm"
                        variant={
                          op.approvalStatus === 'approved'
                            ? 'success'
                            : op.approvalStatus === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                        dot
                      >
                        {op.approvalStatus}
                      </Badge>
                    </td>

                    {/* Account Status */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        size="sm"
                        variant={op.accountStatus === 'active' ? 'success' : op.accountStatus === 'pending' ? 'warning' : 'danger'}
                      >
                        {op.accountStatus}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant={op.approvalStatus === 'pending' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedOperator(op);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          {op.approvalStatus === 'pending' ? 'Review Application' : 'Manage'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Operator Application Modal */}
      {selectedOperator && isReviewModalOpen && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedOperator(null);
          }}
          title={`Operator Compliance Review: ${selectedOperator.companyName}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleSetApproval('rejected')}
              >
                Reject & Deny Access
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSetApproval('approved')}
                >
                  Approve & Issue Production Keys
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0B1020] border border-[#233252]">
              <div>
                <span className="text-[#98A5BF]">Operator Legal Entity:</span>
                <p className="font-semibold text-white mt-0.5">{selectedOperator.companyName}</p>
              </div>
              <div>
                <span className="text-[#98A5BF]">Country of Operation:</span>
                <p className="font-semibold text-white mt-0.5">{selectedOperator.country}</p>
              </div>
              <div>
                <span className="text-[#98A5BF]">Corporate Registration:</span>
                <p className="font-mono text-white mt-0.5">{selectedOperator.registrationNumber || 'Under Filing'}</p>
              </div>
              <div>
                <span className="text-[#98A5BF]">Business Domain:</span>
                <p className="text-[#00D4FF] mt-0.5">{selectedOperator.website}</p>
              </div>
            </div>

            <div>
              <span className="font-semibold text-white block mb-1">Compliance & Risk Evaluation</span>
              <p className="p-3 rounded-xl bg-[#182238] border border-[#233252] text-[#98A5BF]">
                {selectedOperator.notes || 'Documents verified: Certificate of Incorporation, Proof of Gambling License, and AML Policy statement uploaded.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                Rejection or Conditional Notes (if applicable)
              </label>
              <Input
                placeholder="Enter regulatory grounds or required additional disclosures..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Onboard New Operator Modal */}
      {isNewOperatorModalOpen && (
        <Modal
          isOpen={isNewOperatorModalOpen}
          onClose={() => setIsNewOperatorModalOpen(false)}
          title="Onboard New Commercial Operator"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsNewOperatorModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                onClick={() => {
                  showToast('Operator onboarding request submitted for compliance verification.');
                  setIsNewOperatorModalOpen(false);
                }}
              >
                Create Operator Account
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <Input label="Company Legal Name" placeholder="e.g. Apex Gaming Group Ltd" required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Business Website" placeholder="https://apexgaming.io" required />
              <Input label="Registration Number" placeholder="REG-2026-9910" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Contact Person" placeholder="David Miller" required />
              <Input label="Business Email" placeholder="d.miller@apexgaming.io" type="email" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Phone Number" placeholder="+44 20 7946 0991" />
              <Input label="Jurisdiction / Country" placeholder="Malta" required />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
