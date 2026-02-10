'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';

interface InviteQrModalProps {
  inviteCode: string;
  groupName: string;
  onClose: () => void;
}

export function InviteQrModal({ inviteCode, groupName, onClose }: InviteQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${inviteCode}`;

  useEffect(() => {
    QRCode.toDataURL(inviteUrl, {
      width: 256,
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [inviteUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-1">Invite to {groupName}</h3>
        <p className="text-sm text-slate-500 mb-6">Share this QR code or link to invite others.</p>

        {qrDataUrl && (
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 rounded-lg" />
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 mb-4">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none truncate"
          />
          <Button
            variant="secondary"
            onClick={handleCopy}
            icon={copied ? Check : Copy}
            className="shrink-0"
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </div>
  );
}
