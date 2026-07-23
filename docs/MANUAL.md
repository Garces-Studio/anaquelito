# Manual de Anaquelito

Este es el documento maestro del proyecto **Anaquelito**. Aquí se centraliza todo: la estrategia, las decisiones, el estado técnico y lo que falta por hacer. Está pensado para que tú y tu socio puedan abrirlo en cualquier momento y saber exactamente en qué punto está el negocio y la página.

**Regla del proyecto:** cada vez que se implemente algo nuevo (código, decisión de negocio, cambio de rumbo), se actualiza el documento correspondiente en `docs/`. Esta carpeta vive junto al código pero es independiente de él — es la memoria del proyecto completo, no solo de la app.

## Índice de documentos

| Documento | Para qué sirve |
|---|---|
| [01-vision-y-estrategia.md](01-vision-y-estrategia.md) | Por qué existe Anaquelito, a quién le vendemos, cómo nos diferenciamos de K-Botanas y competencia |
| [02-analisis-competitivo.md](02-analisis-competitivo.md) | Resumen de la investigación de K-Botanas y otros mayoristas (resumen ejecutable, no el reporte completo) |
| [03-modelo-de-negocio.md](03-modelo-de-negocio.md) | Segmentos de cliente, precios, crédito, kits — las reglas de negocio que la app debe reflejar |
| [04-arquitectura-tecnica.md](04-arquitectura-tecnica.md) | Stack, estructura del proyecto, decisiones técnicas y por qué se tomaron |
| [05-bitacora-de-avance.md](05-bitacora-de-avance.md) | Registro cronológico de qué se ha construido, sesión por sesión |
| [06-pendientes-y-decisiones.md](06-pendientes-y-decisiones.md) | Lista viva de lo que falta decidir o construir, con dueño y prioridad |
| [07-legal-y-cumplimiento.md](07-legal-y-cumplimiento.md) | Sociedad, PROFECO, protección de datos, NOM-051 — lo mínimo indispensable |
| [manual/README.md](manual/README.md) | Manual técnico página por página del sitio (qué hace cada pantalla, con qué código) — empieza en [manual/01-home.md](manual/01-home.md) |

## Estado actual en una frase

Anaquelito es una plataforma B2B de venta de dulces y botanas al mayoreo para tienditas, cafés y emprendedores, con un diferenciador operativo (reorden por escaneo de código de barras) que la competencia (K-Botanas y similares) no tiene. El frontend base ya existe (home, catálogo, escáner) sobre Next.js, desplegado en Vercel y conectado a una base de datos real en Supabase (productos, clientes, pedidos, códigos de barra, crédito). El catálogo ya muestra productos reales de la base de datos. Falta: autenticación, carrito/checkout, escaneo real de código de barras y definir las reglas de negocio marcadas como pendientes en el resto de los documentos.

## Cómo trabajar con este manual

- Si vas a construir algo nuevo, primero revisa [06-pendientes-y-decisiones.md](06-pendientes-y-decisiones.md) para no duplicar esfuerzo.
- Cuando termines una implementación, se agrega una entrada en [05-bitacora-de-avance.md](05-bitacora-de-avance.md).
- Si cambia una decisión de negocio (precios, segmentos, crédito), se actualiza [03-modelo-de-negocio.md](03-modelo-de-negocio.md), no se deja solo en el chat.
- Las decisiones de marca y estrategia ya tomadas (nombre, identidad visual, propuesta de valor) están fijadas en [01-vision-y-estrategia.md](01-vision-y-estrategia.md) — no se vuelven a debatir sin razón de peso.
- Si modificas una página del sitio de forma importante, actualiza su archivo en [manual/](manual/README.md).
