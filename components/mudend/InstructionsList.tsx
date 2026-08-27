import { NioIcon, type IconName } from '@/components/icons';
import { Card } from '@/components/ui/Card';

type InstructionItem = {
  icon: IconName;
  title: string;
  description: string;
};

const DEFAULT_ITEMS: InstructionItem[] = [
  {
    icon: 'box',
    title: 'Leve o roteador com você',
    description: 'Desconecte e embale o equipamento Nio para levar ao novo endereço.',
  },
  {
    icon: 'calendar',
    title: 'Agende a visita técnica',
    description: 'Um técnico vai até o novo endereço para religar sua internet.',
  },
  {
    icon: 'clip',
    title: 'Tenha um documento em mãos',
    description: 'Pode ser solicitado na hora da instalação para confirmar seus dados.',
  },
];

export function InstructionsList({ items = DEFAULT_ITEMS }: { items?: InstructionItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Card key={item.title} variant="neutral" padding="md" className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-claro">
            <NioIcon name={item.icon} size={20} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-verde-escuro">{item.title}</h3>
            <p className="mt-0.5 text-sm text-text-secondary">{item.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
