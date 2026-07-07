'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { CameraOff, RefreshCw } from 'lucide-react';

/**
 * Visor de cámara que lee códigos de barras (UPC/EAN/Code128) en vivo.
 *
 * - Usa @zxing/browser porque iOS Safari NO tiene la API nativa BarcodeDetector.
 * - Pide la cámara trasera (facingMode: environment) — la correcta en celular.
 * - IMPORTANTE: getUserMedia solo funciona en HTTPS o en localhost. Para probar
 *   desde un iPhone en tu red local necesitas `next dev --experimental-https`
 *   o el sitio ya desplegado (Vercel).
 */

// Solo formatos de código de barras de producto (no QR): lectura más rápida.
const FORMATOS = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
];

type Props = {
  /** Se llama UNA vez por lectura; el visor se pausa hasta reactivarlo. */
  onCodigo: (codigo: string) => void;
  /** Si es false, el visor se detiene (apaga la cámara). */
  activo: boolean;
};

export default function EscanerCamara({ onCodigo, activo }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlesRef = useRef<IScannerControls | null>(null);
  // El callback vive en un ref para no reiniciar la cámara en cada render.
  const onCodigoRef = useRef(onCodigo);
  onCodigoRef.current = onCodigo;

  const [estado, setEstado] = useState<'iniciando' | 'listo' | 'error'>('iniciando');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    if (!activo) return;

    let cancelado = false;
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, FORMATOS);
    const lector = new BrowserMultiFormatReader(hints);

    setEstado('iniciando');

    lector
      .decodeFromConstraints(
        { audio: false, video: { facingMode: 'environment' } },
        videoRef.current!,
        (resultado) => {
          if (resultado && !cancelado) {
            // Vibración corta como confirmación táctil (si el teléfono lo permite)
            try { navigator.vibrate?.(80); } catch { /* opcional */ }
            onCodigoRef.current(resultado.getText());
          }
        }
      )
      .then((controles) => {
        if (cancelado) {
          controles.stop();
          return;
        }
        controlesRef.current = controles;
        setEstado('listo');
      })
      .catch((error: unknown) => {
        if (cancelado) return;
        setEstado('error');
        const nombre = error instanceof Error ? error.name : '';
        if (nombre === 'NotAllowedError') {
          setMensajeError('Permiso de cámara denegado. Actívalo en los ajustes del navegador.');
        } else if (nombre === 'NotFoundError') {
          setMensajeError('No se encontró ninguna cámara en este dispositivo.');
        } else if (typeof window !== 'undefined' && !window.isSecureContext) {
          setMensajeError('La cámara requiere HTTPS. Abre el sitio con candado (https://) para escanear.');
        } else {
          setMensajeError(error instanceof Error ? error.message : 'No se pudo iniciar la cámara.');
        }
      });

    return () => {
      cancelado = true;
      controlesRef.current?.stop();
      controlesRef.current = null;
    };
  }, [activo]);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#1C120D] sm:aspect-[4/3]">
      {/* Video en vivo de la cámara trasera */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline // imprescindible en iOS: sin esto Safari abre el video a pantalla completa
      />

      {/* Marco y línea de escaneo (solo cuando la cámara ya corre) */}
      {estado === 'listo' && (
        <>
          <div className="pointer-events-none absolute inset-5 rounded-lg border-2 border-dashed border-white/50" />
          <div className="linea-escaner-real pointer-events-none absolute left-[8%] z-10 h-[2px] w-[84%] bg-[#FF5A5F] shadow-[0_0_24px_#FF5A5F]" />
          <p className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-black/45 px-3 py-2 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">
            Apunta al código de barras
          </p>
        </>
      )}

      {estado === 'iniciando' && (
        <div className="absolute inset-0 grid place-items-center text-white/85">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-[#FF5A5F]" />
            <p className="text-[11px] font-black uppercase tracking-[0.16em]">Abriendo cámara…</p>
          </div>
        </div>
      )}

      {estado === 'error' && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
          <div className="flex flex-col items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#D64545]">
              <CameraOff size={22} />
            </span>
            <p className="max-w-xs text-sm font-semibold leading-6 text-white/85">{mensajeError}</p>
          </div>
        </div>
      )}
    </div>
  );
}
