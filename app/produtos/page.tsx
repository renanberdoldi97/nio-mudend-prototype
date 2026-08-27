'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { JourneyLayout } from '@/components/ui/JourneyLayout';
import { Card } from '@/components/ui/Card';
import { NioIcon } from '@/components/icons';

export default function ProdutosPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  return (
    <JourneyLayout title="Meus produtos" onBack={() => router.push('/')}>
      <Card variant="white" padding="md" className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-verde-claro">
          <NioIcon name="wifi-on" size={24} />
        </span>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-verde-escuro">Nio Fibra 700 Mega</h2>
          <p className="text-xs text-text-secondary">Ativo — R. dos Pinheiros, 1200</p>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          trackEvent('element_click', pathname, 'produtos-mudar-endereco');
          router.push('/mudend/endereco');
        }}
        className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left"
      >
        <NioIcon name="location" size={22} />
        <span className="flex-1 text-sm font-medium text-verde-escuro">Mudar de endereço</span>
        <NioIcon name="arrow-right" size={18} />
      </button>
    </JourneyLayout>
  );
}
