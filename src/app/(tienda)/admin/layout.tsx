import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, PackageSearch, ShieldCheck, Truck } from 'lucide-react';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';

/**
 * Zona de administración: solo entra quien tenga fila en `administradores`
 * (ver migración 0005). Un cliente normal es regresado a su dashboard.
 */
export default async function DisenoAdmin({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, esAdmin } = await obtenerSesionAdmin();
  if (!user) redirect('/iniciar-sesion');
  if (!esAdmin) redirect('/dashboard');

  const enlaces = [
    { href: '/admin', texto: 'Resumen', Icono: LayoutDashboard },
    { href: '/admin/pedidos', texto: 'Pedidos', Icono: Truck },
    { href: '/admin/productos', texto: 'Productos', Icono: PackageSearch },
  ];

  return (
    <main className="pagina-colorida min-h-screen px-4 pb-20 pt-28 text-[#2B1B12] md:px-8 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#7621B0]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#7621B0]">
            <ShieldCheck size={14} /> Modo administrador
          </span>

          <nav className="flex flex-wrap gap-2" aria-label="Secciones de administración">
            {enlaces.map(({ href, texto, Icono }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#2B1B12] shadow-sm backdrop-blur transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
              >
                <Icono size={14} /> {texto}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </main>
  );
}
