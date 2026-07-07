'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, ImagePlus, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';

type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  unidad: string;
  precio_mayoreo: number;
  precio_menudeo: number | null;
  precio_sugerido_reventa: number | null;
  imagen_url: string | null;
  activo: boolean;
  creado_en: string;
  codigos_barra?: { codigo: string }[];
};

const CATEGORIAS: { valor: string; texto: string }[] = [
  { valor: 'frutos_secos', texto: 'Frutos secos' },
  { valor: 'gomitas', texto: 'Gomitas' },
  { valor: 'chocolates', texto: 'Chocolates' },
  { valor: 'semillas', texto: 'Semillas' },
  { valor: 'dulces', texto: 'Dulces' },
  { valor: 'fritos', texto: 'Fritos' },
];

type Formulario = {
  nombre: string;
  descripcion: string;
  categoria: string;
  unidad: string;
  precio_mayoreo: string;
  precio_sugerido_reventa: string;
  imagen_url: string;
  codigo_barras: string;
};

const FORMULARIO_VACIO: Formulario = {
  nombre: '',
  descripcion: '',
  categoria: 'dulces',
  unidad: 'pieza',
  precio_mayoreo: '',
  precio_sugerido_reventa: '',
  imagen_url: '',
  codigo_barras: '',
};

const CAMPO =
  'min-h-11 w-full rounded-lg border border-[#EBD9C3] bg-[#FFF6EC] px-3 text-sm font-semibold text-[#2B1B12] outline-none transition focus:border-[#FF5A5F]';
const ETIQUETA = 'grid gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6B5546]';

