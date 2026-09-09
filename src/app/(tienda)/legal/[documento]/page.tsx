import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const DOCUMENTOS = {
  terminos: { titulo: 'Términos y condiciones', puntos: ['Condiciones de compra y confirmación del pedido.', 'Formas de pago, cancelación y responsabilidades de las partes.'] },
  privacidad: { titulo: 'Aviso de privacidad', puntos: ['Datos que se recopilan al crear una cuenta o pedido.', 'Finalidades, conservación y medios para ejercer derechos de privacidad.'] },
  envios: { titulo: 'Política de envíos', puntos: ['Cobertura, costos y tiempos de entrega.', 'Procedimiento para incidencias y recepción de mercancía.'] },
  devoluciones: { titulo: 'Cambios y devoluciones', puntos: ['Supuestos aplicables a productos dañados o pedidos incorrectos.', 'Plazos, evidencias y procedimiento de atención.'] },
  facturacion: { titulo: 'Facturación', puntos: ['Disponibilidad del servicio y datos fiscales requeridos.', 'Plazos y canal para solicitar correcciones.'] },
} as const;

type Props = { params: Promise<{ documento: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const documento = DOCUMENTOS[(await params).documento as keyof typeof DOCUMENTOS];
  return { title: documento ? `${documento.titulo} | Anaquelito` : 'Documento no encontrado' };
}

export default async function DocumentoLegal({ params }: Props) {
  const documento = DOCUMENTOS[(await params).documento as keyof typeof DOCUMENTOS];
  if (!documento) notFound();
  return <main className="b2b b2b-interior" id="contenido"><section className="b2b-contenedor b2b-seccion b2b-legal"><p className="b2b-ceja">Información del negocio</p><h1>{documento.titulo}</h1><div className="b2b-aviso" role="status"><strong>Borrador pendiente de revisión legal.</strong> Esta página prepara el espacio, pero todavía no constituye la política definitiva del negocio.</div><h2>Contenido por confirmar</h2><ul>{documento.puntos.map((punto) => <li key={punto}>{punto}</li>)}</ul><p>No cierres una compra basándote en este borrador. Antes de iniciar ventas, el responsable del negocio deberá completar y aprobar el texto.</p><Link className="b2b-consultar" href="/">Volver al inicio</Link></section></main>;
}
