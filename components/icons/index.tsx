import Image from 'next/image';
import { cn } from '@/lib/utils';

// Mapa de nome amigável → arquivo em /public/icons/
const ICON_MAP: Record<string, string> = {
  'chip': '/icons/Chip1.svg',
  'chip-sim': '/icons/ChipSim.svg',
  'chip2': '/icons/Chip2.svg',
  'home': '/icons/Casa.svg',
  'truck': '/icons/Truck.svg',
  'wifi-on': '/icons/WifiOn.svg',
  'wifi-off': '/icons/WifiOff.svg',
  'whatsapp': '/icons/Whatsapp.svg',
  'call': '/icons/Chamada.svg',
  'barcode': '/icons/CodigoBarra.svg',
  'copy': '/icons/Copiar.svg',
  'edit': '/icons/Editar.svg',
  'send': '/icons/Enviar.svg',
  'location': '/icons/Localizacao.svg',
  'settings': '/icons/Engrenagem.svg',
  'warning': '/icons/Aviso.svg',
  'warning-circle': '/icons/AvisoCircular.svg',
  'warning-shield': '/icons/AvisoEscudo.svg',
  'info': '/icons/Info.svg',
  'check': '/icons/Check.svg',
  'check-circle': '/icons/CheckCircular.svg',
  'x': '/icons/X.svg',
  'x-circle': '/icons/XCircular.svg',
  'times-circle': '/icons/TimesCircle.svg',
  'arrow-left': '/icons/SetaEsquerda.svg',
  'arrow-right': '/icons/SetaDireita.svg',
  'arrow-up': '/icons/SetaCima.svg',
  'arrow-down': '/icons/SetaBaixo.svg',
  'chevron-down': '/icons/ChevronBaixo.svg',
  'menu': '/icons/Menu.svg',
  'more': '/icons/TresPontosMenu.svg',
  'three-dots': '/icons/DotsThreeOutlineFill.svg',
  'user': '/icons/Usuario.svg',
  'user-circle': '/icons/UsuarioCircular.svg',
  'card': '/icons/CartaoCredito.svg',
  'pix': '/icons/Pix.svg',
  'calendar': '/icons/Calendario.svg',
  'map': '/icons/Mapa.svg',
  'rota': '/icons/Rota.svg',
  'smartphone': '/icons/Smartphone.svg',
  'box': '/icons/EmbalagemCaixa.svg',
  'tag': '/icons/Tag.svg',
  'discount': '/icons/SeloPorcentagemDesconto.svg',
  'tool': '/icons/Ferramenta.svg',
  'password': '/icons/Senha.svg',
  'squares': '/icons/SquaresFour.svg',
  'sliders-v': '/icons/SlidersVertical.svg',
  'sliders-h': '/icons/SlidersHorizontal.svg',
  'swap': '/icons/Trocar.svg',
  'flip-v': '/icons/InverterVertical.svg',
  'flip-h': '/icons/InverterHorizontal.svg',
  'export': '/icons/Exportar.svg',
  'clip': '/icons/ClipePapel.svg',
  'checkbox-on': '/icons/Checkbox%20On.svg',
  'waze': '/icons/Waze.svg',
  'question': '/icons/Questao.svg',
  // Ícones de atalho da home — coloridos com detalhes verdes, não themeable
  'shortcut-pedir-chip': '/icons/icon1.svg',
  'shortcut-segunda-via': '/icons/icon2.svg',
  'shortcut-contas-pagas': '/icons/icon3.svg',
  'shortcut-mudar-endereco': '/icons/icon4.svg',
  'shortcut-meio-pagamento': '/icons/icon5.svg',
  'shortcut-gerenciar-produtos': '/icons/icon6.svg',
  'shortcut-diagnosticar-rede': '/icons/icon7.svg',
  'shortcut-trocar-senha-wifi': '/icons/icon8.svg',
};

type NioIconProps = {
  name: keyof typeof ICON_MAP;
  size?: number;
  className?: string;
  // color não funciona com <img> — use className com filter CSS se precisar de recolor
};

export function NioIcon({ name, size = 24, className }: NioIconProps) {
  const src = ICON_MAP[name];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn(className)}
      // Desabilita otimização de Next Image pra SVGs — não comprime
      unoptimized
    />
  );
}

export type IconName = keyof typeof ICON_MAP;
