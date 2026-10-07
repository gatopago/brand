# Control de calidad

Versión actual: **1.0.0-rc.1** · Preparación comprobada el 2 de octubre de 2026.

## Resultado actual

Kit preparado para revisión: siete guías, identidad base, ocho variantes propuestas
de logo (cuatro horizontales y cuatro símbolos), catálogo de componentes y cuatro
plantillas. No se aprobó automáticamente arte nuevo ni se integró nada al frontend.

| Comprobación actual | Resultado |
|---|---|
| Inventario completo | 1.195 entradas; 1.197 archivos con manifiesto y este registro |
| Integridad y enlaces | Hashes, inventario exacto, estados de release, 1.453 enlaces locales y tres documentos de origen; sin fallos |
| Pipeline y entregas | 19 resultados de pruebas aprobados; incluye builds idénticos, falla segura ante copy demasiado ancho y ZIP interno/externo extraídos |
| Entrega interna | 511 entradas, 513 archivos; conserva propuestas y QA, excluye 684 archivos retirados |
| Entrega externa | 33 assets de base, dos documentos de entrega y manifiesto; sin propuestas, personaje, originales ni planes internos |
| Wordmarks | Cuatro SVG con contornos reales, sin elementos text ni fuentes externas; PNG transparentes y trazabilidad del WOFF2 local |
| Conservación | 1.024 archivos gráficos/tipográficos previos comparados: 1.020 idénticos byte a byte; tres PNG de favicon cambian codificación pero conservan RGBA exacto; el ICO contiene esos mismos PNG |
| Herramientas | Sharp 0.35.5 y dependencias fijadas; `npm audit` informa cero vulnerabilidades conocidas en esta instalación |

### Revisión visual actual

Navegador real sin servidor, con archivos locales y Recursive cargada desde el kit.
Componentes comprobados a 320, 390 y 1.280 px; catálogo principal, variantes y A4
a 320 y 1.280 px, colección de plantillas a 320 px. Sin desbordamiento horizontal
ni imágenes rotas en estas vistas. Se inspeccionaron screenshots y PNG de las piezas.

El diálogo de revisión abre, cierra con Escape y devuelve el foco al botón.
El control de pausa detiene skeletons y rail. La preferencia de movimiento reducido,
emulada en el navegador, detiene las animaciones incluso al cambiarla sin recargar.
El rail llega exactamente a ambos extremos (inicio 42 px y final 263 px en la
medición móvil de 320 px). No representa un porcentaje de operación financiera.
Se comprobó el CSS print de A4, no una impresión física ni un perfil de imprenta.

El QR de ejemplo codifica `https://gatopago.com`, conserva cuatro módulos de margen
y no solicita un pago. Se revisaron sus exports y carga, no su lectura con un
teléfono físico. Los frames existentes no se corrigieron artísticamente en esta
preparación; mantienen su condición de candidatos.

### Límites de cierre

Falta la aprobación visual de Daniel de las propuestas; [política y checklist](./01-manual/aprobacion-y-versiones.md).
No se
probó la app, no se reanudó el pitch deck, no se publicaron paquetes, no se hizo
commit/push ni despliegue. Los ZIP de fechas anteriores en `output/` son archivos
locales históricos, no las entregas de esta candidata.

## Registro histórico de la base — 2026-09-28 / 2026-10-01

### Resultado de aquella revisión

El kit principal tiene símbolo, favicons, paleta, tipografía local con licencia y cinco guías. Las propuestas nuevas del personaje se incluyen para revisión, pendientes de aprobación artística. No se considera terminado el arte final del personaje.

Al retomar el trabajo, `brandkit:verify` fallaba porque la galería y sus piezas no estaban inventariadas. El catálogo y los manuales afirmaban que no se entregaba arte del personaje. Se actualizó el inventario, se corrigió esa contradicción y se enlazó la galería desde el catálogo.

## Comprobaciones técnicas

Comandos: `npm run brandkit:build`, `npm run brandkit:verify -- --sources`, `npm run brandkit:test` y `npm run brandkit:zip`.

| Comprobación | Alcance |
|---|---|
| Inventario | 1.156 entradas, con tamaños y SHA-256; 1.158 archivos contando el manifiesto y este registro |
| Enlaces | Rutas del catálogo, galería, manuales, tipografía y manifiesto del personaje |
| Fuentes actuales | 3 documentos comparados con este repositorio de marca |
| Símbolo y favicons | PNG fieles a los mapas, tres tamaños dentro del ICO y apple-touch opaco |
| Personaje | 14 PNG estáticos, 20 secuencias y 147 fotogramas únicos; lienzos y duraciones coinciden con los WebP |
| Exportaciones HD | 14 ilustraciones, 147 fotogramas y 20 WebP con lado mayor de al menos 2.048 px; ampliación entera que conserva los valores RGBA de los PNG |
| Hojas de secuencia | 20 PNG completos y sus 20 versiones HD; los fotogramas conservan todo su lienzo |
| Avatar para redes | SVG del símbolo original sobre Milk y siete PNG opacos de 180 a 2.160 px; el logo cabe en el recorte circular y la versión de 180 px coincide con apple-touch-icon |
| Originales | Hashes de las hojas utilizadas, sin modificar los ocho originales |
| Descargas de la galería | Piezas originales/HD individuales y ZIP de avatares con 10 archivos; el ZIP duplicado del personaje se retiró |
| ZIP de revisión | 474 archivos, 472 entradas en su propio inventario; excluye `descartado/` |

