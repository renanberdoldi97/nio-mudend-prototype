'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { SuccessScreen } from '@/components/mudend/SuccessScreen';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';

export default function SucessoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const markSessionComplete = useMudendStore((state) => state.markSessionComplete);

  useEffect(() => {
    trackEvent('session_complete', pathname);
    markSessionComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTransition variant="fade" className="flex h-full flex-col px-5 pb-8 pt-8">
      <SuccessScreen
        title="Mudança agendada!"
        description="Você vai receber uma confirmação por e-mail e SMS com todos os detalhes da visita."
      />
      <div className="flex flex-col gap-3">
        <Button
          trackingId="sucesso-ver-resumo"
          variant="secondary"
          onClick={() => router.push('/mudend/resumo')}
        >
          Ver dados capturados
        </Button>
        <Button trackingId="sucesso-voltar-home" onClick={() => router.push('/')}>
          Voltar ao início
        </Button>
      </div>
    </PageTransition>
  );
}
