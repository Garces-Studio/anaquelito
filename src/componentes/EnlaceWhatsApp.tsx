'use client';

import type { ReactNode } from 'react';
import { registrarEvento } from '@/lib/analitica';

export default function EnlaceWhatsApp({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}
    onClick={() => registrarEvento('whatsapp_click', { ubicacion: 'sitio' })}>{children}</a>;
}
