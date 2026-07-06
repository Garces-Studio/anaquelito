**Anaquelito** — plataforma B2B de mayoreo de dulces y botanas.

📖 **Manual del proyecto:** ver [`docs/MANUAL.md`](docs/MANUAL.md) para la estrategia, el modelo de negocio, la arquitectura técnica y el estado de avance actualizado. Ese documento está escrito para que cualquiera de los dos socios lo entienda, no solo quien programa.

## Cómo levantar el proyecto en tu computadora

1. Instalar las dependencias (solo la primera vez, o cuando cambien):

```bash
npm install
```

2. Levantar el servidor de desarrollo:

```bash
npm run dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador para ver la página.

Mientras el servidor está corriendo, cualquier cambio que se guarde en el código se refleja automáticamente en el navegador.

## Estructura del proyecto (resumen)

- `src/app/page.tsx` — página de inicio.
- `src/app/catalogo/` — catálogo de productos al mayoreo.
- `src/app/escaner/` — escáner de código de barras para reordenar productos.
- `src/lib/supabase/` — conexión a la base de datos (Supabase).
- `docs/` — el manual completo del proyecto: estrategia, negocio, técnica y pendientes.

## Este proyecto está construido con

- [Next.js](https://nextjs.org) — el framework de la página web.
- [Supabase](https://supabase.com) — la base de datos y autenticación.
- Pensado para desplegarse en [Vercel](https://vercel.com).
