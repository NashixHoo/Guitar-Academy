import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-xs font-semibold shadow-lg border border-emerald-700 animate-in fade-in slide-in-from-bottom-2">
        <Wifi className="w-4 h-4" />
        <span>Conexão restabelecida! Modo Online.</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-[#7B1E2B] text-white px-3.5 py-2 text-xs font-semibold shadow-lg border border-[#B52A3A]">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Modo Offline — Seu progresso está gravado com segurança.</span>
    </div>
  );
};
