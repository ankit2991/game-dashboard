import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Palette,
  Users,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Server
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'team' | 'environment'>('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
            <Settings className="w-6 h-6 text-[#7C5CFC]" />
            Platform & Engine Settings
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Global aggregation configurations, multi-tenant branding, role permissions, and environment variables.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast('Platform configuration saved.')}
        >
          Save All Changes
        </Button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {(['general', 'security', 'team', 'environment'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/20'
                : 'bg-[#121A2D] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
            }`}
          >
            {tab} Configuration
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Brand Identity & Platform Namespacing"
              subtitle="Default white-label naming conventions for operator API responses"
            />
            <div className="space-y-4 text-xs max-w-xl">
              <Input label="Platform Title" defaultValue="Nexus Game Provider SaaS" />
              <Input label="Public Support Contact" defaultValue="compliance-ops@nexus-provider.io" />
              <Input label="Default Settlement Currency" defaultValue="USD (United States Dollar)" />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                  Platform Fee Model
                </label>
                <select className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none">
                  <option value="tiered">Tiered Take-Rate (3.0% - 2.2% on GMV)</option>
                  <option value="flat">Flat Aggregator Commission (2.5%)</option>
                  <option value="fixed">Monthly Fixed Enterprise SLA + 1.5%</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Security & 2-Factor Authentication Enforcement"
              subtitle="Mandatory cryptographic requirements for administrative personnel"
            />
            <div className="space-y-4 text-xs max-w-xl">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1020] border border-[#233252]">
                <div>
                  <p className="font-semibold text-white">Enforce Hardware 2FA for All Admins</p>
                  <p className="text-[11px] text-[#98A5BF]">Requires YubiKey or TOTP Authenticator code upon session login.</p>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1020] border border-[#233252]">
                <div>
                  <p className="font-semibold text-white">IP Session Binding</p>
                  <p className="text-[11px] text-[#98A5BF]">Terminates administrative JWT tokens if client IP address mutates.</p>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <Input label="Admin Session Inactivity Timeout (Minutes)" defaultValue="30" />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'environment' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Masked Environment Configuration & Cluster Variables"
              subtitle="Hardware endpoints and database connection strings (Masked for security)"
            />
            <div className="space-y-3.5 text-xs max-w-xl">
              <Input label="API Gateway URL (Production)" defaultValue="https://gateway.nexus-provider.io/v1" disabled />
              <Input label="API Gateway URL (Sandbox)" defaultValue="https://sandbox.nexus-provider.io/v1" disabled />
              <Input label="Master Redis Cluster Host" defaultValue="redis-cluster-prod.aws.internal:6379 (Masked)" disabled />
              <Input label="Master Database DSN" defaultValue="postgresql://app_root:••••••••••••@db-node.nexus.internal:26257" disabled />
              <p className="text-[11px] text-[#64748B]">
                🔒 Production infrastructure configuration can only be provisioned via Terraform CI/CD pipelines.
              </p>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Authorized Super Admin Personnel"
              subtitle="Staff members with master access to licensing and provider configs"
            />
            <div className="space-y-3">
              {[
                { name: 'Alex Mercer', role: 'Root Super Administrator', email: 'alex.mercer@nexus-provider.io', status: 'Active' },
                { name: 'Elena Rostova', role: 'Head of Compliance & KYC', email: 'elena.rostova@nexus-compliance.io', status: 'Active' },
                { name: 'Marcus Vance', role: 'Lead Infrastructure Engineer', email: 'm.vance@nexus-provider.io', status: 'Active' }
              ].map((member) => (
                <div key={member.email} className="p-3.5 rounded-xl bg-[#0B1020] border border-[#233252] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-[11px] text-[#A885FF]">{member.role}</p>
                    <p className="text-[10px] text-[#64748B]">{member.email}</p>
                  </div>
                  <Badge variant="success" size="sm">{member.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
