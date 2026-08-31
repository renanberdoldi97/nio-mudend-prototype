function HomeOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 11L12 4L20 11" stroke="#192B1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 9.5V19H18V9.5" stroke="#192B1C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="8" r="3.4" stroke="#192B1C" strokeWidth="1.6" />
      <path
        d="M5 20C5 16.1 8.1 14 12 14C15.9 14 19 16.1 19 20"
        stroke="#192B1C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RouterOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M9 7V4.5" stroke="#192B1C" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 7V4.5" stroke="#192B1C" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="7" width="16" height="9.5" rx="2" stroke="#192B1C" strokeWidth="1.6" />
      <circle cx="8.2" cy="11.75" r="1" fill="#192B1C" />
      <circle cx="12" cy="11.75" r="1" fill="#192B1C" />
    </svg>
  );
}

const ITEMS: { icon: () => React.ReactNode; label: string }[] = [
  { icon: HomeOutlineIcon, label: 'Endereço da visita acessível' },
  { icon: PersonOutlineIcon, label: 'Pessoa maior de 18 anos no local' },
  { icon: RouterOutlineIcon, label: 'Leve seu roteador atual para o novo endereço' },
];

export function InstructionsList() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-info-bg">
            <item.icon />
          </span>
          <p className="text-sm text-text-primary">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