export default function PaginaAdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Formulario (crear o editar según editandoId)
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const inputImagen = useRef<HTMLInputElement>(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/admin/productos');
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? 'No se pudieron cargar los productos');
      setProductos(datos.productos ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setEditandoId(null);
    setFormulario(FORMULARIO_VACIO);
    setFormularioAbierto(true);
    setAviso(null);
  };

  const abrirEditar = (producto: Producto) => {
    setEditandoId(producto.id);
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      categoria: producto.categoria ?? 'dulces',
      unidad: producto.unidad,
      precio_mayoreo: String(producto.precio_mayoreo),
      precio_sugerido_reventa: producto.precio_sugerido_reventa ? String(producto.precio_sugerido_reventa) : '',
      imagen_url: producto.imagen_url ?? '',
      codigo_barras: producto.codigos_barra?.[0]?.codigo ?? '',
    });
    setFormularioAbierto(true);
    setAviso(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subirImagen = async (archivo: File) => {
    setSubiendoImagen(true);
    setError(null);
    try {
      const datos = new FormData();
      datos.append('archivo', archivo);
      const respuesta = await fetch('/api/admin/productos/imagen', { method: 'POST', body: datos });
      const json = await respuesta.json();
      if (!respuesta.ok) throw new Error(json.error ?? 'No se pudo subir la imagen');
      setFormulario((f) => ({ ...f, imagen_url: json.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const cuerpo = {
        ...(editandoId ? { id: editandoId } : {}),
        nombre: formulario.nombre,
        descripcion: formulario.descripcion || null,
        categoria: formulario.categoria || null,
        unidad: formulario.unidad || 'pieza',
        precio_mayoreo: Number(formulario.precio_mayoreo),
        precio_sugerido_reventa: formulario.precio_sugerido_reventa ? Number(formulario.precio_sugerido_reventa) : null,
        imagen_url: formulario.imagen_url || null,
        codigo_barras: formulario.codigo_barras.trim(),
      };
      const respuesta = await fetch('/api/admin/productos', {
        method: editandoId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error ?? 'No se pudo guardar');
      setAviso(editandoId ? 'Producto actualizado ✓' : 'Producto creado ✓');
      setFormularioAbierto(false);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const alternarActivo = async (producto: Producto) => {
    setError(null);
    const anterior = productos;
    setProductos((lista) => lista.map((p) => (p.id === producto.id ? { ...p, activo: !p.activo } : p)));
    const respuesta = await fetch('/api/admin/productos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: producto.id, activo: !producto.activo }),
    });
    if (!respuesta.ok) {
      setProductos(anterior);
      const datos = await respuesta.json().catch(() => ({}));
      setError(datos.error ?? 'No se pudo cambiar la visibilidad');
    }
  };

  const eliminar = async (producto: Producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}" definitivamente? Esta acción no se puede deshacer.`)) return;
    setError(null);
    const respuesta = await fetch('/api/admin/productos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: producto.id }),
    });
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      setError(datos.error ?? 'No se pudo eliminar');
      return;
    }
    setAviso('Producto eliminado ✓');
    setProductos((lista) => lista.filter((p) => p.id !== producto.id));
  };

  return (
    <>
      <header className="aparecer flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] !font-black uppercase leading-[0.86]">Productos</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-[#6B5546]">
            Agrega dulces nuevos, cambia precios e imágenes, u oculta productos sin borrarlos.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={cargar}
            className="inline-flex items-center gap-2 rounded-full border border-[#EBD9C3] bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] shadow-sm transition hover:border-[#00A699] hover:text-[#00A699]"
          >
            <RefreshCw size={14} className={cargando ? 'animate-spin' : ''} /> Actualizar
          </button>
          <button
            type="button"
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 rounded-full bg-[#2B1B12] px-5 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#FF5A5F]"
          >
            <Plus size={14} /> Nuevo producto
          </button>
        </div>
      </header>

      {aviso && (
        <p className="mt-6 rounded-lg border border-[#1E9E6A]/30 bg-[#1E9E6A]/10 px-4 py-3 text-sm font-bold text-[#177a52]">
          {aviso}
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-lg border border-[#D64545]/30 bg-[#D64545]/10 px-4 py-3 text-sm font-bold text-[#D64545]">
          {error}
        </p>
      )}

      {/* ---------- Formulario crear/editar ---------- */}
      {formularioAbierto && (
        <form
          onSubmit={guardar}
          className="mt-6 rounded-lg border border-[#EBD9C3] bg-white/86 p-5 shadow-[0_24px_70px_rgba(43,27,18,0.1)] backdrop-blur-xl md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl !font-black uppercase leading-none">
              {editandoId ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button
              type="button"
              onClick={() => setFormularioAbierto(false)}
              aria-label="Cerrar formulario"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#EBD9C3] transition hover:border-[#D64545] hover:text-[#D64545]"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            {/* Imagen */}
            <div className="flex flex-col gap-3">
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-[#EBD9C3] bg-[#FFF6EC]">
                {formulario.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formulario.imagen_url} alt="Imagen del producto" className="h-full w-full object-contain p-3" />
                ) : (
                  <span className="text-5xl">🍬</span>
                )}
              </div>
              <input
                ref={inputImagen}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  if (archivo) subirImagen(archivo);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                disabled={subiendoImagen}
                onClick={() => inputImagen.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EBD9C3] bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition hover:border-[#7621B0] hover:text-[#7621B0] disabled:opacity-50"
              >
                <ImagePlus size={14} />
                {subiendoImagen ? 'Subiendo…' : formulario.imagen_url ? 'Cambiar imagen' : 'Subir imagen'}
              </button>
            </div>

            {/* Campos */}
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className={`${ETIQUETA} sm:col-span-2`}>
                Nombre
                <input
                  className={CAMPO}
                  required
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                  placeholder="Ej. Gomitas Enchiladas"
                />
              </label>

              <label className={ETIQUETA}>
                Categoría
                <select
                  className={CAMPO}
                  value={formulario.categoria}
                  onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
                >
                  {CATEGORIAS.map(({ valor, texto }) => (
                    <option key={valor} value={valor}>{texto}</option>
                  ))}
                </select>
              </label>

              <label className={ETIQUETA}>
                Unidad de venta
                <input
                  className={CAMPO}
                  value={formulario.unidad}
                  onChange={(e) => setFormulario({ ...formulario, unidad: e.target.value })}
                  placeholder="pieza, bolsa 1kg, caja 24pz…"
                />
              </label>

              <label className={ETIQUETA}>
                Precio mayoreo (MXN)
                <input
                  className={CAMPO}
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.precio_mayoreo}
                  onChange={(e) => setFormulario({ ...formulario, precio_mayoreo: e.target.value })}
                  placeholder="75.00"
                />
              </label>

              <label className={ETIQUETA}>
                Precio sugerido de reventa
                <input
                  className={CAMPO}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.precio_sugerido_reventa}
                  onChange={(e) => setFormulario({ ...formulario, precio_sugerido_reventa: e.target.value })}
                  placeholder="105.00 (opcional)"
                />
              </label>

              <label className={`${ETIQUETA} sm:col-span-2`}>
                Código de barras (UPC/EAN) — lo que lee el escáner
                <input
                  className={CAMPO}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formulario.codigo_barras}
                  onChange={(e) => setFormulario({ ...formulario, codigo_barras: e.target.value })}
                  placeholder="Ej. 7501234567890 (opcional)"
                />
              </label>

              <label className={`${ETIQUETA} sm:col-span-2`}>
                Descripción
                <textarea
                  className={`${CAMPO} min-h-20 resize-y py-2.5`}
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  placeholder="Descripción corta para la página del producto (opcional)"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setFormularioAbierto(false)}
              className="rounded-full border border-[#EBD9C3] bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.14em] transition hover:border-[#2B1B12]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || subiendoImagen}
              className="rounded-full bg-[#2B1B12] px-8 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#FF5A5F] disabled:opacity-50"
            >
              {guardando ? 'Guardando…' : editandoId ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      )}

      {/* ---------- Lista ---------- */}
      {cargando && (
        <div className="mt-16 flex flex-col items-center gap-3 text-[#6B5546]">
          <RefreshCw className="h-8 w-8 animate-spin text-[#FF5A5F]" />
          <p className="text-[11px] font-black uppercase tracking-[0.18em]">Cargando productos…</p>
        </div>
      )}

      {!cargando && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <article
              key={producto.id}
              className={`flex flex-col rounded-lg border bg-white/82 p-4 shadow-[0_18px_50px_rgba(43,27,18,0.06)] backdrop-blur-xl transition ${
                producto.activo ? 'border-[#EBD9C3]' : 'border-dashed border-[#D64545]/40 opacity-70'
              }`}
            >
              <div className="relative mb-3 grid h-36 place-items-center overflow-hidden rounded-lg bg-[#FFF6EC]">
                {producto.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={producto.imagen_url} alt={producto.nombre} className="h-full w-full object-contain p-2" />
                ) : (
                  <span className="text-4xl">🍬</span>
                )}
                {!producto.activo && (
                  <span className="absolute left-2 top-2 rounded-full bg-[#D64545] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                    Oculto
                  </span>
                )}
              </div>

              <h3 className="text-lg !font-black uppercase leading-tight">{producto.nombre}</h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B5546]">
                {CATEGORIAS.find((c) => c.valor === producto.categoria)?.texto ?? 'Sin categoría'} · {producto.unidad}
              </p>
              {producto.codigos_barra?.[0] ? (
                <p className="mt-1 text-[10px] font-black tracking-[0.1em] text-[#7621B0]">
                  ▍▏▎ {producto.codigos_barra[0].codigo}
                </p>
              ) : (
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#D64545]/70">
                  Sin código de barras — el escáner no lo detecta
                </p>
              )}

              <div className="mt-3 flex items-baseline gap-2">
                <strong className="text-2xl !font-black">${Number(producto.precio_mayoreo).toFixed(2)}</strong>
                {producto.precio_sugerido_reventa && (
                  <span className="text-xs font-bold text-[#1E9E6A]">
                    reventa ${Number(producto.precio_sugerido_reventa).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-2 border-t border-[#EBD9C3]/70 pt-3">
                <button
                  type="button"
                  onClick={() => abrirEditar(producto)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EBD9C3] px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] transition hover:border-[#2B1B12]"
                >
                  <Pencil size={12} /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => alternarActivo(producto)}
                  title={producto.activo ? 'Ocultar del catálogo' : 'Mostrar en el catálogo'}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#EBD9C3] px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] transition hover:border-[#FFB400] hover:text-[#8A6200]"
                >
                  {producto.activo ? <><EyeOff size={12} /> Ocultar</> : <><Eye size={12} /> Mostrar</>}
                </button>
                <button
                  type="button"
                  onClick={() => eliminar(producto)}
                  aria-label={`Eliminar ${producto.nombre}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#EBD9C3] text-[#6B5546] transition hover:border-[#D64545] hover:text-[#D64545]"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
