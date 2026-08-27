'use client';

import { useEffect } from 'react';
import { registerSessionAbandonListener } from '@/lib/tracking';

export function SessionInit() {
  useEffect(() => {
    registerSessionAbandonListener();
  }, []);

  return null;
}
