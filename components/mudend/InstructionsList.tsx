import { NioIcon, type IconName } from '@/components/icons';

const ITEMS: { icon: IconName; label: string }[] = [
  { icon: 'home', label: 'Endereço da visita acessível' },
  { icon: 'user', label: 'Pessoa maior de 18 anos no local' },
  { icon: 'router', label: 'Leve seu roteador atual para o novo endereço' },
];

export function InstructionsList() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E9E5D3] bg-white p-4">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-verde-claro">
            <NioIcon name={item.icon} size={18} />
          </span>
          <p className="text-sm text-verde-escuro">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
