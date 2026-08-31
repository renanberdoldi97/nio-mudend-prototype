'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen, trackEvent } from '@/lib/tracking';
import { useMudendStore } from '@/lib/store';
import { FlowHeader } from '@/components/ui/FlowHeader';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { Button } from '@/components/ui/Button';
import { SuccessDetails } from '@/components/mudend/SuccessScreen';

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
    <FlowScreen
      header={
        <FlowHeader title="Agendamento da mudança" rightAction="close" onClose={() => router.push('/')} />
      }
      cta={
        <Button trackingId="sucesso-concluir" onClick={() => router.push('/sessao-concluida')}>
          Concluir
        </Button>
      }
    >
      <SuccessDetails />
    </FlowScreen>
  );
}
