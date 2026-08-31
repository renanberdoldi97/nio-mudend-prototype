import type { EnderecoSugestao } from './types';

export const ENDERECO_ATUAL = {
  eyebrow: 'Bela Vista - São Paulo/SP',
  linha: 'R. Costa Barros, 2299 São Paulo, SP (03210-001)',
};

/**
 * Mock de sugestões de endereço (São Paulo/SP) usado pelo autocomplete da tela
 * de endereço. Mistura casos com e sem número — quando `numero` está ausente, a
 * tela pede o número num campo separado.
 */
export const ENDERECO_SUGESTOES: EnderecoSugestao[] = [
  {
    id: 'alberto-ramos-2399',
    logradouro: 'Rua Coronel Alberto Ramos',
    numero: '2399',
    bairro: 'Vila Gumercindo',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04143-020',
  },
  {
    id: 'alberto-ramos',
    logradouro: 'Rua Coronel Alberto Ramos',
    bairro: 'Vila Gumercindo',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04143-020',
  },
  {
    id: 'costa-barros-2299',
    logradouro: 'Rua Costa Barros',
    numero: '2299',
    bairro: 'Vila Alpina',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '03210-001',
  },
  {
    id: 'paulista',
    logradouro: 'Avenida Paulista',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01310-100',
  },
  {
    id: 'faria-lima-3477',
    logradouro: 'Avenida Brigadeiro Faria Lima',
    numero: '3477',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04538-133',
  },
  {
    id: 'augusta',
    logradouro: 'Rua Augusta',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01305-000',
  },
  {
    id: 'oscar-freire-725',
    logradouro: 'Rua Oscar Freire',
    numero: '725',
    bairro: 'Jardim Paulista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01426-001',
  },
  {
    id: 'ibirapuera',
    logradouro: 'Avenida Ibirapuera',
    bairro: 'Moema',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04029-200',
  },
  {
    id: 'consolacao-247',
    logradouro: 'Rua da Consolação',
    numero: '247',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01301-000',
  },
  {
    id: 'teodoro-sampaio',
    logradouro: 'Rua Teodoro Sampaio',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '05406-000',
  },
  {
    id: 'reboucas-3970',
    logradouro: 'Avenida Rebouças',
    numero: '3970',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '05402-600',
  },
];

/** "Rua X, 123" ou "Rua X" quando não há número. */
export function formatSugestaoLinha(s: EnderecoSugestao): string {
  return s.numero ? `${s.logradouro}, ${s.numero}` : s.logradouro;
}

/** "Bairro · Cidade/UF · CEP 00000-000" */
export function formatSugestaoDetalhe(s: EnderecoSugestao): string {
  return `${s.bairro} · ${s.cidade}/${s.uf} · CEP ${s.cep}`;
}

/** Filtra as sugestões pelo texto digitado (rua ou bairro), a partir de 3 caracteres. */
export function filtrarSugestoes(query: string): EnderecoSugestao[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  return ENDERECO_SUGESTOES.filter(
    (s) =>
      s.logradouro.toLowerCase().includes(q) ||
      s.bairro.toLowerCase().includes(q) ||
      formatSugestaoLinha(s).toLowerCase().includes(q)
  );
}

export const CONTATO_MOCK = {
  nome: 'Ana Silva',
  telefone: '(11) 9 1319-3836',
};

export const COMPLEMENTO_OPTIONS = [
  'Apartamento 13',
  'Apartamento 14',
  'Casa 1',
  'Casa 2',
];

export const COMPLEMENTO_OUTRO = 'Não encontrei meu complemento';

export function gerarProtocolo(): string {
  let protocolo = '';
  for (let i = 0; i < 13; i++) {
    protocolo += Math.floor(Math.random() * 10).toString();
  }
  return protocolo;
}
