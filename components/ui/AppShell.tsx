'use client';

import { TabBar } from './TabBar';

type AppShellProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="shrink-0 bg-verde-escuro">{header}</div>
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">{children}</main>
      <TabBar />
    </div>
  );
}
