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
