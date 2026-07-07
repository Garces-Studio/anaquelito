'use client';

import Link from 'next/link';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';

// Número de WhatsApp del negocio (definirlo con el socio y ponerlo en
// NEXT_PUBLIC_WHATSAPP_NUMERO, formato internacional sin signos: 521555...).
const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;

export default function PaginaCarrito() {
  const { articulos, cambiarCantidad, quitar, vaciar, subtotal } = usarCarrito();

  // Mensaje de pedido listo para mandar por WhatsApp
  const mensajePedido = encodeURIComponent(
    `¡Hola! Quiero hacer este pedido en Anaquelito:\n\n` +
      articulos
        .map((a) => `• ${a.cantidad} × ${a.nombre} (${a.unidad}) — $${(a.cantidad * a.precio_mayoreo).toFixed(2)}`)
        .join('\n') +
      `\n\nSubtotal: $${subtotal.toFixed(2)}`
  );

  if (articulos.length === 0) {
    return (
      <main className="contenedor" style={{ padding: '3rem 1.25rem 4rem', textAlign: 'center' }}>
        <h1 className="seccion-titulo aparecer">Tu carrito está vacío</h1>
        <p className="seccion-bajada aparecer retraso-1" style={{ marginInline: 'auto' }}>
          Llénalo con productos de alto margen para tu negocio.
        </p>
        <Link href="/catalogo" className="boton boton-primario aparecer retraso-2">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="contenedor" style={{ padding: '3rem 1.25rem 4rem' }}>
      <h1 className="seccion-titulo aparecer">Tu pedido</h1>
      <p className="seccion-bajada aparecer retraso-1">
        Revisa cantidades y confirma. Los descuentos por volumen se aplican al confirmar el pedido.
      </p>

      <div className="lista-carrito aparecer retraso-2">
        {articulos.map((articulo) => (
          <div key={articulo.id} className="fila-carrito">
            <div className="fila-carrito-info">
              <strong>{articulo.nombre}</strong>
              <span className="unidad">
                ${articulo.precio_mayoreo} por {articulo.unidad}
              </span>
            </div>
            <div className="fila-carrito-acciones">
              <div className="control-cantidad" aria-label={`Cantidad de ${articulo.nombre}`}>
                <button onClick={() => cambiarCantidad(articulo.id, articulo.cantidad - 1)} aria-label="Quitar uno">−</button>
                <span>{articulo.cantidad}</span>
                <button onClick={() => cambiarCantidad(articulo.id, articulo.cantidad + 1)} aria-label="Agregar uno">+</button>
              </div>
              <span className="fila-carrito-importe">
                ${(articulo.cantidad * articulo.precio_mayoreo).toFixed(2)}
              </span>
              <button
                className="boton-quitar"
                onClick={() => quitar(articulo.id)}
                aria-label={`Quitar ${articulo.nombre} del carrito`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="resumen-carrito aparecer retraso-3">
        <div className="resumen-linea">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <p className="resumen-nota">
          Envío y descuento por volumen se confirman junto con tu pedido.
        </p>
        <Link href="/checkout" className="boton boton-primario" style={{ width: '100%' }}>
          Ir a pagar con Mercado Pago
        </Link>
        {NUMERO_WHATSAPP && (
          <a
            href={`https://wa.me/${NUMERO_WHATSAPP}?text=${mensajePedido}`}
            target="_blank"
            rel="noopener noreferrer"
            className="boton boton-secundario"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            O enviar pedido por WhatsApp
          </a>
        )}
        <button
          onClick={vaciar}
          style={{
            marginTop: '0.75rem',
            width: '100%',
            color: 'var(--tinta-suave)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          Vaciar carrito
        </button>
      </div>
    </main>
  );
}
