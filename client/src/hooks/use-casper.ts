import { useState, useCallback, useEffect } from 'react';

export interface WalletState {
  isConnected: boolean;
  activeKey: string | null;
  balance: string;
}

declare global {
  interface Window {
    casperWallet?: any;
    CasperWalletProvider?: any;
  }
}

export function useCasperWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    activeKey: null,
    balance: '—',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect wallet provider
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initProvider = async () => {
      if (window.CasperWalletProvider) {
        setProvider(window.CasperWalletProvider());
      } else if (window.casperWallet) {
        setProvider(window.casperWallet);
      }
    };
    initProvider();
  }, []);

  const fetchBalance = useCallback(async (publicKey: string) => {
    setWalletState(prev => ({ 
      ...prev, 
      isConnected: true, 
      activeKey: publicKey, 
      balance: "—" 
    }));
    console.log("[Casper] Wallet connected:", publicKey);
  }, []);

  // Sync initial connection and fetch balance
  useEffect(() => {
    if (!provider) return;
    
    let isMounted = true;
    const checkInitial = async () => {
      try {
        const isConnected = await provider.isConnected();
        if (isConnected && isMounted) {
          const publicKey = await provider.getActivePublicKey();
          if (publicKey) {
            setWalletState(prev => ({ ...prev, isConnected: true, activeKey: publicKey }));
            fetchBalance(publicKey);
          }
        }
      } catch (err) {
        console.error("Initial connection check failed:", err);
      }
    };
    
    checkInitial();
    return () => { isMounted = false; };
  }, [provider, fetchBalance]);

  const connect = useCallback(async () => {
    if (!provider) {
      throw new Error("Casper Wallet / CSPR.click is not installed");
    }
    
    setIsConnecting(true);
    try {
      const isConnected = await provider.requestConnection();
      if (isConnected) {
        const publicKey = await provider.getActivePublicKey();
        if (publicKey) {
          setWalletState(prev => ({ ...prev, isConnected: true, activeKey: publicKey }));
          await fetchBalance(publicKey);
        }
        return publicKey;
      }
    } catch (error: any) {
      throw new Error(error.message || "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  }, [provider, fetchBalance]);

  const disconnect = useCallback(async () => {
    if (provider && provider.disconnectFromSite) {
      try {
        await provider.disconnectFromSite();
      } catch (err) {
        console.error("Disconnect error:", err);
      }
    }
    setWalletState({
      isConnected: false,
      activeKey: null,
      balance: '—',
    });
  }, [provider]);

  const signAndSendDeploy = useCallback(async (deploy: any) => {
    // Transaction signing is disabled in frontend to prevent SDK crashes
    throw new Error("Transaction signing moved to backend for stability.");
  }, []);

  return {
    ...walletState,
    isConnecting,
    connect,
    disconnect,
    signAndSendDeploy,
    refreshBalance: () => walletState.activeKey && fetchBalance(walletState.activeKey),
    providerDetected: !!provider,
    error
  };
}
