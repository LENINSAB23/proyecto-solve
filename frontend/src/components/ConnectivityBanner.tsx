import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const ConnectivityBanner: React.FC = () => {
  const { isOnline, isSimulatedOffline, toggleSimulatedOffline, pendingCount, syncPendingAttempts, isSyncing } = useOffline();

  return (
    <div className={`text-xs py-1.5 px-4 transition-colors flex items-center justify-between border-b ${
      isOnline 
        ? 'bg-neutral-50 border-neutral-200 text-neutral-600' 
        : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Wifi className="w-3.5 h-3.5" />
              Conexión activa · Sincronizado
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              Modo sin conexión · Las respuestas se guardan en tu dispositivo
            </span>
          )}

          {pendingCount > 0 && (
            <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              {pendingCount} {pendingCount === 1 ? 'actividad pendiente de sincronizar' : 'actividades pendientes de sincronizar'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && isOnline && (
            <button
              onClick={() => syncPendingAttempts()}
              disabled={isSyncing}
              className="flex items-center gap-1 bg-neutral-900 hover:bg-black text-white px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
            </button>
          )}

          <button
            onClick={toggleSimulatedOffline}
            title="Simular pérdida de señal para probar modo offline (MIT Solve Challenge)"
            className="text-[11px] underline text-neutral-500 hover:text-neutral-900 cursor-pointer font-medium"
          >
            {isSimulatedOffline ? 'Reactivar conexión' : 'Simular desconexión'}
          </button>
        </div>
      </div>
    </div>
  );
};
