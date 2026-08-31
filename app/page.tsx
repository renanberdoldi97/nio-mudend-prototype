'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { AppShell } from '@/components/ui/AppShell';
import { HomeHeader } from '@/components/ui/HomeHeader';
import { NioIcon, type IconName } from '@/components/icons';

const ACESSO_RAPIDO: { icon: IconName; label: string }[] = [
  { icon: 'tool', label: 'Fazer reparo da internet' },
  { icon: 'password', label: 'Trocar senha do Wi-Fi' },
  { icon: 'send', label: 'Atualizar dados de contato' },
  { icon: 'edit', label: 'Renomear rede Wi-Fi' },
];

function OffersCarousel({ items }: { items: string[] }) {
  return (
    <div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {items.map((label) => (
          <div
            key={label}
            className="flex h-28 w-64 shrink-0 items-center justify-center rounded-lg bg-verde-escuro"
          >
            <span className="text-sm font-medium text-white">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-verde-neon" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  return (
    <AppShell header={<HomeHeader />}>
      <div className="px-5 pt-5">
        <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Faturas em aberto</h2>
        <div className="mb-8 flex items-start gap-3 rounded-lg bg-areia p-4">
          <Image
            src="/images/joia.png"
            alt=""
            width={64}
            height={64}
            unoptimized
            className="h-16 w-16 shrink-0 object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-verde-escuro">Suas faturas estão em dia!</p>
            <p className="mt-1 text-sm text-text-secondary">
              A próxima fatura estará disponível 5 dias antes da data de vencimento.
            </p>
          </div>
        </div>

        <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Acesso rápido</h2>
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-verde-claro p-4">
          <Image
            src="/images/celular.png"
            alt=""
            width={48}
            height={48}
            unoptimized
            className="h-12 w-12 shrink-0 object-contain"
          />
          <span className="flex-1 text-sm font-semibold text-primary-background">Internet móvel 5G</span>
          <span className="rounded-full bg-verde-escuro px-2.5 py-1 text-[10px] font-semibold text-white">
            NOVO
          </span>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3">
          {ACESSO_RAPIDO.map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-white p-4">
              <NioIcon name={item.icon} size={20} />
              <p className="mt-3 text-sm font-semibold text-verde-escuro">{item.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Ofertas Nio Fibra</h2>
        <div className="mb-8">
          <OffersCarousel items={['Banner up']} />
        </div>

        <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Ofertas parceiras</h2>
        <div className="mb-10">
          <OffersCarousel items={['Banner oferta 1']} />
        </div>

        <button
          type="button"
          onClick={() => {
            trackEvent('element_click', pathname, 'home-debug-resumo');
            router.push('/mudend/resumo');
          }}
          className="mx-auto block text-xs text-text-secondary underline"
        >
          Ver dados capturados (debug)
        </button>
      </div>
    </AppShell>
  );
}
