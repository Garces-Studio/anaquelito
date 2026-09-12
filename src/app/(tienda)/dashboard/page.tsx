import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  MapPin,
  ReceiptText,
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { crearCliente } from '@/lib/supabase/server';
import BotonCerrarSesion from '@/componentes/BotonCerrarSesion';
import PestanasPanel from '@/componentes/PestanasPanel';
import BotonRepetirPedido from '@/componentes/BotonRepetirPedido';
import AccionesDireccion from '@/componentes/AccionesDireccion';
import { FormularioAcceso, FormularioDireccion, FormularioPerfil } from '@/componentes/GestionCuenta';
import { desgloseCajas } from '@/lib/mayoreo';

const ESTADO_ETIQUETA: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default async function PaginaDashboard() {
  const supabase = await crearCliente();
  const correoSoporte = process.env.NEXT_PUBLIC_CORREO_NEGOCIO?.trim();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/iniciar-sesion');

  const { data: cliente } = await supabase
    .from('clientes')
    .select('id, nombre_contacto, nombre_negocio, tipo_negocio, telefono, nivel_precio')
    .eq('auth_user_id', user.id)
    .single();

  if (!cliente) {
    return (
      <main className="pagina-colorida px-4 pb-20 pt-32 md:px-8">
        <section className="mx-auto max-w-3xl rounded-lg border border-[#EBD9C3] bg-white/82 p-8 text-center shadow-[0_24px_70px_rgba(43,27,18,0.08)] backdrop-blur-xl">
          <span className="insignia-colorida">Cuenta incompleta</span>
          <h1 className="mt-2 text-[clamp(2.8rem,8vw,5.5rem)] !font-black uppercase leading-[0.86] tracking-normal text-[#2B1B12]">
            Falta completar tu registro
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-6 text-[#6B5546]">
            Tu cuenta existe, pero no encontramos los datos de tu negocio. {correoSoporte ? <>Escríbenos a <a className="font-black underline" href={`mailto:${correoSoporte}`}>{correoSoporte}</a> para ayudarte a dejarlo listo.</> : 'Cierra la sesión e intenta completar nuevamente tu registro; el canal de soporte se publicará próximamente.'}
          </p>
          <div className="mt-7">
            <BotonCerrarSesion />
          </div>
        </section>
      </main>
    );
  }

  const [{ data: pedidos }, { data: direcciones }] = await Promise.all([
    supabase
      .from('pedidos')
      .select('id, estado, pago_estado, total, creado_en, empresa_envio, guia_envio, url_rastreo, pedido_items(cantidad, precio_unitario, nombre_producto, productos(id,nombre,unidad,precio_mayoreo,imagen_url,piezas_por_caja,bolsas_por_caja,activo,disponibilidad))')
      .eq('cliente_id', cliente.id)
      .order('creado_en', { ascending: false }),
    supabase
      .from('direcciones')
      .select('id, etiqueta, calle_numero, colonia, municipio, estado, codigo_postal, predeterminada')
      .eq('cliente_id', cliente.id)
      .order('predeterminada', { ascending: false }),
  ]);
  const { data: administrador } = await supabase.from('administradores').select('auth_user_id').eq('auth_user_id', user.id).maybeSingle();
  const esAdmin = Boolean(administrador);

  const totalGastado = (pedidos ?? []).filter(pedido => pedido.pago_estado === 'aprobado').reduce((suma, pedido) => suma + Number(pedido.total), 0);
  const ultimoPedido = pedidos?.[0];
  const direccionPrincipal = direcciones?.find((direccion) => direccion.predeterminada) ?? direcciones?.[0];

  return (
    <main className="dashboard-anaquelito pagina-colorida px-4 pb-20 pt-32 text-[#2B1B12] md:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="dashboard-portada grid gap-6 overflow-hidden rounded-[32px] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:p-10">
          <div className="aparecer">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FFD06A] backdrop-blur">
              <Store size={14} /> Tu espacio Anaquelito
            </span>
            <h1 className="mt-5 max-w-4xl text-[clamp(3rem,8vw,7.25rem)] !font-black leading-[0.84] tracking-normal text-white">
              {cliente.nombre_contacto ? <>Hola, {cliente.nombre_contacto}</> : 'Hola, qué gusto verte'}
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white/70 md:text-base">
              Revisa pedidos, direcciones y promociones desde un panel simple, limpio y listo para que vuelvas a surtir rápido.
            </p>
          </div>

          <div className="aparecer retraso-1 rounded-[24px] border border-white/20 bg-white/10 p-5 text-white shadow-[0_24px_70px_rgba(20,8,28,0.22)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Cuenta de {cliente.nombre_negocio}</p>
                <p className="mt-1 text-3xl !font-black uppercase leading-none text-white">{cliente.nivel_precio ?? 'Mayoreo'}</p>
              </div>
              <BotonCerrarSesion />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/catalogo"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(255,90,95,.28)] transition hover:-translate-y-0.5 hover:bg-[#FF7478]"
                style={{ color: '#FFFFFF' }}
              >
                Surtir ahora <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={ultimoPedido ? '#pedidos' : '/catalogo'}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
              >
                <ShoppingBag size={15} /> {ultimoPedido ? 'Ver pedidos' : 'Primer pedido'}
              </Link>
            </div>
            {esAdmin && <Link href="/admin" className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#7621B0] px-5 text-[11px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#2B1B12]" style={{ color: '#FFFFFF' }}>
              <ShieldCheck size={15} /> Abrir panel de administrador
            </Link>}
          </div>
        </header>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icono: ShoppingBag, dato: pedidos?.length ?? 0, texto: 'Pedidos realizados', color: '#FF5A5F' },
            { icono: ReceiptText, dato: `$${totalGastado.toFixed(0)}`, texto: 'Total comprado', color: '#FF8A3D' },
            { icono: MapPin, dato: direcciones?.length ?? 0, texto: 'Direcciones guardadas', color: '#00A699' },
          ].map((item, index) => {
            const Icono = item.icono;
            return (
              <article
                key={item.texto}
                className="aparecer rounded-lg border border-[#EBD9C3] bg-white/78 p-5 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(43,27,18,0.1)]"
                style={{ animationDelay: `${0.12 + index * 0.06}s` }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_14px_30px_rgba(43,27,18,0.12)]" style={{ backgroundColor: item.color }}>
                  <Icono size={18} />
                </span>
                <strong className="mt-5 block text-5xl !font-black leading-none">{item.dato}</strong>
                <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.18em] text-[#6B5546]">{item.texto}</span>
              </article>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="aparecer retraso-2 rounded-[24px] border border-[#B64AD4]/20 bg-[linear-gradient(135deg,#4A153D_0%,#7621B0_58%,#A62E73_100%)] p-6 text-[#FFF6EC] shadow-[0_24px_70px_rgba(76,19,84,0.22)] lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Estado rápido</p>
                <h2 className="mt-3 text-[clamp(2.3rem,5vw,4.6rem)] !font-black uppercase leading-[0.86] tracking-normal">
                  {ultimoPedido ? 'Tu último pedido está en seguimiento' : 'Listo para tu primer pedido'}
                </h2>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#FFB400] text-[#2B1B12]">
                <Truck size={21} />
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-white/68">
              {ultimoPedido
                ? `Pedido #${ultimoPedido.id.slice(0, 8)}: ${ESTADO_ETIQUETA[ultimoPedido.estado] ?? ultimoPedido.estado}. Total $${Number(ultimoPedido.total).toFixed(2)}.`
                : 'Empieza con un kit o arma tu surtido desde catálogo. El carrito conserva tus productos mientras decides.'}
            </p>
            <Link
              href="/catalogo"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12] transition hover:bg-[#FFB400]"
            >
              Ir al catálogo <ArrowRight size={15} />
            </Link>
          </article>

          <article className="aparecer retraso-3 rounded-lg border border-[#EBD9C3] bg-white/82 p-6 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00A699]/12 text-[#007A70]">
              <MapPin size={18} />
            </span>
            <h2 className="mt-5 text-3xl !font-black uppercase leading-none">Dirección principal</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#6B5546]">
              {direccionPrincipal
                ? `${direccionPrincipal.calle_numero}${direccionPrincipal.colonia ? `, ${direccionPrincipal.colonia}` : ''}${direccionPrincipal.municipio ? `, ${direccionPrincipal.municipio}` : ''}`
                : 'Todavía no tienes una dirección guardada. Se agregará durante tu siguiente checkout.'}
            </p>
          </article>
        </div>

        <div id="pedidos" />
        <PestanasPanel
          pestanas={[
            {
              id: 'pedidos',
              titulo: 'Pedidos',
              conteo: pedidos?.length ?? 0,
              contenido: (
                <div>
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5A5F]">Historial</span>
                      <h2 className="mt-2 text-4xl !font-black uppercase leading-none md:text-5xl">Tus pedidos</h2>
                    </div>
                    <Link href="/catalogo" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#2B1B12] transition hover:text-[#FF5A5F]">
                      Comprar más <ArrowRight size={15} />
                    </Link>
                  </div>
                  {!pedidos || pedidos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#EBD9C3] bg-white/78 p-8 text-center">
              <ShoppingBag className="mx-auto text-[#FF5A5F]" size={32} />
              <p className="mt-4 text-2xl !font-black uppercase">Todavía no hay pedidos</p>
              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[#6B5546]">
                El catálogo ya está listo para que armes tu primer surtido con margen visible.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pedidos.map((pedido, index) => (
                <article
                  key={pedido.id}
                  className="aparecer rounded-lg border border-[#EBD9C3] bg-white/82 p-5 shadow-[0_16px_42px_rgba(43,27,18,0.05)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(43,27,18,0.09)]"
                  style={{ animationDelay: `${Math.min(index * 0.04, 0.2)}s` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5546]">
                        {new Date(pedido.creado_en).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className="mt-2 text-2xl !font-black uppercase leading-none">Pedido #{pedido.id.slice(0, 8)}</h3>
                      <p className="mt-3 text-sm font-semibold leading-6 text-[#6B5546]">
                        {(pedido.pedido_items ?? []).map((item) => `${desgloseCajas(item.cantidad)} de ${item.nombre_producto ?? (Array.isArray(item.productos) ? item.productos[0]?.nombre : (item.productos as { nombre: string } | null)?.nombre) ?? 'Producto'}`).join(', ')}
                      </p>
                      {(pedido.empresa_envio || pedido.guia_envio) && <p className="mt-3 rounded-xl bg-[#E9F8F5] px-4 py-3 text-sm font-bold text-[#007A70]">Envío: {pedido.empresa_envio ?? 'Paquetería'}{pedido.guia_envio ? ` · Guía ${pedido.guia_envio}` : ''}{pedido.url_rastreo && <a href={pedido.url_rastreo} target="_blank" rel="noreferrer" className="ml-2 underline underline-offset-4">Rastrear paquete</a>}</p>}
                      <BotonRepetirPedido articulos={(pedido.pedido_items ?? []).flatMap((item) => {
                        const producto = Array.isArray(item.productos) ? item.productos[0] : item.productos;
                        if (!producto?.id || !producto.unidad || !producto.activo || !(Number(producto.precio_mayoreo) > 0) || !['in_stock', 'available_from_supplier', 'low_stock'].includes(producto.disponibilidad)) return [];
                        return [{ id: producto.id, nombre: producto.nombre, unidad: producto.unidad, precio_mayoreo: Number(producto.precio_mayoreo), cantidad: item.cantidad, imagen: producto.imagen_url ?? undefined, piezas_por_caja: producto.piezas_por_caja, bolsas_por_caja: producto.bolsas_por_caja }];
                      })} />
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-full bg-[#FFF6EC] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6B5546]">
                        {ESTADO_ETIQUETA[pedido.estado] ?? pedido.estado}
                      </span>
                      <strong className="mt-3 block text-3xl !font-black leading-none">${Number(pedido.total).toFixed(2)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
                </div>
              ),
            },
            {
              id: 'datos',
              titulo: 'Datos personales',
              conteo: 1,
              contenido: (
                <div>
                  <h2 className="mb-5 text-4xl !font-black uppercase leading-none">Datos de tu negocio</h2>
                  <FormularioPerfil cliente={cliente} />
                </div>
              ),
            },
            {
              id: 'direcciones',
              titulo: 'Direcciones',
              conteo: direcciones?.length ?? 0,
              contenido: (
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#00A699]/12 text-[#007A70]">
                      <MapPin size={18} />
                    </span>
                    <h2 className="text-4xl !font-black uppercase leading-none">Tus direcciones</h2>
                  </div>
            {!direcciones || direcciones.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#EBD9C3] bg-white/70 p-6 text-sm font-semibold text-[#6B5546]">
                No tienes direcciones guardadas todavía.
              </p>
            ) : (
              <div className="grid gap-3">
                {direcciones.map((dir) => (
                  <article key={dir.id} className="rounded-lg border border-[#EBD9C3] bg-white/78 p-5 shadow-[0_14px_36px_rgba(43,27,18,0.05)]">
                    <h3 className="text-2xl !font-black uppercase leading-none">
                      {dir.etiqueta}{dir.predeterminada && ' / Principal'}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#6B5546]">
                      {dir.calle_numero}
                      {dir.colonia && `, ${dir.colonia}`}
                      {dir.municipio && `, ${dir.municipio}`}
                      {dir.estado && `, ${dir.estado}`}
                      {dir.codigo_postal && `, CP ${dir.codigo_postal}`}
                    </p>
                    <AccionesDireccion direccion={dir} />
                  </article>
                ))}
              </div>
            )}
            <FormularioDireccion />
                </div>
              ),
            },
            {
              id: 'configuracion',
              titulo: 'Configuración',
              conteo: 1,
              contenido: (
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#7621B0]/10 text-[#7621B0]"><Settings size={18} /></span>
                    <div><span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7621B0]">Seguridad</span><h2 className="text-4xl !font-black uppercase leading-none">Configuración de cuenta</h2></div>
                  </div>
                  <FormularioAcceso correo={user.email ?? 'Correo no disponible'} />
                </div>
              ),
            },
          ]}
        />
      </section>
    </main>
  );
}
