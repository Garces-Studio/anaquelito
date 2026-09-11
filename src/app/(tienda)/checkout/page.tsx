'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usarCarrito } from '@/componentes/carrito/ContextoCarrito';
import { registrarEvento } from '@/lib/analitica';
import { leerRespuesta } from '@/lib/respuesta-json';

type TipoNegocio = 'tiendita' | 'cafe' | 'emprendedor';
type DireccionGuardada = { id: string; etiqueta: string; calle_numero: string; colonia: string | null; municipio: string | null; estado: string | null; codigo_postal: string | null };

export default function PaginaCheckout() {
  const { articulos, subtotal } = usarCarrito();
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState<TipoNegocio>('tiendita');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direccionesGuardadas, setDireccionesGuardadas] = useState<DireccionGuardada[]>([]);
  const [cargandoCuenta, setCargandoCuenta] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  const envioActivo = useRef(false);
  const intentoActual = useRef<{ huella: string; clave: string } | null>(null);

  const usarDireccion = (d: DireccionGuardada) => setDireccion([d.calle_numero,d.colonia,d.municipio,d.estado,d.codigo_postal].filter(Boolean).join(', '));
  const cargarCuenta = async () => {
    setCargandoCuenta(true); setError(null);
    try {
      const datos = await leerRespuesta(await fetch('/api/cuenta', { cache: 'no-store' }));
      const perfil = datos.perfil as { nombre_negocio: string; telefono: string | null; tipo_negocio: TipoNegocio };
      const guardadas = datos.direcciones as DireccionGuardada[];
      setNombreNegocio(perfil.nombre_negocio); setTelefono(perfil.telefono ?? ''); setTipoNegocio(perfil.tipo_negocio);
      setDireccionesGuardadas(guardadas);
      setDireccionSeleccionada(guardadas[0]?.id ?? '');
      if (guardadas[0]) usarDireccion(guardadas[0]);
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cargar tu cuenta.'); }
    finally { setCargandoCuenta(false); }
  };

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
    if (envioActivo.current) return;
    envioActivo.current = true;
    setEnviando(true);
    setError(null);
    registrarEvento('begin_checkout', { currency: 'MXN', value: subtotal, items: articulos.map((a) => ({ item_id: a.id, item_name: a.nombre, price: a.precio_mayoreo, quantity: a.cantidad })) });

    try {
      const cuerpo = { articulos: articulos.map(({ id, cantidad }) => ({ id, cantidad })), negocio: { nombre_negocio: nombreNegocio, telefono, direccion, tipo_negocio: tipoNegocio } };
      const bytes = new TextEncoder().encode(JSON.stringify(cuerpo));
      const huella = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
      let clave = intentoActual.current?.huella === huella ? intentoActual.current.clave : crypto.randomUUID();
      try {
        const anterior = JSON.parse(sessionStorage.getItem('anaquelito-checkout') ?? 'null');
        if (anterior?.huella === huella && typeof anterior.clave === 'string') clave = anterior.clave;
        sessionStorage.setItem('anaquelito-checkout', JSON.stringify({ huella, clave }));
      } catch { /* Mantener la clave en memoria si el almacenamiento está desactivado. */ }
      intentoActual.current = { huella, clave };
      const respuesta = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': clave },
        body: JSON.stringify(cuerpo),
      });

      const datos = await leerRespuesta(respuesta);

      // Al pagador se le redirige a Mercado Pago; el carrito se vacía
      // hasta que vuelva a la página de confirmación (pago aprobado).
      const destino = new URL(String(datos.urlPago));
      if (destino.protocol !== 'https:' || !['www.mercadopago.com.mx', 'sandbox.mercadopago.com.mx'].includes(destino.hostname)) throw new Error('No se recibió un enlace de pago válido');
      window.location.assign(destino.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      setEnviando(false);
      envioActivo.current = false;
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
          <button type="button" onClick={cargarCuenta} disabled={cargandoCuenta} className="b2b-consultar">{cargandoCuenta ? 'Cargando tu cuenta…' : 'Usar los datos de mi cuenta'}</button>
          {direccionesGuardadas.length > 0 && <label>Direcciones guardadas<select value={direccionSeleccionada} onChange={e => { setDireccionSeleccionada(e.target.value); const d = direccionesGuardadas.find(d => d.id === e.target.value); if (d) usarDireccion(d); }}>{direccionesGuardadas.map(d => <option key={d.id} value={d.id}>{d.etiqueta} · {d.calle_numero}</option>)}</select></label>}
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

          {error && <p role="alert" className="error-checkout">{error}</p>}

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
          <div className="resumen-linea"><span>Envío</span><strong>Por confirmar</strong></div>
          <p className="resumen-nota">El total con envío se confirma antes de cerrar tu compra.</p>
        </aside>
      </div>
    </main>
  );
}
