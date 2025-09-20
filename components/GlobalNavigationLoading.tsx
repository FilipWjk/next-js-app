'use client';

import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

export function GlobalNavigationLoading() {
  const { isNavigating } = useNavigationLoading();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-gray-800/95 border border-gray-700 rounded-lg p-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white">
            <div className="font-medium">Loading...</div>
            <div className="text-sm text-gray-400">Please wait while we navigate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
