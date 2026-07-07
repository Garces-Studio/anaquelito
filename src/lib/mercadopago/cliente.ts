import { MercadoPagoConfig } from 'mercadopago';

/**
 * Cliente de Mercado Pago para el servidor. El Access Token es secreto:
 * solo vive en variables de entorno de servidor, nunca con prefijo
 * NEXT_PUBLIC_ y nunca en código de cliente.
 */
export function crearClienteMercadoPago() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  });
}
