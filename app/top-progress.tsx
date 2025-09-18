'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(60), 150);
    const t2 = setTimeout(() => setProgress(85), 400);
    const t3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setVisible(false), 150);
      setTimeout(() => setProgress(0), 350);
    }, 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[90]">
      <div className="h-1 bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
    </div>
  );
}
