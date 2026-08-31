export const ENDERECO_ATUAL = {
  eyebrow: 'Bela Vista - São Paulo/SP',
  linha: 'R. Costa Barros, 2299 São Paulo, SP (03210-001)',
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
