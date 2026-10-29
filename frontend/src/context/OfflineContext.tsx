import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineStorage } from '../services/offlineStorage';
import { api } from '../services/api';

interface OfflineContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  pendingCount: number;
  syncPendingAttempts: () => Promise<{ success: boolean; syncedCount: number }>;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [realOnline, setRealOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const updatePendingCount = () => {
    setPendingCount(offlineStorage.getPendingAttempts().length);
  };

  useEffect(() => {
    updatePendingCount();

    const handleOnline = () => {
      setRealOnline(true);
      if (!isSimulatedOffline) {
        syncPendingAttempts();
      }
    };
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const effectiveOnline = realOnline && !isSimulatedOffline;

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  const syncPendingAttempts = async (): Promise<{ success: boolean; syncedCount: number }> => {
    const pending = offlineStorage.getPendingAttempts();
    if (pending.length === 0) return { success: true, syncedCount: 0 };

    setIsSyncing(true);
    let synced = 0;

    try {
      for (const item of pending) {
        if (item.evaluation_id && item.answers) {
          await api.submitEvaluation(item.evaluation_id, item.answers, true);
          synced++;
        }
      }
      offlineStorage.clearPendingAttempts();
      updatePendingCount();
      return { success: true, syncedCount: synced };
    } catch (e) {
      console.error('Error during offline sync:', e);
      return { success: false, syncedCount: synced };
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline: effectiveOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        pendingCount,
        syncPendingAttempts,
        isSyncing,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
};
