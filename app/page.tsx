'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { NioIcon, type IconName } from '@/components/icons';
import { PageTransition } from '@/components/ui/PageTransition';

type Shortcut = { id: string; icon: IconName; label: string; href?: string };

const SHORTCUTS: Shortcut[] = [
  { id: 'pedir-chip', icon: 'shortcut-pedir-chip', label: 'Pedir chip' },
  { id: 'segunda-via', icon: 'shortcut-segunda-via', label: '2ª via de fatura' },
  { id: 'contas-pagas', icon: 'shortcut-contas-pagas', label: 'Contas pagas' },
  { id: 'mudar-endereco', icon: 'shortcut-mudar-endereco', label: 'Mudar endereço', href: '/produtos' },
  { id: 'meio-pagamento', icon: 'shortcut-meio-pagamento', label: 'Meio de pagamento' },
  { id: 'gerenciar-produtos', icon: 'shortcut-gerenciar-produtos', label: 'Gerenciar produtos' },
  { id: 'diagnosticar-rede', icon: 'shortcut-diagnosticar-rede', label: 'Diagnosticar rede' },
  { id: 'trocar-senha-wifi', icon: 'shortcut-trocar-senha-wifi', label: 'Trocar senha wifi' },
];

export default function HomePage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const reset = useMudendStore((state) => state.reset);

  return (
    <PageTransition variant="fade" className="flex h-full flex-col">
      <header className="px-5 pb-4 pt-8">
        <p className="text-sm text-text-secondary">Olá,</p>
        <h1 className="text-2xl font-semibold text-verde-escuro">Bem-vindo à Nio</h1>
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
        <div className="grid grid-cols-4 gap-3">
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.id}
              type="button"
              disabled={!shortcut.href}
              onClick={() => {
                if (!shortcut.href) return;
                trackEvent('element_click', pathname, `shortcut-${shortcut.id}`);
                router.push(shortcut.href);
              }}
              className={`flex flex-col items-center gap-2 rounded-2xl bg-card-content py-4 ${
                shortcut.href ? '' : 'opacity-40'
              }`}
            >
              <NioIcon name={shortcut.icon} size={28} />
              <span className="text-center text-[11px] leading-tight text-verde-escuro">
                {shortcut.label}
              </span>
            </button>
          ))}
        </div>
      </main>
      <button
        type="button"
        onClick={() => {
          trackEvent('element_click', pathname, 'home-reiniciar-sessao');
          reset();
        }}
        className="mx-5 mb-6 rounded-full border border-border py-2 text-xs text-text-secondary"
      >
        Reiniciar sessão de teste
      </button>
    </PageTransition>
  );
}
