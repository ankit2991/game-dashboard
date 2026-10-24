import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  Eye,
  Edit2,
  Ban,
  CheckCircle2,
  Coins,
  Download,
  UserPlus,
  RefreshCw,
  Wallet,
  TrendingUp,
  History
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { mockUsers } from '../../../data/mock/adminData';
import type { User, UserStatus } from '../../../types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusActionReason, setStatusActionReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (newStatus: UserStatus) => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
    );
    showToast(`User ${selectedUser.username} status updated to ${newStatus.toUpperCase()}`);
    setIsStatusModalOpen(false);
    setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    showToast(`Profile details for ${selectedUser.name} saved successfully.`);
    setIsEditModalOpen(false);
  };

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
            <Users className="w-6 h-6 text-[#7C5CFC]" />
            User & Player Management
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Audit player registrations, KYC statuses, wallet balances, and risk exposure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => showToast('User list exported to CSV.')}
          >
            Export Users
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={() => showToast('Manual user registration flow initialized.')}
          >
            Add New Player
          </Button>
        </div>
      </div>

      {/* Metric summary banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Total Accounts</span>
          <p className="text-xl font-bold text-white font-display mt-1">284,920</p>
          <span className="text-[10px] text-[#20C997]">↑ 1,420 registered today</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">KYC Verified</span>
          <p className="text-xl font-bold text-[#20C997] font-display mt-1">89.4%</p>
          <span className="text-[10px] text-[#98A5BF]">254,718 Tier-1 Verified</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Active Players</span>
          <p className="text-xl font-bold text-[#00D4FF] font-display mt-1">38,412</p>
          <span className="text-[10px] text-[#98A5BF]">Online in past 24h</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Suspended / Risk</span>
          <p className="text-xl font-bold text-[#FF5D73] font-display mt-1">142</p>
          <span className="text-[10px] text-[#FF5D73]">Flagged for review</span>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by name, username, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#7C5CFC] outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {(['all', 'active', 'pending', 'suspended'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-[#7C5CFC] text-white shadow-sm'
                    : 'bg-[#0B1020] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Player Info</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3">Registered</th>
                <th className="py-3 px-3">KYC Status</th>
                <th className="py-3 px-3 text-right">Wallet Balance</th>
                <th className="py-3 px-3 text-right">Total Wagered</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#98A5BF]">
                    No players found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#182238]/60 transition-colors">
                    {/* Player Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#2D3E66]"
                        />
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-[11px] text-[#A885FF] font-mono">@{user.username}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 text-[#98A5BF]">
                      <div>{user.email}</div>
                      <span className="text-[10px] text-[#64748B]">{user.phone}</span>
                    </td>

                    {/* Country */}
                    <td className="py-3 px-3">
                      <span className="text-white font-medium">{user.country}</span>
                      <span className="text-[10px] text-[#64748B] block">({user.currency})</span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-3 text-[#98A5BF]">
                      <div>{user.registeredAt}</div>
                      <span className="text-[10px] text-[#64748B]">Last: {user.lastLogin}</span>
                    </td>

                    {/* KYC */}
                    <td className="py-3 px-3">
                      <Badge
                        size="sm"
                        variant={user.verificationStatus === 'verified' ? 'success' : user.verificationStatus === 'pending' ? 'warning' : 'danger'}
                      >
                        {user.verificationStatus}
                      </Badge>
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#00D4FF]">
                      {user.currency} {user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Wagered */}
                    <td className="py-3 px-3 text-right font-mono text-[#98A5BF]">
                      {user.currency} {user.totalWagered.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        size="sm"
                        variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'}
                        dot
                      >
                        {user.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded-lg text-[#98A5BF] hover:text-white hover:bg-[#182238] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#98A5BF] hover:text-[#00D4FF] hover:bg-[#182238] transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsStatusModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#98A5BF] hover:text-[#FF5D73] hover:bg-[#182238] transition-colors"
                          title="Change Account Status"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      {selectedUser && !isEditModalOpen && !isStatusModalOpen && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Player Dossier: ${selectedUser.name}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStatusModalOpen(true)}
              >
                Change Status
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Top Identity Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B1020] border border-[#233252]">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#7C5CFC]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display">{selectedUser.name}</h3>
                  <Badge variant={selectedUser.status === 'active' ? 'success' : 'danger'} size="sm">
                    {selectedUser.status}
                  </Badge>
                </div>
                <p className="text-[#A885FF] font-mono">ID: {selectedUser.id} • @{selectedUser.username}</p>
                <p className="text-[#98A5BF] mt-0.5">{selectedUser.email} • {selectedUser.phone}</p>
              </div>
            </div>

            {/* Financial & Activity Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
                <span className="text-[#98A5BF] flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-[#00D4FF]" /> Available Balance</span>
                <p className="text-base font-bold text-[#00D4FF] font-mono mt-1">
                  {selectedUser.currency} {selectedUser.walletBalance.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
                <span className="text-[#98A5BF] flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-[#FFB547]" /> Total Wagered</span>
                <p className="text-base font-bold text-white font-mono mt-1">
                  {selectedUser.currency} {selectedUser.totalWagered.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
                <span className="text-[#98A5BF] flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#20C997]" /> Total Won</span>
                <p className="text-base font-bold text-[#20C997] font-mono mt-1">
                  {selectedUser.currency} {selectedUser.totalWon.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Simulated Session Logs */}
            <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#233252]">
              <span className="font-semibold text-white mb-2 block flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#7C5CFC]" /> Recent Game Sessions
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 border-b border-[#233252]/60">
                  <span className="text-white">Gates of Olympus 1000 (Pragmatic)</span>
                  <span className="text-[#20C997] font-bold">+MYR 1,250.00 (Win)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#233252]/60">
                  <span className="text-white">Aviator Turbo Multiplier (Spribe)</span>
                  <span className="text-[#FF5D73] font-bold">-MYR 50.00 (Bet)</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-white">Sweet Bonanza Deluxe (Pragmatic)</span>
                  <span className="text-[#20C997] font-bold">+MYR 480.00 (Win)</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Profile: ${selectedUser.username}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
            <Input
              label="Full Name"
              defaultValue={selectedUser.name}
            />
            <Input
              label="Email Address"
              defaultValue={selectedUser.email}
            />
            <Input
              label="Phone Number"
              defaultValue={selectedUser.phone}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                KYC Verification Level
              </label>
              <select
                defaultValue={selectedUser.verificationStatus}
                className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none"
              >
                <option value="verified">Verified (Tier 1 & 2 Approved)</option>
                <option value="pending">Pending Document Review</option>
                <option value="unverified">Unverified (Restrictions Apply)</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Status Action Confirmation Modal */}
      {isStatusModalOpen && selectedUser && (
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title={`Update Account Status: ${selectedUser.username}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsStatusModalOpen(false)}>
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#98A5BF]">
              Current status: <Badge variant={selectedUser.status === 'active' ? 'success' : 'danger'} size="sm">{selectedUser.status}</Badge>
            </p>

            <Input
              label="Administrative Reason (Mandatory for audit trail)"
              placeholder="e.g. Cleared AML screening / Temporary freeze requested"
              value={statusActionReason}
              onChange={(e) => setStatusActionReason(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus('active')}
              >
                Set Active
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUpdateStatus('pending')}
              >
                Set Pending
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleUpdateStatus('suspended')}
              >
                Suspend Account
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
