'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';
import { mergeClasses } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'All Tasks', href: '/tasks' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();

  const handleNavigation = (href: string) => {
    // ! Only start loading if we're navigating to a different page
    if (pathname !== href) {
      startNavigation();
      router.push(href);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-700">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">Task Manager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={mergeClasses(
                'w-full text-left group cursor-pointer flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              )}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-200">Task Dashboard</p>
            <p className="text-xs text-gray-400">Next.js Project</p>
          </div>
        </div>
      </div>
    </div>
  );
}
