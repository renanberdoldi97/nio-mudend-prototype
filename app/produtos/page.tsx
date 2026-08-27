'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { AppShell } from '@/components/ui/AppShell';
import { ProdutosHeader } from '@/components/ui/ProdutosHeader';
import { NioIcon, type IconName } from '@/components/icons';

const INCLUSO: { icon: IconName; title: string; subtitle: string; tag?: string }[] = [
  { icon: 'wifi-on', title: 'Internet fibra', subtitle: '700 Mega' },
  { icon: 'smartphone', title: 'Internet móvel 5G', subtitle: '2 chips de 20GB', tag: '1 chip ativo' },
  { icon: 'discount', title: 'Assinaturas e benefícios', subtitle: 'Globoplay, Telecine, Premiere +4' },
];

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="#5C6B5E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProdutosPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  return (
    <AppShell header={<ProdutosHeader />}>
      <div className="px-5 pt-5">
        <h2 className="mb-1 text-lg font-semibold text-verde-escuro">Incluso no seu plano</h2>
        <p className="mb-4 text-sm text-text-secondary">
          Consulte e acesse as opções disponíveis para os seus serviços
        </p>
        <div className="mb-8 flex flex-col gap-3">
          {INCLUSO.map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-verde-claro p-4">
              <NioIcon name={item.icon} size={20} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary-background">{item.title}</span>
                  {item.tag && (
                    <span className="rounded-full bg-verde-escuro px-2 py-0.5 text-[10px] font-semibold text-white">
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Gerencie o seu plano</h2>
        <div className="mb-8 divide-y divide-border rounded-2xl border border-border bg-white">
          <div className="flex items-center gap-3 p-4">
            <NioIcon name="swap" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-verde-escuro">Trocar de plano</p>
              <p className="text-xs text-text-secondary">Explore as opções disponíveis</p>
            </div>
            <ChevronRight />
          </div>
          <div className="flex items-center gap-3 p-4">
            <NioIcon name="card" size={20} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-verde-escuro">Adicionar serviços</p>
                <span className="rounded-full bg-verde-escuro px-2 py-0.5 text-[10px] font-semibold text-white">
                  NOVO
                </span>
              </div>
              <p className="text-xs text-text-secondary">Inclua streamings e mais</p>
            </div>
            <ChevronRight />
          </div>
          <button
            type="button"
            onClick={() => {
              trackEvent('element_click', pathname, 'produtos-mudar-endereco');
              router.push('/mudend/endereco');
            }}
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <NioIcon name="location" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-verde-escuro">Mudar de endereço</p>
              <p className="text-xs text-text-secondary">Leve sua fibra pra outro endereço</p>
            </div>
            <ChevronRight />
          </button>
        </div>

        <div className="mb-8 flex h-24 items-center justify-center rounded-2xl bg-verde-escuro px-6 text-center">
          <p className="text-sm font-medium text-white">
            Sugestão de espaço de banner para comunicação (pós-EV1)
          </p>
        </div>

        <h2 className="mb-3 text-lg font-semibold text-verde-escuro">Informações contratuais</h2>
        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-white p-4">
            <NioIcon name="info" size={20} />
            <p className="mt-3 text-sm text-verde-escuro">Sobre a sua oferta</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <NioIcon name="clip" size={20} />
            <p className="mt-3 text-sm text-verde-escuro">Consulte o seu contrato</p>
          </div>
        </div>

        <p className="mb-8 text-center text-sm font-medium text-text-secondary">Cancelar plano</p>
      </div>
    </AppShell>
  );
}
