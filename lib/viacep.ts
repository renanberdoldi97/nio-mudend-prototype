export type ViaCepResult = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  erro?: boolean;
};

export function isCepLike(value: string): boolean {
  return /^\d{5}-?\d{3}$/.test(value.trim());
}

/**
 * Detecta se o texto do endereço já contém um número junto (ex: "Rua X, 123",
 * "Rua X nº 123", "Avenida X n 123"). Usado pra decidir se mostra o campo
 * "Número" separado ou pula direto pro Complemento.
 */
export function hasNumero(text: string): boolean {
  const comaSeguidaDeDigitos = /,\s*\d+/;
  const ordinalSeguidoDeDigitos = /n[ºo]\s*\d+/i;
  const nIsoladoSeguidoDeDigitos = /\bn\s+\d+/i;
  return (
    comaSeguidaDeDigitos.test(text) ||
    ordinalSeguidoDeDigitos.test(text) ||
    nIsoladoSeguidoDeDigitos.test(text)
  );
}

export async function fetchViaCep(cep: string): Promise<ViaCepResult | null> {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok) return null;
    const data = (await response.json()) as ViaCepResult;
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}
