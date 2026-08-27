'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { ConsultaLoader } from '@/components/mudend/ConsultaLoader';
import { sleep } from '@/lib/utils';

export default function ConsultaPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const [phase, setPhase] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    let active = true;
    (async () => {
      await sleep(2200);
      if (!active) return;
      setPhase('success');
      await sleep(1600);
      if (!active) return;
      router.push('/mudend/instrucoes');
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full bg-white">
      <ConsultaLoader phase={phase} />
    </div>
  );
}
