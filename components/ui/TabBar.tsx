'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import { NioIcon, type IconName } from '@/components/icons';

type TabItem = {
  key: string;
  label: string;
  route: string;
  icon: IconName;
  enabled: boolean;
};

const ITEMS: TabItem[] = [
  { key: 'inicio', label: 'Início', route: '/', icon: 'home', enabled: true },
  { key: 'contas', label: 'Contas', route: '/contas', icon: 'card', enabled: false },
  { key: 'produtos', label: 'Produtos', route: '/produtos', icon: 'squares', enabled: true },
  { key: 'suporte', label: 'Suporte', route: '/suporte', icon: 'tool', enabled: false },
  { key: 'mais', label: 'Mais', route: '/mais', icon: 'more', enabled: false },
];

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around bg-verde-escuro">
      {ITEMS.map((item) => {
        const active = pathname === item.route;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              trackEvent('element_click', pathname, `tabbar-${item.key}`);
              if (item.enabled) router.push(item.route);
            }}
            className="flex h-full flex-1 flex-col items-center justify-center gap-1"
          >
            <span className={cn('flex h-6 w-6 items-center justify-center', active ? 'opacity-100' : 'opacity-40')}>
              <NioIcon name={item.icon} size={22} className="brightness-0 invert" />
            </span>
            <span className={cn('text-[10px] font-medium', active ? 'text-verde-neon' : 'text-white/60')}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
