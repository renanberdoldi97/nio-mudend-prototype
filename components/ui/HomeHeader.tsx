import Image from 'next/image';
import { NioIcon } from '@/components/icons';

export function HomeHeader() {
  return (
    <div className="px-5 pb-6 pt-10">
      <div className="flex items-center justify-between">
        <Image src="/logo/Color=White.svg" alt="Nio" width={52} height={28} unoptimized priority />
        <div className="flex items-center gap-2">
          <NioIcon name="user-circle" size={22} className="brightness-0 invert" />
          <span className="text-sm font-medium text-white">Ana</span>
        </div>
      </div>
    </div>
  );
}
