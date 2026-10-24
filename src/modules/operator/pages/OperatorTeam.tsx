import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Shield,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Developer' | 'Finance' | 'Operations';
  status: 'Active' | 'Invited';
}

export const OperatorTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: 'David Tan', email: 'd.tan@asiagaming.net', role: 'Owner', status: 'Active' },
    { id: '2', name: 'Alvin Lim', email: 'alvin.lim@asiagaming.net', role: 'Developer', status: 'Active' },
    { id: '3', name: 'Jessie Wong', email: 'jessie.w@asiagaming.net', role: 'Finance', status: 'Active' }
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Developer' | 'Finance' | 'Operations'>('Developer');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    setMembers([
      ...members,
      { id: Date.now().toString(), name: newName, email: newEmail, role: newRole, status: 'Invited' }
    ]);
    showToast(`Invitation sent to ${newEmail}`);
    setIsInviteModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#00D4FF] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#00D4FF]" />
            Operator Team & Role Permissions
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Grant your engineering and finance staff access to API keys, webhooks, and billing statements.
          </p>
        </div>

        <Button
          variant="cyan"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite Colleague
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Team Member</th>
                <th className="py-3 px-3">Work Email</th>
                <th className="py-3 px-3">Portal Role</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{m.name}</td>
                  <td className="py-3 px-3 text-[#98A5BF]">{m.email}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[#00D4FF]">{m.role}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={m.status === 'Active' ? 'success' : 'warning'} size="sm">
                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {m.role !== 'Owner' && (
                      <button
                        onClick={() => {
                          setMembers(members.filter((item) => item.id !== m.id));
                          showToast(`Removed ${m.name} from team.`);
                        }}
                        className="p-1 text-[#98A5BF] hover:text-[#FF5D73]"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <Modal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title="Invite New Team Member"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="cyan" size="sm" onClick={handleInvite}>
                Send Email Invitation
              </Button>
            </div>
          }
        >
          <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
            <Input
              label="Full Name"
              placeholder="e.g. Rachel Chen"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              label="Corporate Email Address"
              placeholder="rachel@asiagaming.net"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                Role Access Level
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none"
              >
                <option value="Developer">Developer (API Keys, Docs, Webhooks, Logs)</option>
                <option value="Finance">Finance (Statements, Reports & GGR)</option>
                <option value="Operations">Operations (Catalog, Games & Settings)</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