El inventario no se incluye en su propio listado. Este registro queda fuera de los hashes para permitir documentar la verificación final. Los enlaces antiguos del material retirado no se revisan.

`brandkit:test` pasa sus 14 resultados: verificación aislada, originales ausentes, conservación del arte ante entradas ausentes, deriva en los tiempos aunque se actualicen los hashes, fallos de generación, build sin archivos ignorados, builds idénticos, preservación RGBA en HD y del lienzo en las hojas, reparación de una exportación HD corrupta, comparación opcional de fuentes, equivalencia CRLF/LF, ZIP validado tras extraer y conservación del ZIP anterior ante un fallo. La prueba de entrega comprueba directamente los 147 fotogramas HD del ZIP general y abre el ZIP de avatares para verificar su contenido.

## Revisión visual

Se revisaron las 14 ilustraciones y una hoja de contacto con los 147 fotogramas. En el navegador local se comprobaron el catálogo y la galería en escritorio y a 390 y 320 px, sin desbordamiento horizontal. La galería ampliada contiene 20 grupos y 147 PNG estáticos completos, con enlaces de descarga original y HD. Se comprobó que «Ver fotogramas» abre su secuencia, que sus imágenes cargan y que la descarga del ZIP de avatares inicia correctamente. Se revisaron las vistas cuadrada y circular del avatar en móvil. Recursive carga desde los archivos locales. El botón de pausa cambia las 20 previews por sus primeros fotogramas; la galería incorpora el tratamiento de movimiento reducido. No se probó cambiando la preferencia del sistema.

## Pendientes concretos

- **Personaje:** los recortes conservan semitransparencias y variaciones de color de las hojas. La expresión neutral contiene 7.018 valores RGB visibles y 71.243 píxeles semitransparentes. No cumple la paleta cerrada ni la retícula uniforme del encargo. Se entregan escalas enteras HD y hojas de secuencia; amplían el original sin inventar detalle. Faltan aprobación pieza a pieza, el arte vectorial del personaje y el borde para oscuro. Ver [estado del personaje](./03-personaje/README.md).
- **Wordmark en la base:** la composición era texto vivo. En 1.0.0-rc.1 se añadieron trazados como propuestas, aún sin aprobación para imprenta.
- **Implementación:** este repositorio no contiene un frontend ni snapshots de la app (retirados el 7 de octubre de 2026). La marca aplicada se verifica en el repositorio de la app y la landing.

Esta revisión cierra la integridad y la organización de la entrega local. No publica cambios, no reemplaza la aprobación artística y no evalúa ejecución financiera ni seguridad de la app. El PDF y los ZIP anteriores de `output/` no forman parte del paquete actualizado.

## Retirada de la landing — 1 de octubre de 2026

Este checkout queda dedicado a marca, recursos y documentación. Se retiraron
páginas, componentes y estilos del sitio, `public/`, configuración Astro/Vercel,
analítica/SEO y comandos de desarrollo/preview. También se retiraron los snapshots
del código anterior dentro del kit y los generadores sociales que usaban otra
versión del logo. No se modificó el frontend unificado ni se publicaron cambios.

La paleta conserva todos sus valores y ahora se edita en `05-colores/tokens.json`.
El build usa esa fuente y el Open Graph canónico del kit. Solo depende de Sharp
y fflate; las fuentes WOFF2 y su licencia están versionadas. Knip revisa los
scripts activos sin incorporar herramientas históricas ni skills como código
de producto; no detecta dependencias o archivos activos sin uso.

Los 14 WebP utilizados por la landing, iconos de terceros, portada de X y decks
existentes quedaron en `recursos/`. Se compararon 453 archivos gráficos y
tipográficos con la copia previa: todos permanecen idénticos byte a byte.
El material del sitio retirado tiene una copia local recuperable fuera del repo.

Se respetó la eliminación previa del ZIP duplicado del personaje. El paquete
general contiene sus originales, HD, hojas y metadatos directamente. No se
restauró ese archivo ni se cambió el diseño de las piezas.

En Windows se desactivó la caché nativa de Sharp en el verificador para no
retener archivos abiertos al reemplazar y limpiar las carpetas temporales.

### Aviso de dependencia de la revisión anterior — resuelto en esta candidata

En aquella revisión, `npm audit` detectó una vulnerabilidad alta en Sharp 0.34.5 por bibliotecas
nativas heredadas (GHSA-f88m-g3jw-g9cj y GHSA-rgj7-g3m4-5g8c). Se conservó
la versión y el lockfile reproducible; no se ejecutó `audit fix --force`.
La actualización se realizó a 0.35.5 en esta preparación, con pruebas de RGBA,
tiempos y exports. La auditoría de dependencias actual informa cero avisos conocidos.
Procesar solo originales conocidos sigue siendo una precaución razonable;
la integridad del kit no equivale a una auditoría de seguridad de sus herramientas.
