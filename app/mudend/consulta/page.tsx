'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { JourneyLayout } from '@/components/ui/JourneyLayout';
import { ConsultaLoader } from '@/components/mudend/ConsultaLoader';
import { Button } from '@/components/ui/Button';
import { useMudendStore } from '@/lib/store';
import { sleep } from '@/lib/utils';

export default function ConsultaPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const endereco = useMudendStore((state) => state.endereco);
  const [phase, setPhase] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    let active = true;
    sleep(2200).then(() => {
      if (active) setPhase('success');
    });
    return () => {
      active = false;
    };
  }, []);

  const enderecoLabel = `${endereco.rua}, ${endereco.numero}`;

  return (
    <JourneyLayout
      title="Consulta de viabilidade"
      cta={
        phase === 'success' ? (
          <Button trackingId="consulta-continuar" onClick={() => router.push('/mudend/instrucoes')}>
            Continuar
          </Button>
        ) : undefined
      }
    >
      <ConsultaLoader phase={phase} endereco={enderecoLabel} />
    </JourneyLayout>
  );
}
