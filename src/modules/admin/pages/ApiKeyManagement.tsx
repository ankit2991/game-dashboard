import React, {useState} from 'react';
import {KeyRound, RefreshCw, ShieldAlert, Copy, Check} from 'lucide-react';
import {adminApi, type AdminKeyAction, type AdminOperator} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';
import {useAuth} from '../../../context/AuthContext';
import {Button} from '../../../components/ui/Button';
import {Modal} from '../../../components/ui/Modal';

const labels:Record<AdminKeyAction,string> = {
  'provision':'Provision Partner', 'sync-games':'Sync Games', 'rotate-key':'Rotate API Key',
  'suspend-key':'Suspend API', 'activate-key':'Activate API',
};
const confirmPassword = new Set<AdminKeyAction>(['provision','rotate-key','activate-key']);

/** Credentials are not persisted to localStorage/sessionStorage/logs or React query caches.
 * A newly generated Partner API key is displayed once and cleared when dismissed. */
export const ApiKeyManagement:React.FC=()=>{
  const {getAdminAccessToken}=useAuth();
  const {data,loading,error,reload}=useAdminPortalData(adminApi.operators);
  const [selection,setSelection]=useState<{op:AdminOperator;action:AdminKeyAction}|null>(null);
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);
  const [actionError,setActionError]=useState('');
  const [notice,setNotice]=useState('');
  const [issued,setIssued]=useState<{company:string;key:string;partnerId:string}|null>(null);
  const [copied,setCopied]=useState(false);
  const close=()=>{if(busy)return;setSelection(null);setPassword('');setIssued(null);setCopied(false);};
  const doAction=async()=>{
    if(!selection||busy)return;
    setBusy(true);setActionError('');setNotice('');
    try{
      const access=await getAdminAccessToken();
      if(!access)throw new Error('Admin session expired. Sign in again.');
      const {op,action}=selection;
      const result=await adminApi.manageKey(access,op.id,action,confirmPassword.has(action)?password:undefined);
      setPassword('');setSelection(null);
      if(result.apiKey){
        setIssued({company:op.companyName,key:result.apiKey,partnerId:result.partner.id});
      }else{
        setNotice(`${op.companyName}: ${labels[action]} completed.`);
      }
      void reload();
    }catch(cause){setPassword('');setActionError(cause instanceof Error?cause.message:'Unable to update partner.');}
    finally{setBusy(false);}
  };
  const copyKey=async()=>{
    if(!issued)return;
    try{await navigator.clipboard.writeText(issued.key);setCopied(true);}
    catch{setActionError('Clipboard unavailable. Select and copy the key manually.');}
  };
  const actions=(op:AdminOperator):AdminKeyAction[]=>{
    if(op.status!=='approved')return [];
    if(!op.partnerProvisioned)return op.selectedGames?.length?['provision']:[];
    return [
      ...(op.syncRequired?['sync-games' as const]:[]),
      ...(op.partnerStatus==='active'?['suspend-key' as const]:op.allowedGames?.length?['activate-key' as const]:[]),
      'rotate-key',
    ];
  };
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-3 items-center justify-between border-b border-[#233252] pb-4">
      <div><h1 className="text-2xl text-white font-bold flex gap-2 items-center"><KeyRound className="text-[#00D4FF]"/>Operator API Management</h1>
        <p className="text-[#98A5BF] text-xs mt-1">Real MongoDB Partner permissions and API keys. Sandbox only.</p></div>
      <Button size="sm" variant="outline" disabled={busy} onClick={()=>void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    <div className="bg-[#121A2D] border border-[#233252] rounded-lg p-3 text-[#98A5BF] text-xs flex gap-2">
      <ShieldAlert className="w-4 h-4 shrink-0 text-[#FFB547]"/>
      <p>Approve the operator first, then have them choose games. Provision creates a new Partner API key; Sync Games updates the server-side allowed list. API keys are shown exactly once to the authenticated admin. Never share via public chat or commit to Git. A configured key does not mean wallet integration is ready.</p>
    </div>
    {(error||actionError)&&<p role="alert" className="text-[#FF5D73] text-sm">{actionError||error}</p>}
    {notice&&<p role="status" className="text-[#20C997] text-sm">{notice}</p>}
    {loading&&<p role="status" className="text-[#98A5BF] text-sm">Loading partner state…</p>}
    {data&&<div className="border border-[#233252] rounded-xl bg-[#121A2D] overflow-x-auto"><table className="w-full text-left text-xs">
      <thead className="text-[#98A5BF] border-b border-[#233252]"><tr><th className="p-3">Operator</th><th className="p-3">Account</th><th className="p-3">Partner API</th><th className="p-3">Selected / Allowed</th><th className="p-3">Key</th><th className="p-3">Actions</th></tr></thead>
      <tbody className="text-[#CDD6E8]">{data.operators.map(op=><tr key={op.id} className="border-b border-[#233252]/50">
        <td className="p-3"><strong className="text-white">{op.companyName}</strong><p className="break-all mt-1">{op.email}</p></td>
        <td className="p-3">{op.status}</td>
        <td className="p-3">{op.partnerProvisioned ? <span className={op.partnerStatus==='active'?'text-[#20C997]':'text-[#FFB547]'}>{op.partnerStatus}</span> : 'Not provisioned'}
          {op.partnerId&&<p className="font-mono text-[10px] mt-1 break-all">{op.partnerId}</p>}</td>
        <td className="p-3">{(op.selectedGames||[]).join(', ')||'None selected'}
          <p className="text-[#98A5BF] mt-1">Allowed: {(op.allowedGames||[]).join(', ')||'None'}</p>
          {op.syncRequired&&<span className="text-[#FFB547]">Game approval pending</span>}</td>
        <td className="p-3">{op.partnerProvisioned?'Issued (hidden)':'Not issued'}
          {op.rotationRequestedAt&&<p className="text-[#FFB547]">Rotation requested</p>}
          {op.credentialClaimedAt&&<p className="text-[#20C997]">Claimed by operator</p>}
          {op.keyRotatedAt&&<p className="text-[10px] mt-1">Last: {new Date(op.keyRotatedAt).toLocaleString()}</p>}</td>
        <td className="p-3"><div className="flex flex-wrap gap-1.5">{actions(op).map(action=><Button key={action} size="sm" variant="outline" disabled={busy}
          onClick={()=>{setActionError('');setPassword('');setSelection({op,action});}}>{labels[action]}</Button>)}</div>
          {op.status==='approved'&&!op.partnerProvisioned&&!op.selectedGames?.length&&<span>Operator must select games first</span>}
          {op.status!=='approved'&&<span>Approval required</span>}</td>
      </tr>)}</tbody></table>{!data.operators.length&&<p className="p-4 text-[#98A5BF] text-sm">No operators registered.</p>}</div>}
    <Modal isOpen={Boolean(selection)} title="Confirm partner administration" onClose={close}
      footer={<div className="flex gap-2"><Button variant="outline" disabled={busy} onClick={close}>Cancel</Button>
        <Button variant="primary" isLoading={busy} disabled={confirmPassword.has(selection?.action || 'sync-games')&&!password} onClick={()=>void doAction()}>Confirm</Button></div>}>
      <p>Execute <strong>{selection&&labels[selection.action]}</strong> for <strong>{selection?.op.companyName}</strong>?</p>
      {selection?.action==='rotate-key'&&<p className="text-[#FFB547] mt-3 text-xs">The old Partner API key will stop working immediately. Coordinate secure delivery with the operator. Initial operator self-claim is possible once only.</p>}
      {selection?.action==='sync-games'&&<p className="text-[#FFB547] mt-3 text-xs">This replaces allowed games with the current operator selections. Removed games lose authorization immediately.</p>}
      {selection?.action==='suspend-key'&&<p className="text-[#FFB547] mt-3 text-xs">Existing API requests will be denied until reactivated.</p>}
      {selection&&confirmPassword.has(selection.action)&&<label className="block text-[#98A5BF] mt-4 text-xs">Confirm administrator password
        <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg bg-[#0B1020] border border-[#233252] text-white p-2"/></label>}
    </Modal>
    <Modal isOpen={Boolean(issued)} title="Partner API Key — show once" onClose={close}
      footer={<Button onClick={close}>I have securely saved this key — Close</Button>}>
      <p className="text-xs text-[#FFB547] mb-3">This key cannot be retrieved later. Store it in a secure secret manager and deliver it to the authorized operator through a secure channel. Do not reload the page before saving it.</p>
      <p className="text-xs text-[#98A5BF] mb-2">{issued?.company} — {issued?.partnerId}</p>
      <div className="flex gap-2 items-start"><code className="bg-[#0B1020] text-[#20C997] p-3 rounded break-all min-w-0 flex-1 select-all">{issued?.key}</code>
        <Button size="sm" variant="outline" onClick={()=>void copyKey()} leftIcon={copied?<Check className="w-4 h-4"/>:<Copy className="w-4 h-4"/>}>{copied?'Copied':'Copy'}</Button></div>
    </Modal>
  </div>;
};
