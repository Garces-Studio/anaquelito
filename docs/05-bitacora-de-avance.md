# Bitácora de avance

Registro cronológico de lo que se ha construido. Agregar una entrada nueva (fecha + resumen) cada vez que se cierre un bloque de trabajo relevante — no hace falta registrar cada commit, sí cada hito.

## 2026-07-07 (continuación — escáner con dirección visual premium)

- **Página `/escaner` rediseñada** con el lenguaje visual inspirado en la vitrina tipo Stone Sip: hero editorial, producto protagonista, dulces flotantes, visor de cámara con línea de escaneo animada, tarjetas de métricas, marquesina y flujo de reorden en tres pasos.
- El copy conserva la promesa real del proyecto: escanear el UPC de la bolsa/empaque vacío para reordenar sin buscar producto por producto.
- Se mantuvo la honestidad del estado actual: la lectura real de cámara todavía está pendiente; esta entrega deja lista la experiencia visual y el flujo esperado para conectar después la lógica de lectura de códigos de barras.

## 2026-07-06

- Se crea la carpeta `docs/` con el manual del proyecto (este documento y sus hermanos), consolidando la investigación de mercado y el estado técnico existente hasta ahora.
- Estado del código al momento de escribir esto (heredado de sesiones previas, no creado hoy):
  - Proyecto Next.js 16 llamado **Anaquelito**, con identidad de marca ya definida (colores coral/amarillo/teal, tipografía Outfit).
  - Home (`src/app/page.tsx`) con hero y propuesta de valor.
  - Catálogo placeholder (`src/app/catalogo/page.tsx`) con productos hardcodeados, sin datos reales.
  - Escáner placeholder (`src/app/escaner/page.tsx`) — UI de "cámara activada" simulada, sin lógica real de lectura de código de barras.
  - Cliente y servidor de Supabase configurados (`src/lib/supabase/`), sin esquema de base de datos definido todavía ni uso real en las páginas.
- Sin commits nuevos de código en esta sesión; solo documentación.

## 2026-07-06 (continuación)

- **Nombre de marca decidido:** el proyecto se llama **Anaquelito** (antes "KrujiBox" era solo nombre de trabajo). Se actualizó en todo el código (`layout.tsx`, `page.tsx`, `package.json`) y en todos los documentos de `docs/`.
- Se limpiaron archivos de plantilla sin uso: SVGs de ejemplo en `public/` y `src/app/page.module.css` (no se usaban en ningún lado).
- Se renombraron las rutas del inglés al español: `src/app/catalog` → `src/app/catalogo`, `src/app/scanner` → `src/app/escaner`.
- Se conectó la navegación del home (`page.tsx`) a `/catalogo` y `/escaner` con `next/link` (antes eran botones sin destino).
- README traducido y simplificado para que el socio no técnico lo entienda.
- Se decidió trabajar únicamente con Claude Code de aquí en adelante (se dejan de usar Antigravity/Codex en paralelo) para evitar conflictos de edición simultánea, que sí llegaron a ocurrir en esta misma sesión.
- Se conecta el repositorio local a GitHub: `github.com/Garces-Studio/anaquelito`.

## 2026-07-06 (base de datos real)

- **Supabase conectado de verdad.** Proyecto real: `hdyvbsowyotiojlukkbl`. Se usó el connection string del **Session pooler** (`aws-0-us-east-1.pooler.supabase.com:5432`) porque la conexión directa de Supabase es solo IPv6 y esta red no tenía ruta IPv6.
- Se creó la primera migración real (`supabase/migrations/0001_esquema_inicial.sql`) con 6 tablas: `clientes`, `productos`, `codigos_barra`, `pedidos`, `pedido_items`, `lineas_credito`. Todas con seguridad a nivel de fila (RLS): el catálogo es de lectura pública, todo lo demás solo lo ve el dueño del registro.
- Se agregaron productos de ejemplo (`supabase/migrations/0002_productos_de_ejemplo.sql`) para poder probar el catálogo con datos reales.
- Se conectó `src/app/catalogo/page.tsx` a Supabase de verdad (antes tenía 6 productos inventados a mano). Ya lee de la tabla `productos` en vivo.
- `.env.local` configurado con la URL y la llave pública (`anon`/`publishable`) reales del proyecto. La contraseña de la base de datos vive solo en `.env.local` (no se sube a git).
- Se hizo una reinstalación limpia de `node_modules` porque había quedado corrupta (un paquete con configuración inválida rompía `next lint`); ahora el servidor de desarrollo levanta sin problema.
- Se agregó `.claude/launch.json` para poder levantar el servidor de desarrollo desde las herramientas de previsualización.
- Se corrigió una advertencia de Next.js sobre "múltiples lockfiles" fijando `turbopack.root` en `next.config.ts`.
- Probado en navegador real: home → navega a catálogo → catálogo muestra productos reales de la base de datos (Cacahuate Japonés $75, Gomitas Surtidas $92, etc.).
- Pendiente todavía: autenticación de clientes, flujo de pedido/carrito completo, escáner de código de barras funcional, y despliegue confirmado en Vercel con las variables de entorno de Supabase configuradas ahí también.

