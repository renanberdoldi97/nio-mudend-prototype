import Image from 'next/image';

export function HouseIllustration() {
  return (
    <Image
      src="/images/casa-mudanca.png"
      alt=""
      width={375}
      height={134}
      unoptimized
      priority
      className="mx-auto h-28 w-auto"
    />
  );
}
