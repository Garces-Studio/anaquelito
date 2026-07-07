import Link from 'next/link';

export default function PaginaEscaner() {
  return (
    <main className="contenedor pagina-colorida" style={{ padding: '3rem 1.25rem 4rem', textAlign: 'center' }}>
      <span className="insignia-colorida aparecer" style={{ marginInline: 'auto' }}>📷 Resurtido en 30 segundos</span>
      <h1 className="seccion-titulo titulo-degradado aparecer">¿Se acabó? Escanéalo.</h1>
      <p
        className="seccion-bajada aparecer retraso-1"
        style={{ marginInline: 'auto' }}
      >
        Apunta la cámara al código de barras de la bolsa vacía y el producto
        entra directo a tu carrito con tu precio de mayoreo.
      </p>

      <div className="visor-escaner aparecer retraso-2">
        <div className="linea-escaner"></div>
        <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>
          Vista previa — el escáner se activa próximamente
        </span>
      </div>

      <div
        className="aparecer retraso-3"
        style={{
          display: 'flex',
          gap: '0.9rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2rem',
        }}
      >
        <button className="boton boton-secundario">
          Ingresar código manualmente
        </button>
        <Link href="/catalogo" className="boton boton-primario">
          Mientras tanto, ver catálogo
        </Link>
      </div>

      {/* Cómo funcionará el reorden: expectativa clara para el cliente */}
      <div className="rejilla-pasos" style={{ textAlign: 'left', marginTop: '3.5rem' }}>
        <div className="paso">
          <h3>Escanea la bolsa vacía</h3>
          <p>Cualquier código de barras UPC de los productos de nuestro catálogo.</p>
        </div>
        <div className="paso">
          <h3>Confirma cantidad</h3>
          <p>Te sugerimos la cantidad de tu pedido anterior para ir más rápido.</p>
        </div>
        <div className="paso">
          <h3>Listo en 30 segundos</h3>
          <p>Tu resurtido queda pedido sin buscar producto por producto.</p>
        </div>
      </div>
    </main>
  );
}
