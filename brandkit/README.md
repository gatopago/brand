# GatoPago · Brandkit

Versión: **1.0.0-rc.1** · Preparada el 2 de octubre de 2026.
Estado: candidata de entrega para revisión, sin publicación.
- Listos: logo, color, tipografía y manual.
- Para revisión: 14 ilustraciones y 20 animaciones del personaje, recortadas de los originales. [Abrir galería](./03-personaje/galeria.html). No son arte final aprobado.
- Nuevas propuestas: [logos trazados y variantes](./02-logos/variantes/index.html), [componentes](./09-componentes/index.html) y [plantillas](./10-plantillas/index.html). No reemplazan la base vigente.

**Empieza por [el catálogo visual](./index.html).** Ábrelo en un navegador: funciona sin conexión y carga las fuentes locales.

La marca pública es **GatoPago**. El kit organiza la identidad vigente con los dominios `gatopago.com` y `app.gatopago.com`, y no despliega nada.

## Encuentra lo que necesitas

| Carpeta | Contenido | Para qué usarla |
|---|---|---|
| [01-manual](./01-manual/identidad-y-voz.md) | Identidad y voz, sistema visual, componentes y movimiento, entrega y mantenimiento | Diseñar y escribir con criterio consistente |
| [02-logos](./02-logos/README.md) | Símbolo en pixel art (SVG y PNG, versión de 16 px, mapas editables), favicons e iconos web | Firma de marca e iconos de navegador |
| [03-personaje](./03-personaje/README.md) | Galería descargable, 14 PNG, 20 WebP, 147 fotogramas completos, hojas y versiones HD | Revisar y descargar las propuestas |
| [04-tipografia](./04-tipografia/README.md) | Recursive Variable: 4 WOFF2, CSS y licencia | Tipografía web local |
| [05-colores](./05-colores/README.md) | HEX, RGB, CSS, JSON, CSV, GPL, contraste | Diseño e implementación |
| [06-originales](./06-originales/README.md) | Ilustraciones originales, sin alteraciones | Referencia del diseño del gato |
| [07-referencias](./07-referencias/README.md) | Narrativa y planes extensos | Contexto y trazabilidad |
| [08-imagenes](./08-imagenes/README.md) | Avatar SVG sobre Milk, PNG de 180 a 2160 px e imagen Open Graph | Perfiles de redes y comunicación de marca |
| [09-componentes](./09-componentes/README.md) | Catálogo offline de estados, diálogos, skeletons, recibo y QR | Referencia visual, no librería integrada |
| [10-plantillas](./10-plantillas/README.md) | Social cuadrada, vertical, portada y documento A4 | Piezas de ejemplo, editables desde su fuente |
| `descartado/` | Trabajo retirado: la mascota en pixel art de septiembre de 2026 | Solo consulta interna; no se entrega |

## Manual de lectura rápida

1. [Identidad y voz](./01-manual/identidad-y-voz.md): qué representa la marca y cómo habla.
2. [Sistema visual](./01-manual/sistema-visual.md): logo, color, tipografía y composición.
3. [Movimiento y componentes](./01-manual/movimiento-y-componentes.md): reglas de experiencia.
4. [Entrega y mantenimiento](./01-manual/entrega-y-mantenimiento.md): procedencia, derechos y actualización.
5. [Aprobación y versiones](./01-manual/aprobacion-y-versiones.md): qué está vigente, qué requiere revisión y cómo cerrar 1.0.0.

## Qué tiene autoridad aquí

- **Archivos entregados y valores visuales observados:** este manual y el inventario de esta edición.
  - La fuente editable de la paleta es `05-colores/tokens.json`, dentro del kit.
- **Narrativa y estrategia:** el índice editorial de `estrategia/` en este repositorio de marca. Las copias de `07-referencias/` son contexto fechado.
- **Capacidades y disponibilidad del producto:** la evidencia vigente del producto publicado. Ningún plan de marca acredita que una funcionalidad esté desplegada.

## Antes de entregar a otra persona

Para regenerar desde este repositorio: `npm ci`, `npm run brandkit:build` y `npm run brandkit:verify`.

Para revisión interna: `npm run brandkit:zip`. Para compartir solo la base vigente: `npm run brandkit:external`. Los archivos se generan en `output/`; ninguna orden publica ni integra recursos. Ver [política de aprobación](./01-manual/aprobacion-y-versiones.md) y [historial](./CHANGELOG.md).

- Comparte el ZIP completo: mover solo `index.html` rompe las rutas de imágenes y fuentes.
- [CONTROL-DE-CALIDAD.md](./CONTROL-DE-CALIDAD.md) explica el alcance de la verificación.
- [manifest.json](./manifest.json) registra archivo, procedencia, peso, SHA-256 y metadatos de imágenes.
- La licencia OFL cubre la fuente, no el logo ni los dibujos. Este kit no concede una licencia pública de reutilización de la marca.
- No se incluyen contratos privados, credenciales ni los assets sociales eliminados del repositorio.