## 2026-07-06 (rediseño completo del sitio)

- **Análisis en vivo de k-botanas.com** documentado en [02-analisis-competitivo.md](02-analisis-competitivo.md): tabla de debilidad → cómo la atacamos.
- **Portada nueva tipo carrusel** a pantalla completa con fotografías reales de producto (`public/papas.png`, `mazapan.png`, `gomitas.png`, `paleta.png`), fondo de color que cambia por producto, texto gigante "DULCES" de fondo y grano analógico. Usa la librería de íconos `lucide-react`.
- **Sistema de diseño "Mercado moderno"** para las páginas interiores (tema cálido: papel de estraza, tinta café, etiquetas de precio con forma rotada, modo oscuro café tostado). Tipografías: Anton (títulos, energía de cartel de mercado) + Inter (texto).
- **Separación por grupos de ruta**: la portada vive a pantalla completa sin menús; catálogo y escáner viven en `src/app/(tienda)/` con encabezado fijo y pie de página compartidos (`src/componentes/`).
- **Catálogo mejorado**: filtros por categoría (chips), búsqueda por nombre (funciona con parámetros GET), y el diferenciador estrella — cada producto muestra su **precio de mayoreo + precio sugerido de reventa + etiqueta "le ganas ~X%"**. Nadie en la competencia muestra el margen.
- **Base de datos**: migración `0003` — columna `precio_sugerido_reventa` en `productos`, y dos correcciones de seguridad en RLS detectadas en revisión propia: faltaba política para que un cliente nuevo se registre, y para que un cliente agregue artículos a sus pedidos pendientes.
- **Seguridad HTTP**: cabeceras agregadas en `next.config.ts` (anti-clickjacking, anti-MIME-sniffing, política de referencia y de permisos del navegador).
- **Escáner rediseñado** con el tema nuevo y copy honesto ("vista previa — se activa próximamente") en vez de simular una cámara activa.
- Se detectó y arregló una caché de compilación corrupta (`.next` apuntaba a módulos de la instalación anterior); se limpió y el sitio compila y responde 200 en las tres rutas.
- **Verificado en navegador**: portada carrusel, catálogo con margen y filtros, escáner, modo oscuro y móvil.

## 2026-07-06 (producción viva + carrito funcional)

- **Producción verificada**: `anaquelito.vercel.app` responde y el catálogo lee productos reales de Supabase (las variables de entorno en Vercel ya quedaron configuradas).
- **Carrito de compras completo y funcional** (verificado en navegador con clics reales):
  - Botón "+ Agregar al carrito" en cada producto, con confirmación visual ("✓ Agregado").
  - Contador de artículos en el encabezado, visible también en celular.
  - Página `/carrito`: lista de artículos, controles de cantidad (+/−), quitar artículo, subtotal calculado y vaciar carrito.
  - El carrito se guarda en el navegador (localStorage): si el cliente cierra la pestaña, su pedido sigue ahí.
  - **Pedido por WhatsApp**: el botón de confirmar genera un mensaje con el pedido completo listo para enviarse al WhatsApp del negocio. Falta definir el número (variable `NEXT_PUBLIC_WHATSAPP_NUMERO`); mientras tanto el botón aparece deshabilitado con aviso honesto.
- Archivos nuevos: `src/componentes/carrito/` (contexto, botón de agregar, enlace con contador) y `src/app/(tienda)/carrito/page.tsx`.
- Se empezó a explorar una tipografía display personalizada (PODIUM Sharp) importada en `globals.css` — ver pendiente sobre su licencia.

## 2026-07-06 (auditoría y arreglos de móvil)

