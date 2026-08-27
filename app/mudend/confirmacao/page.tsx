'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { JourneyLayout } from '@/components/ui/JourneyLayout';
import { ConfirmationSummary } from '@/components/mudend/ConfirmationSummary';
import { ContactForm } from '@/components/mudend/ContactForm';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { useMudendStore } from '@/lib/store';

export default function ConfirmacaoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const contato = useMudendStore((state) => state.contato);
  const [confirmado, setConfirmado] = useState(false);

  const isValid = confirmado && Boolean(contato.nome) && Boolean(contato.telefone) && Boolean(contato.email);

  return (
    <JourneyLayout
      title="Confirme os dados"
      cta={
        <Button
          trackingId="confirmacao-finalizar"
          disabled={!isValid}
          onClick={() => router.push('/mudend/sucesso')}
        >
          Confirmar mudança
        </Button>
      }
    >
      <p className="mb-3 text-sm text-text-secondary">Dados de contato para a visita</p>
      <ContactForm />

      <p className="mb-3 mt-6 text-sm text-text-secondary">Resumo da solicitação</p>
      <ConfirmationSummary />

      <Checkbox
        className="mt-4"
        checked={confirmado}
        onChange={setConfirmado}
        trackingId="confirmacao-checkbox"
        label="Confirmo que os dados acima estão corretos."
      />
    </JourneyLayout>
  );
}
