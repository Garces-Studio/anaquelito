import type { Metadata } from 'next';
import CatalogoMayoreo from '@/componentes/CatalogoMayoreo';
import { obtenerCatalogo } from '@/lib/catalogo-publico';
import { Boxes, PackageCheck, Search, Sparkles, Truck } from 'lucide-react';
export const metadata: Metadata = { title: 'Productos de mayoreo | Anaquelito', description: 'Consulta nuestra selección inicial de gomitas y dulces para comprar por caja y surtir tu negocio.', alternates: { canonical: '/catalogo' }, openGraph: { title: 'Productos de mayoreo | Anaquelito', description: 'Dulces por caja para surtir tu negocio.', type: 'website' }, twitter: { card: 'summary_large_image', title: 'Productos de mayoreo | Anaquelito', description: 'Dulces por caja para surtir tu negocio.' } };
export default async function Catalogo({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const { productos, disponible } = await obtenerCatalogo();
  const consulta = q.trim().toLocaleLowerCase('es');
  const filtrados = productos.filter((p) => [p.nombre, p.marca, p.sku].some((valor) => valor?.toLocaleLowerCase('es').includes(consulta)));
  return <main className="relative min-h-screen overflow-hidden bg-[#F7F3F8] pb-20 pt-28 text-[#2B1B12] md:pt-32" id="contenido">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_8%,rgba(255,90,95,.22),transparent_25%),radial-gradient(circle_at_94%_12%,rgba(0,166,153,.2),transparent_27%),radial-gradient(circle_at_70%_70%,rgba(118,33,176,.09),transparent_30%),linear-gradient(145deg,#FFF6EC,#F8F5FB_55%,#EEF9F7)]" />
    <section className="relative mx-auto w-[min(1240px,calc(100%-32px))]">
      <header className="aparecer relative overflow-hidden rounded-[32px] bg-[#23131F] px-6 py-10 text-white shadow-[0_30px_85px_rgba(43,27,18,.22)] sm:px-10 sm:py-12 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(255,90,95,.68),transparent_28%),radial-gradient(circle_at_4%_100%,rgba(0,166,153,.38),transparent_28%),linear-gradient(145deg,#21131B,#4A2037_62%,#6E2941)]" />
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white backdrop-blur"><Sparkles size={14} className="text-[#FFB400]" /> Tu próximo surtido</span>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,6vw,5.8rem)] !font-black leading-[.92] text-white">Productos que sí merecen espacio en tu anaquel.</h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/68">Compra por caja o arma una tarima. Aquí ves presentación, disponibilidad y precio antes de agregar.</p>
          </div>
          <div className="grid gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm font-bold backdrop-blur sm:grid-cols-3 lg:grid-cols-1">
            <span className="flex items-center gap-3"><Boxes size={18} className="text-[#FFB400]" /> Compra por caja</span>
            <span className="flex items-center gap-3"><PackageCheck size={18} className="text-[#45CBBF]" /> Tarimas de 100</span>
            <span className="flex items-center gap-3"><Truck size={18} className="text-[#FF7B80]" /> Entrega por confirmar</span>
          </div>
        </div>
      </header>

      <form className="aparecer retraso-1 relative -mt-5 mx-auto flex max-w-3xl flex-col gap-3 rounded-[22px] border border-white/90 bg-white/92 p-3 shadow-[0_18px_50px_rgba(43,27,18,.13)] backdrop-blur-xl sm:flex-row" action="/catalogo">
        <label className="relative flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-[#FFF8F1] px-4 text-sm font-bold text-[#6B5546] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(0,166,153,.12)]"><Search size={19} className="shrink-0 text-[#FF5A5F]" /><span className="sr-only">Buscar producto</span><input className="h-full w-full bg-transparent text-base font-semibold text-[#2B1B12] outline-none placeholder:text-[#8B7465]/60" name="q" type="search" defaultValue={q} placeholder="Nombre, marca o SKU…" /></label>
        <button className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,90,95,.25)] transition hover:-translate-y-0.5 hover:bg-[#E0484D]" style={{ backgroundColor: '#FF5A5F', color: '#FFFFFF' }} type="submit">Buscar <Search size={17} /></button>
      </form>

      <div className="mt-12">
        {!disponible && <p role="status" className="mb-6 rounded-2xl border border-[#F0D6A0] bg-[#FFF5DE] px-5 py-4 text-sm font-bold text-[#7A5630]">No podemos consultar precios ni disponibilidad en este momento. Intenta nuevamente más tarde.</p>}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#00A699]">Catálogo mayorista</p><h2 className="mt-2 text-3xl !font-black">{filtrados.length} {filtrados.length === 1 ? 'producto disponible' : 'productos disponibles'}</h2></div>{consulta && <p className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6B5546] shadow-sm">Resultados para “{q}”</p>}</div>
        <CatalogoMayoreo productos={filtrados} />
        {!filtrados.length && <div className="rounded-[26px] border border-white bg-white/80 px-6 py-16 text-center shadow-[0_18px_50px_rgba(43,27,18,.08)]"><Search size={30} className="mx-auto text-[#FF5A5F]" /><h2 className="mt-4 text-2xl !font-black">No encontramos productos</h2><p className="mt-2 text-[#6B5546]">Prueba con otro nombre, marca o SKU.</p></div>}
      </div>
    </section>
  </main>;
}