- **Bug crítico de móvil arreglado**: en la portada, la columna del carrusel se colapsaba a 0px de altura en pantallas chicas, haciendo que la tarjeta de descripción del producto se encimara sobre las estadísticas ("1.1M+ / 24 HRS / ~40%"). Causa: todos los hijos de esa columna son `position: absolute` y no aportan tamaño, así que flexbox la encogía a la fuerza. Se corrigió con `flex-shrink: 0` en las dos columnas del héroe.
- **Bug de encabezado en móvil arreglado**: el botón "Surtir mi negocio" se partía en dos líneas junto al ícono del carrito. Se ajustó tamaño de fuente y relleno en pantallas chicas.
- Verificado en viewport móvil (375×812): portada, catálogo, carrito y escáner — los cuatro se ven correctos ahora.
- **Nota de riesgo — no técnica, de propiedad intelectual**: el video de fondo de la portada (servido desde un CloudFront de terceros) muestra un personaje que parece ser una Tortuga Ninja (arma tipo sai, estética reconocible). Si ese video usa un personaje con derechos de autor/marca registrada (Paramount/Nickelodeon), no se puede usar en un sitio comercial sin licencia — es un riesgo legal real, no un detalle de estilo. Recomendación: reemplazarlo por contenido propio o un video de stock con licencia clara antes de lanzar. Ver pendiente en 06.

## 2026-07-06 (checkout con Mercado Pago)

- **Checkout de invitado construido**: `src/app/(tienda)/checkout/page.tsx` (formulario de negocio/dirección + resumen del pedido) y `src/app/(tienda)/checkout/confirmacion/page.tsx` (página de regreso después del pago).
- **Integración con Mercado Pago** (`src/lib/mercadopago/cliente.ts`, `src/app/api/checkout/route.ts`): al confirmar, se crea el cliente y el pedido en Supabase, y se genera una preferencia de pago de Mercado Pago; el comprador es redirigido a pagar y vuelve a `/checkout/confirmacion`.
- **Cliente admin de Supabase** (`src/lib/supabase/admin.ts`, llave `service_role`): necesario porque el checkout es "de invitado" — el negocio todavía no tiene cuenta ni sesión, así que el registro se crea desde el servidor a su nombre, saltándose RLS de forma controlada (solo en código de servidor, nunca en el navegador).
- El botón principal del carrito ahora dice "Ir a pagar con Mercado Pago" y lleva a `/checkout`; WhatsApp queda como opción secundaria si se configura el número.
- **Faltan las credenciales reales** para poder cobrar de verdad: `SUPABASE_SERVICE_ROLE_KEY` y `MERCADOPAGO_ACCESS_TOKEN` (ambas en `.env.local`, con instrucciones de dónde conseguirlas). Sin ellas el botón de pago falla con un error controlado, no con un crash.
- **Hallazgo de seguridad importante**: se encontró un token personal de GitHub (`ghp_...`) guardado en texto plano dentro de `.git/config` (URL del remoto), aparentemente de una sesión de trabajo en paralelo. Esto bloqueó por completo el uso de `git` en esta sesión ("Operation not permitted"). Se quitó el token del archivo de configuración para restaurar la URL limpia (`https://github.com/Garces-Studio/anaquelito.git`) y desbloquear git. **El token expuesto debe revocarse cuanto antes** en GitHub → Settings → Developer settings → Personal access tokens.
- **Verificación parcial**: se confirmó por `tsc --noEmit` (sin errores) y por los registros del propio servidor de Next.js que el código compila y el servidor arranca correctamente. La verificación visual en navegador quedó bloqueada esta ronda por presión de memoria en la máquina (183 MB libres de 16 GB en cierto punto) que dejó el navegador de vista previa en un estado roto; no se pudo confirmar visualmente el flujo de checkout todavía.

## 2026-07-07 (Tailwind roto, contenido equivocado en catálogo, llave service_role)

- **Mauricio pasó la llave `service_role` de Supabase** — ya guardada en `.env.local` (no se sube al repo). Mercado Pago sigue sin activarse a propósito: Mauricio pidió explícitamente no agregarlo todavía.
- **Bug grave encontrado y arreglado: Tailwind v4 mal configurado.** En algún momento se instaló `tailwindcss@4` (vía trabajo en paralelo) pero `postcss.config.js` seguía usando la sintaxis de Tailwind v3 (`tailwindcss: {}` en vez de `@tailwindcss/postcss`) y `globals.css` usaba las directivas viejas `@tailwind base/components/utilities`. Esto probablemente explica varios de los cuelgues silenciosos del servidor de desarrollo de sesiones anteriores. Se instaló `@tailwindcss/postcss`, se corrigió `postcss.config.js`, y se cambió `globals.css` a `@import "tailwindcss";` + `@config "../../tailwind.config.ts";` (sintaxis correcta de v4).
- **Contenido equivocado eliminado del catálogo.** `src/app/(tienda)/catalogo/page.tsx` tenía pegado un bloque hero completo de una plantilla de portafolio ajena ("Hi, I'm Max Reed!", testimonio falso de "Elena Brooks", cifra "10M+ Raised for startups", contacto `hi@maxreed.com`, videos de Ninja Turtle del mismo CloudFront sospechoso de antes). Se eliminó por completo, dejando solo la sección real del catálogo (que ya funcionaba bien: carga productos de Supabase, filtros, búsqueda, margen visible, botón de carrito).
- **Buena noticia encontrada de paso**: el video de fondo de la portada (`src/app/page.tsx`) ya no usa el CloudFront con el personaje con posible copyright — ahora usa `public/dulces-loop.mp4`, un archivo propio. El riesgo de propiedad intelectual de la portada quedó resuelto (el del catálogo se resolvió al borrar esa sección).
- **Verificado visualmente en navegador** (ya sin el problema de memoria de la ronda anterior): portada, catálogo completo (con fotos reales de producto) y escáner — los tres se ven y funcionan correctamente.

