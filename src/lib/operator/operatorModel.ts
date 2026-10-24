import type { OperatorProfile, OperatorStatus } from '../api/operator';

const STATUSES = new Set(['pending', 'approved', 'rejected', 'suspended']);
export function validateOperatorProfile(profile: OperatorProfile): OperatorProfile {
  if (!profile || typeof profile !== 'object' ||
      typeof profile.id !== 'string' || !/^[0-9a-f-]{36}$/.test(profile.id) ||
      typeof profile.email !== 'string' || !profile.email.includes('@') ||
      typeof profile.companyName !== 'string' || !profile.companyName.trim() ||
      typeof profile.contactPerson !== 'string' || !profile.contactPerson.trim() ||
      !STATUSES.has(profile.status) || typeof profile.partnerProvisioned !== 'boolean') {
    throw new Error('Invalid operator account returned by backend.');
  }
  return profile;
}
export function operatorTarget(status: OperatorStatus): string {
  return status === 'approved' ? '/operator/dashboard' :
    status === 'pending' ? '/operator/pending-approval' : '/access-denied';
}
