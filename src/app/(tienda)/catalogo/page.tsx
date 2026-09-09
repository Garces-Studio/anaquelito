import type { Metadata } from 'next';
import CatalogoMayoreo from '@/componentes/CatalogoMayoreo';
import { obtenerCatalogo } from '@/lib/catalogo-publico';
export const metadata: Metadata = { title: 'Productos de mayoreo | Anaquelito', description: 'Consulta nuestra selección inicial de gomitas y dulces para comprar por caja y surtir tu negocio.' };
export default async function Catalogo({ searchParams }: { searchParams: Promise<{ q?: string; categoria?: string }> }) {
  const { q = '', categoria = '' } = await searchParams;
  const { productos, disponible } = await obtenerCatalogo();
  const filtrados = productos.filter((p) => p.nombre.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es')) && (!categoria || p.categoria === categoria));
  return <main className="b2b b2b-interior" id="contenido"><section className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">Tu próximo surtido</p><h1>Selección inicial de mayoreo</h1><p className="b2b-intro">Presentaciones claras y precios por confirmar donde aún falta información.</p>
    <form className="b2b-busqueda" action="/catalogo"><label>Buscar producto<input name="q" type="search" defaultValue={q} placeholder="Gomita, Huevito, Bubulubu…" /></label><label>Categoría<select name="categoria" defaultValue={categoria}><option value="">Todas</option><option value="gomitas">Gomitas</option><option value="chocolates">Chocolates</option></select></label><button className="b2b-boton" type="submit">Buscar</button></form>
    {!disponible && <p role="status" className="b2b-aviso">No podemos consultar precios ni disponibilidad en este momento. Intenta nuevamente más tarde.</p>}
    <CatalogoMayoreo productos={filtrados} />{!filtrados.length && <p>No encontramos productos con esos filtros.</p>}
  </section></main>;
}
