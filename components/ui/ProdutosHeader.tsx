import { NioIcon } from '@/components/icons';

export function ProdutosHeader() {
  return (
    <div className="px-5 pb-6 pt-10">
      <h1 className="mb-4 text-2xl font-semibold text-white">Produtos</h1>
      <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Nio Fibra Super</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
            <NioIcon name="location" size={14} className="brightness-0 invert" />
            R. São Clemente, 000, ap. 000
          </p>
        </div>
        <NioIcon name="swap" size={20} className="brightness-0 invert" />
      </div>
    </div>
  );
}
