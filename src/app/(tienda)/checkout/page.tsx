'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';
import { registrarEvento } from '@/lib/analitica';

type TipoNegocio = 'tiendita' | 'cafe' | 'emprendedor';

export default function PaginaCheckout() {
  const { articulos, subtotal } = usarCarrito();
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState<TipoNegocio>('tiendita');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (articulos.length === 0) {
    return (
      <main className="contenedor pagina-colorida" style={{ padding: '3rem 1.25rem 4rem', textAlign: 'center' }}>
        <h1 className="seccion-titulo titulo-degradado aparecer">Tu carrito está vacío</h1>
        <p className="seccion-bajada aparecer retraso-1" style={{ marginInline: 'auto' }}>
          Agrega productos desde el catálogo antes de pagar.
        </p>
        <Link href="/catalogo" className="boton boton-primario aparecer retraso-2">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    registrarEvento('begin_checkout', { currency: 'MXN', value: subtotal, items: articulos.map((a) => ({ item_id: a.id, item_name: a.nombre, price: a.precio_mayoreo, quantity: a.cantidad })) });

    try {
      const respuesta = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articulos,
          negocio: { nombre_negocio: nombreNegocio, telefono, direccion, tipo_negocio: tipoNegocio },
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error ?? 'No se pudo procesar el pedido');
      }

      // Al pagador se le redirige a Mercado Pago; el carrito se vacía
      // hasta que vuelva a la página de confirmación (pago aprobado).
      const destino = new URL(datos.urlPago);
      if (destino.protocol !== 'https:' || !['www.mercadopago.com.mx', 'sandbox.mercadopago.com.mx'].includes(destino.hostname)) throw new Error('No se recibió un enlace de pago válido');
      window.location.assign(destino.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      setEnviando(false);
    }
  };

  return (
    <main className="contenedor pagina-colorida" style={{ padding: '3rem 1.25rem 4rem' }}>
      <h1 className="seccion-titulo titulo-degradado aparecer">Confirmar pedido</h1>
      <p className="seccion-bajada aparecer retraso-1">
        Compra como invitado; estos datos son para saber a dónde y a nombre de quién entregar. ¿Ya tienes cuenta? <Link href="/iniciar-sesion" className="font-black underline">Ingresar</Link>
      </p>

      <div className="grid-checkout aparecer retraso-2">
        <form onSubmit={manejarEnvio} className="formulario-checkout">
          <label>
            Nombre del negocio
            <input
              type="text"
              required
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              placeholder="Ej. Miscelánea Don Beto"
            />
          </label>

          <label>
            Tipo de negocio
            <select value={tipoNegocio} onChange={(e) => setTipoNegocio(e.target.value as TipoNegocio)}>
              <option value="tiendita">Tiendita / minisúper</option>
              <option value="cafe">Café / fonda</option>
              <option value="emprendedor">Emprendedor / reventa</option>
            </select>
          </label>

          <label>
            Teléfono de contacto
            <input
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="55 1234 5678"
            />
          </label>

          <label>
            Dirección de entrega
            <textarea
              required
              rows={3}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, colonia, alcaldía/municipio, código postal"
            />
          </label>

          {error && <p className="error-checkout">{error}</p>}

          <button type="submit" className="boton boton-primario" disabled={enviando} style={{ width: '100%' }}>
            {enviando ? 'Redirigiendo a Mercado Pago…' : `Pagar $${subtotal.toFixed(2)} con Mercado Pago`}
          </button>
          <p className="resumen-nota">No necesitas crear una cuenta para completar el pago.</p>
        </form>

        <aside className="resumen-checkout">
          <h3 style={{ marginBottom: '1rem' }}>Tu pedido</h3>
          {articulos.map((a) => (
            <div key={a.id} className="resumen-checkout-fila">
              <span>{a.cantidad} × {a.nombre}</span>
              <strong>${(a.cantidad * a.precio_mayoreo).toFixed(2)}</strong>
            </div>
          ))}
          <div className="resumen-linea" style={{ marginTop: '1rem', borderTop: '1px dashed var(--borde)', paddingTop: '1rem' }}>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <p className="resumen-nota">Envío se confirma por separado según tu zona.</p>
        </aside>
      </div>
    </main>
  );
}
