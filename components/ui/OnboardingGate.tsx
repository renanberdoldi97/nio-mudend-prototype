'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { readParticipantSession } from '@/lib/participant-session';

const ONBOARDING_ROUTE = '/onboarding';

/** Rotas que nunca são bloqueadas pelo guard (onboarding + telas de debug). */
function isExemptRoute(pathname: string): boolean {
  return (
    pathname === ONBOARDING_ROUTE ||
    pathname === '/debug' ||
    pathname.startsWith('/mudend/resumo')
  );
}

/**
 * Enquanto não existir `participantSession` no localStorage, qualquer rota
 * redireciona pro onboarding. Onboarding e as telas de debug nunca são bloqueados.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isExemptRoute(pathname)) {
      setReady(true);
      return;
    }
    if (readParticipantSession() === null) {
      setReady(false);
      router.replace(ONBOARDING_ROUTE);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (isExemptRoute(pathname)) return <>{children}</>;
  if (!ready) return <div className="h-full w-full bg-white" />;
  return <>{children}</>;
}
