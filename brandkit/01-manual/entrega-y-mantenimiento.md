# Entrega, procedencia y mantenimiento

Versión 1.0.0-rc.1 · Preparación 2026-10-02 · Fuentes versionadas y generación reproducible.

## Fuentes

| Grupo | Origen |
|---|---|
| Símbolo y favicons | Fuente versionada: mapas en `brandkit/02-logos/modelo/`; el build genera el SVG, los PNG, el ICO y el apple-touch-icon |
| Nuevos wordmarks y variantes | Recetas en `herramientas/brandkit/design-files.mjs`, mapa del símbolo y Recursive WOFF2 local; propuestas en revisión |
| Componentes y plantillas | Recetas en `herramientas/brandkit/design-files.mjs`; copy social editable en `brandkit/10-plantillas/modelo.json`; HTML, SVG trazados y previews se regeneran desde ahí |
| Personaje | Propuestas para revisión en `brandkit/03-personaje/`, generadas desde `06-originales/`. El arte final sigue pendiente. El trabajo retirado está en `brandkit/descartado/`, fuera del ZIP |
| Dibujos originales | Fuente única versionada: `brandkit/06-originales/`; sin duplicados en la raíz |
| Fuente tipográfica | Fuente versionada: `brandkit/04-tipografia/recursive/`, con licencia y versión de origen |
| Paleta y tokens | Fuente canónica: `brandkit/05-colores/tokens.json`; los exports CSS, CSV, GPL y contraste se generan desde ese JSON |
| Narrativa y planes | `estrategia/vigente/` y `estrategia/planes/` de este repositorio |
| Imágenes sociales | Avatar generado desde el símbolo sobre Milk; `brandkit/08-imagenes/open-graph/og.png` es la fuente versionada. Otras piezas están en `contenido/` |

Estas carpetas del kit son fuentes oficiales, no copias descartables. Los manuales también se editan dentro de `brandkit/`. Las copias de planes se regeneran desde `estrategia/`: no editarlas como única fuente. El código de la antigua landing y sus snapshots se retiraron; el kit no depende de un frontend.

Los PNG, WebP, JPG e ICO copiados de otras fuentes se conservan byte a byte. En los snapshots SVG solo se normalizan saltos de línea a LF, sin cambiar el dibujo. El build del kit no depende de `output/`, de imágenes sueltas ni del checkout de la app.

## Derechos y distribución

- Recursive incluye su licencia SIL Open Font License 1.1 y metadatos de origen. Conservarla al redistribuir la fuente.
- La licencia tipográfica no cubre el logo, la mascota, las capturas ni el contenido de marca.
- No se asigna una licencia Creative Commons o comercial a los dibujos: este kit no acredita por sí solo la titularidad ni amplía permisos sobre el arte aportado.
- Antes de dar acceso público al paquete, revisar derechos y contexto de las capturas y documentos de referencia. Esta entrega es para trabajo y transferencia de marca, no una publicación automática.

## Inventario

`manifest.json` contiene un registro por archivo: ruta, peso, huella SHA-256 y procedencia. Para imágenes compatibles también registra formato, dimensiones, transparencia y páginas/frames.

El propio manifiesto y `CONTROL-DE-CALIDAD.md` quedan fuera del listado de hashes para evitar una autorreferencia y permitir registrar la verificación final. Los snapshots de texto generados normalizan saltos de línea a LF; los recursos canónicos se preservan. No se inserta la hora del build en el inventario: con las mismas fuentes, el resultado es idéntico. `.gitattributes` preserva los bytes del kit al clonar.

## Actualizar sin crear otra versión paralela

Desde un clon limpio, con Node compatible con `package.json`:

```sh
npm ci
npm run brandkit:verify
npm run brandkit:build
npm run brandkit:verify -- --sources
npm run brandkit:test
npm run brandkit:zip
npm run brandkit:external
```

`npm ci` instala las dependencias fijadas en el lockfile. Ignorar `node_modules/` es correcto; no se requiere versionarlo. La tipografía del kit se toma de su carpeta canónica. Sharp procesa imágenes, fflate empaqueta ZIP, fontkit/wawoff2 convierten el WOFF2 local en contornos y qrcode genera el ejemplo de QR. No se requiere Astro, Tailwind ni un paquete de fuentes. La descompresión de la fuente sucede en memoria; no se entrega un nuevo TTF/OTF.

