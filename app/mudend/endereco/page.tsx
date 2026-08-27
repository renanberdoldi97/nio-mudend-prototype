'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTrackScreen } from '@/lib/tracking';
import { JourneyLayout } from '@/components/ui/JourneyLayout';
import { AddressForm } from '@/components/mudend/AddressForm';
import { Button } from '@/components/ui/Button';
import { useMudendStore } from '@/lib/store';

export default function EnderecoPage() {
  const pathname = usePathname();
  useTrackScreen(pathname);
  const router = useRouter();
  const endereco = useMudendStore((state) => state.endereco);

  const isValid =
    endereco.cep.length >= 9 &&
    Boolean(endereco.rua) &&
    Boolean(endereco.numero) &&
    Boolean(endereco.bairro) &&
    Boolean(endereco.cidade) &&
    endereco.estado.length === 2;

  return (
    <JourneyLayout
      title="Novo endereço"
      cta={
        <Button
          trackingId="endereco-continuar"
          disabled={!isValid}
          onClick={() => router.push('/mudend/consulta')}
        >
          Continuar
        </Button>
      }
    >
      <p className="mb-4 text-sm text-text-secondary">
        Informe o endereço para onde sua internet Nio vai se mudar.
      </p>
      <AddressForm />
    </JourneyLayout>
  );
}
