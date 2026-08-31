'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { readParticipantSession } from '@/lib/participant-session';

const ONBOARDING_ROUTE = '/onboarding';

/**
 * Enquanto não existir `participantSession` no localStorage, qualquer rota
 * redireciona pro onboarding. O onboarding em si nunca é bloqueado.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === ONBOARDING_ROUTE) {
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

  if (pathname === ONBOARDING_ROUTE) return <>{children}</>;
  if (!ready) return <div className="h-full w-full bg-white" />;
  return <>{children}</>;
}