1. Editar la fuente indicada en la tabla; mantener la licencia al actualizar una fuente tipográfica.
2. Ejecutar el build. Primero comprueba entradas y rechaza enlaces simbólicos; después prepara y valida una copia temporal. Solo tras la validación sustituye el kit, con restauración del anterior si falla el intercambio. Un error de entrada o generación no sobrescribe el kit actual.
3. `brandkit:verify` comprueba inventario exacto, hashes, enlaces y fuentes locales sin consultar fuentes externas. En el símbolo y los favicons exige pixel art exacto: cada archivo idéntico a su mapa, solo colores de la paleta. En las propuestas del personaje verifica 14 estáticos, 20 secuencias, lienzos, fotogramas, versiones HD, hojas y tiempos WebP. En los avatares verifica fondo opaco, símbolo y margen circular. También admite `--kit <carpeta>` para validar un paquete extraído fuera del checkout.
4. `brandkit:verify -- --sources` añade la comparación de los snapshots con `estrategia/`. Es opcional, no una dependencia del paquete entregado.
5. Revisar y aprobar cualquier retirada de assets. El build no elimina recursos canónicos por considerarlos sobrantes.

No borres `brandkit/` para regenerarlo: contiene fuentes versionadas. Si falta un original, recupera el archivo correspondiente desde Git. Los tests cubren entradas ausentes, fallos posteriores al preflight, builds idénticos, fuentes CRLF y LF, el ZIP sin material retirado y la conservación del ZIP previo cuando falla una validación.

## ZIP de entrega

`npm run brandkit:zip` crea `output/gatopago-brandkit-interno-1.0.0-rc.1.zip`, tras validar el kit. Incluye propuestas claramente identificadas, documentación y material de QA. No empaqueta `descartado/`, que permanece versionada solo para consulta interna.

El ZIP tiene un manifiesto propio con `profile: delivery` y los hashes de sus archivos reales. Se valida antes de reemplazar el ZIP anterior y se genera con metadatos de fecha fijos. Puede abrirse sin conexión. El catálogo y sus assets siguen incluidos; los planes de referencia permanecen identificados como contexto, no como assets de producción.

`npm run brandkit:external` crea `output/gatopago-brandkit-externo-1.0.0-rc.1.zip`.
Usa una lista positiva en [release.json](../release.json): solo identidad base vigente,
con un manual breve y catálogo propios. Excluye personajes en revisión, QA, secuencias
problemáticas, originales, propuestas de logos/plantillas y planes internos. Se verifica
primero todo el kit de origen, incluidos sus píxeles; el ZIP externo se verifica por
inventario, hashes, política y enlaces, sin atribuirle las pruebas de personaje ausente.
No equivale a autorización para publicarlo ni a una licencia sobre la marca.

El template editable del catálogo es `herramientas/brandkit/catalogo.html`; el de la galería, `herramientas/brandkit/galeria-personaje.mjs`. Los exports HD y los avatares se generan con `exportaciones-personaje.mjs` y `avatar.mjs`. No se recrea el ZIP duplicado del personaje retirado del kit: sus archivos están incluidos directamente en el ZIP general de `output/`. Los manuales cortos dentro de `01-manual/` se editan directamente; no los sobreescribe el generador. Para actualizar los recortes, ejecutar `brandkit:personaje` antes del build. Ese paso usa una carpeta temporal y no sustituye la entrega si falla la generación.

## Repositorio de marca

Desde el 1 de octubre de 2026 este checkout almacena identidad, recursos y estrategia, no una landing ni una app. El kit no sincroniza ni empaqueta nada para el frontend: la app y la landing viven en su propio repositorio y toman los recursos de las entregas de `output/`. Los WebP de la landing anterior quedan en `descartado/mascota-2026-09/qa/antes/estaticos/` (la copia de `archivo/personaje-web/` se retiró el 7 de octubre de 2026), la portada en `contenido/plantillas/` y las presentaciones en `comercial/pitch/`, sin cambios artísticos.

## Límites de esta edición

- No restaura los assets sociales borrados previamente en el árbol de trabajo.
- Los wordmarks trazados y logos monocromáticos son propuestas nuevas en revisión. No se entregan conversiones CMYK/Pantone certificadas.
- Incluye fuentes WOFF2 para web, no una distribución TTF/OTF de escritorio.
- No prueba ejecución financiera ni disponibilidad comercial.
- No elimina originales canónicos: los duplicados de la raíz se retiraron tras verificar sus hashes.
- No implementa el kit en pantallas.
- Incluye ilustraciones y animaciones del personaje como propuestas de revisión, sin aprobación artística ni certificación de pixel art ([03-personaje](../03-personaje/README.md)). La versión anterior de septiembre de 2026 se retiró a `descartado/`.
