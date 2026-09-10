export default function CargandoCatalogo() {
  return <main className="b2b b2b-interior" aria-busy="true"><section className="b2b-contenedor b2b-seccion"><p className="b2b-ceja">Cargando productos</p><h1>Preparando el catálogo…</h1><div className="b2b-productos">{Array.from({ length: 6 }, (_, i) => <div key={i} className="b2b-tarjeta min-h-[420px] animate-pulse" />)}</div></section></main>;
}
