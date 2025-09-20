'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface NavigationLoadingContextType {
  isNavigating: boolean;
  showProgressBar: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
  startProgressBar: () => void;
  stopProgressBar: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setShowProgressBar(true);
  }, []);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    // ! Don't stop progress bar here - let it finish naturally
  }, []);

  const startProgressBar = useCallback(() => {
    setShowProgressBar(true);
  }, []);

  const stopProgressBar = useCallback(() => {
    setShowProgressBar(false);
  }, []);

  return (
    <NavigationLoadingContext.Provider
      value={{
        isNavigating,
        showProgressBar,
        startNavigation,
        stopNavigation,
        startProgressBar,
        stopProgressBar,
      }}
    >
      {children}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (context === undefined) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider');
  }
  return context;
}
