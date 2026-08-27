'use client';

import { useMudendStore } from '@/lib/store';
import { Input } from '@/components/ui/Input';
import { formatCep } from '@/lib/utils';

export function AddressForm() {
  const endereco = useMudendStore((state) => state.endereco);
  const complemento = useMudendStore((state) => state.complemento);
  const updateEndereco = useMudendStore((state) => state.updateEndereco);
  const updateComplemento = useMudendStore((state) => state.updateComplemento);

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="CEP"
        value={endereco.cep}
        onChange={(value) => updateEndereco({ cep: formatCep(value) })}
        trackingId="endereco-cep"
        inputMode="numeric"
        placeholder="00000-000"
      />
      <Input
        label="Rua"
        value={endereco.rua}
        onChange={(value) => updateEndereco({ rua: value })}
        trackingId="endereco-rua"
        placeholder="Nome da rua"
      />
      <div className="flex gap-3">
        <Input
          label="Número"
          value={endereco.numero}
          onChange={(value) => updateEndereco({ numero: value })}
          trackingId="endereco-numero"
          inputMode="numeric"
          className="w-28"
        />
        <Input
          label="Complemento"
          value={complemento}
          onChange={updateComplemento}
          trackingId="endereco-complemento"
          placeholder="Apto, bloco..."
          className="flex-1"
        />
      </div>
      <Input
        label="Bairro"
        value={endereco.bairro}
        onChange={(value) => updateEndereco({ bairro: value })}
        trackingId="endereco-bairro"
      />
      <div className="flex gap-3">
        <Input
          label="Cidade"
          value={endereco.cidade}
          onChange={(value) => updateEndereco({ cidade: value })}
          trackingId="endereco-cidade"
          className="flex-1"
        />
        <Input
          label="UF"
          value={endereco.estado}
          onChange={(value) => updateEndereco({ estado: value.toUpperCase().slice(0, 2) })}
          trackingId="endereco-uf"
          className="w-20"
        />
      </div>
    </div>
  );
}
