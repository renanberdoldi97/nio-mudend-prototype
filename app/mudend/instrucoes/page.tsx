'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { JourneyLayout } from '@/components/ui/JourneyLayout';
import { InstructionsList } from '@/components/mudend/InstructionsList';
import { Button } from '@/components/ui/Button';

export default function InstrucoesPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();

  return (
    <JourneyLayout
      title="Antes de continuar"
      cta={
        <Button trackingId="instrucoes-continuar" onClick={() => router.push('/mudend/agendamento')}>
          Entendi, continuar
        </Button>
      }
    >
      <p className="mb-4 text-sm text-text-secondary">
        Confira o que você precisa saber antes de agendar a mudança.
      </p>
      <InstructionsList />
    </JourneyLayout>
  );
}
