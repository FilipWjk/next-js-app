'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

export default function TopProgress() {
  const pathname = usePathname();
  const { showProgressBar, stopNavigation, stopProgressBar } = useNavigationLoading();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const currentPathnameRef = useRef(pathname);

  // * Clear all timeouts when component unmounts
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (showProgressBar && !visible) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      setVisible(true);
      setProgress(10);

      // ? Animate progress bar
      const t1 = setTimeout(() => setProgress(30), 100);
      const t2 = setTimeout(() => setProgress(50), 200);
      const t3 = setTimeout(() => setProgress(70), 350);
      const t4 = setTimeout(() => setProgress(90), 500);

      timeoutsRef.current = [t1, t2, t3, t4];
    }
  }, [showProgressBar, visible]);

  // * Handle route completion
  useEffect(() => {
    if (currentPathnameRef.current !== pathname && visible) {
      // * Route has changed, complete the progress
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      setProgress(100);
      const t5 = setTimeout(() => {
        setVisible(false);
        stopNavigation();
        stopProgressBar();
        setTimeout(() => setProgress(0), 200);
      }, 200);

      timeoutsRef.current = [t5];
    }
    currentPathnameRef.current = pathname;
  }, [pathname, visible, stopNavigation, stopProgressBar]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[110]">
      <div
        className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
