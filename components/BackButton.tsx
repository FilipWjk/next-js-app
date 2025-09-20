'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

interface BackButtonProps {
  href: string;
  children: React.ReactNode;
}

export function BackButton({ href, children }: BackButtonProps) {
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();

  const handleBack = () => {
    startNavigation();
    router.push(href);
  };

  return (
    <Button variant="outline" onClick={handleBack} className="cursor-pointer">
      {children}
    </Button>
  );
}