## 2026-07-07 (continuación — vitrina del catálogo con el estilo "glass" real)

- **Aclaración de Mauricio**: el bloque "Max Reed" no fue un error — es un molde de estilo (glass, fondo oscuro, marquesina, textura de ruido) que él quería reutilizar para el catálogo. El Home se queda tal cual (solo la animación/carrusel, sin catálogo). Se reconstruyó una vitrina con ese mismo lenguaje visual pero con contenido honesto de Anaquelito en vez del contenido de plantilla:
  - "Nuestro surtido" (video + 3 diferenciadores reales: envío 24h, margen visible, precio de mayoreo real).
  - "Nuestra promesa": frase de valor firmada por "Equipo Anaquelito" — **no** un testimonio de cliente inventado (eso no se fabrica).
  - Conteo de productos calculado en vivo (`productos.length`), no una cifra inventada tipo "10M+".
  - Marquesina con las categorías reales del catálogo (emoji), en vez de iconos de Figma/Framer.
  - Tarjeta de contacto con el correo real (`hola@anaquelito.mx`) y aviso honesto de "WhatsApp: próximamente" en vez de un teléfono inventado.
- El botón "Ver todo el catálogo" baja con scroll suave a la cuadrícula real de productos (que sigue funcionando igual: filtros, búsqueda, margen, carrito).
- Verificado en navegador (móvil): la vitrina se ve bien y el botón de scroll funciona.

## 2026-07-07 (continuación — tarjetas con brillo y fondo cálido en vez de negro)

- Mauricio pidió que el catálogo no tuviera fondo negro plano; que fuera cálido y vivo como el Home, y que las tarjetas de producto tuvieran un efecto de brillo con borde de gradiente (a partir de una referencia de tarjetas "feature card" con glow).
- **Fondo de la página**: cambió de `bg-[#0a0a0a]` (negro plano) a un degradado cálido oscuro (`from-[#2B1710] via-[#1A0F0A] to-[#0A0605]`), en el mismo tono que usa la portada.
- **Tarjetas de producto rediseñadas**: cada una tiene ahora un brillo difuminado detrás (`blur`) y un borde de gradiente de 2px (técnica padding-box), rotando entre 6 gradientes cálidos de marca (coral, ámbar, teal) según el índice del producto — no por categoría, para que se vea variado. El contenido (foto, título, precio, margen, botón de carrito) no cambió, solo el empaque visual.
- Verificado en navegador: el gradiente se aplica correctamente (confirmado por estilo computado) y se ve la transición coral→ámbar en el borde de cada tarjeta.

## 2026-07-07 (primer push exitoso a GitHub — se limpió el historial)

- **Se subieron por fin todos los commits pendientes a GitHub** (`Garces-Studio/anaquelito`, rama `main`), incluyendo el checkout con Mercado Pago, el arreglo de Tailwind, la limpieza del catálogo y la vitrina/tarjetas con brillo.
- **GitHub bloqueó el primer intento de push** (protección de secretos) porque el token de GitHub que se había encontrado expuesto días atrás (ver bitácora del 2026-07-06) quedó escrito en texto plano dentro de `docs/06-pendientes-y-decisiones.md` — un descuido al documentar el hallazgo de seguridad. Se reescribió el historial local (`git filter-branch`, solo sobre commits que nunca se habían subido, así que no afectó a nadie más) para redactar ese token en todos los commits donde aparecía, y ya se pudo subir todo.
- **Otro token quedó expuesto en texto plano en `.git/config`** (esta vez el nuevo, aparentemente guardado ahí por la integración de git de VS Code). Se limpió de la misma forma que la vez anterior antes de usarlo solo en el comando de push.
- **Pendiente para Mauricio**: revocar ambos tokens de GitHub cuanto antes desde [github.com/settings/tokens](https://github.com/settings/tokens) — el original (`ghp_UxdU...`) y, por precaución, también el más reciente (`ghp_xTrC...`) ya que estuvo brevemente en un archivo de configuración local.
