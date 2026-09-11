import { redirect } from 'next/navigation';
import { Building2, MapPin, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import { obtenerSesionAdmin } from '@/lib/supabase/autorizacion';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import GestionAdministradores from '@/componentes/GestionAdministradores';

const TIPO: Record<string, string> = { tiendita: 'Tiendita', cafe: 'Café / fonda', emprendedor: 'Reventa' };

export default async function PaginaAdminClientes() {
  const sesion = await obtenerSesionAdmin();
  if (!sesion.user) redirect('/iniciar-sesion');
  if (!sesion.esAdmin) redirect('/dashboard');

  const admin = crearClienteAdmin();
  const [{ data: clientes }, { data: pedidos }, { data: direcciones }, { data: administradores }, usuarios] = await Promise.all([
    admin.from('clientes').select('id,auth_user_id,nombre_negocio,tipo_negocio,telefono,nivel_precio,creado_en').order('creado_en', { ascending: false }),
    admin.from('pedidos').select('id,cliente_id,total,estado,creado_en').order('creado_en', { ascending: false }),
    admin.from('direcciones').select('id,cliente_id'),
    admin.from('administradores').select('auth_user_id,nota,creado_en'),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const correos = new Map((usuarios.data?.users ?? []).map((u) => [u.id, u.email ?? 'Correo no disponible']));
  const idsAdmin = new Set((administradores ?? []).map((a) => a.auth_user_id));

  return <>
    <header className="aparecer">
      <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] !font-black uppercase leading-[0.86]">Clientes</h1>
      <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#6B5546]">Consulta negocios registrados, sus pedidos, direcciones y acceso. Los datos sensibles permanecen visibles sólo para administradores.</p>
    </header>

    <section className="mt-7">
      <div className="mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-[#7621B0]" /><h2 className="text-2xl !font-black uppercase">Permisos administrativos</h2></div>
      <GestionAdministradores />
      <p className="mt-3 text-xs font-semibold leading-5 text-[#6B5546]">Por seguridad, sólo puedes promover cuentas que ya se registraron. Quitar permisos se hace manualmente desde Supabase.</p>
    </section>

    <section className="mt-8 grid gap-4">
      {(!clientes || clientes.length === 0) ? <p className="rounded-lg border border-dashed border-[#EBD9C3] bg-white/70 p-8 text-center font-bold text-[#6B5546]">Todavía no hay clientes registrados.</p> : clientes.map((cliente) => {
        const compras = (pedidos ?? []).filter((p) => p.cliente_id === cliente.id);
        const validas = compras.filter((p) => p.estado !== 'cancelado');
        const total = validas.reduce((suma, p) => suma + Number(p.total), 0);
        const cantidadDirecciones = (direcciones ?? []).filter((d) => d.cliente_id === cliente.id).length;
        return <article key={cliente.id} className="rounded-lg border border-[#EBD9C3] bg-white/82 p-5 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><Building2 size={17} className="text-[#FF5A5F]" /><h2 className="text-2xl !font-black uppercase leading-none">{cliente.nombre_negocio}</h2>{cliente.auth_user_id && idsAdmin.has(cliente.auth_user_id) && <span className="rounded-full bg-[#7621B0]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#7621B0]">Administrador</span>}</div>
              <p className="mt-2 text-sm font-semibold text-[#6B5546]">{TIPO[cliente.tipo_negocio] ?? cliente.tipo_negocio} · {cliente.nivel_precio ?? 'Mayoreo'}</p>
              <p className="mt-1 break-all text-xs font-semibold text-[#6B5546]">{cliente.auth_user_id ? correos.get(cliente.auth_user_id) : 'Compra como invitado, sin cuenta vinculada'}{cliente.telefono ? ` · ${cliente.telefono}` : ''}</p>
            </div>
            <div className="grid grid-cols-3 gap-5 text-center">
              <div><ShoppingBag size={15} className="mx-auto text-[#FF5A5F]" /><strong className="mt-1 block text-xl !font-black">{compras.length}</strong><span className="text-[9px] font-black uppercase text-[#6B5546]">Pedidos</span></div>
              <div><MapPin size={15} className="mx-auto text-[#00A699]" /><strong className="mt-1 block text-xl !font-black">{cantidadDirecciones}</strong><span className="text-[9px] font-black uppercase text-[#6B5546]">Direcciones</span></div>
              <div><UserRound size={15} className="mx-auto text-[#7621B0]" /><strong className="mt-1 block text-xl !font-black">${total.toFixed(0)}</strong><span className="text-[9px] font-black uppercase text-[#6B5546]">Comprado</span></div>
            </div>
          </div>
        </article>;
      })}
    </section>
  </>;
}
