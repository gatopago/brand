# Historial del brandkit

## Iconos y movimiento — 2026-10-09

- Entran al kit, como material en revisión, la familia de 32 iconos (`11-iconos/`) y las seis animaciones de movimiento (`12-movimiento/`). Venían del laboratorio, que se retiró del repositorio; no tenían equivalente oficial y los iconos ya se usaban en las piezas de redes.
- Sus catálogos usan la tipografía y el símbolo oficiales en lugar de las copias del laboratorio. Los SVG no cambian.

## Retirada de la app — 2026-10-07

- El kit deja de reflejar o alimentar la app: se retiran `01-manual/producto-app.md`, `01-manual/integracion-frontend.md`, `02-logos/pwa/` (snapshot de iconos y manifiesto) y `05-colores/tokens-app.json`.
- Las variantes de estado sobre fondo claro (AA sobre Milk) pasan a [sistema visual](./01-manual/sistema-visual.md); son de marca, no de la app.
- Se eliminan el paquete npm `@gatopago/brand-assets` (`brandkit:frontend`) y la opción `--app-dir` de build y verificación. La app toma los recursos de las entregas ZIP.

## Revisión local — 2026-10-07

- Caminata: descartados los ensayos de recoloreado y reordenación. Se conserva la secuencia original de seis fotogramas, sin alterar dibujo, sombras, colores ni transparencias.
- Único ajuste: 130 ms por fotograma en vez de 110 ms; ciclo de 780 ms en vez de 660 ms, aproximadamente un 15 % más lento. Actualizadas la preview original, la HD y la galería.
- Las pruebas retiradas quedan fuera del kit y de la entrega, en el archivo local de `output/`. No se adoptan como recursos de marca.

## Revisión local — 2026-10-05

- Cola y Metí la pata: duplicación en espejo de las patas del lado izquierdo para formar el lado derecho, copiando RGBA sin interpolación. Sustituye el parche redondeado rechazado; conserva la cabeza, la cola móvil, los tamaños y los tiempos.
- Metí la pata: restaurada la punta de la oreja izquierda del primer frame desde la hoja original; corregido el límite de la máscara del rótulo.
- Pulida la unión de la cola con el cuerpo en las dos secuencias: cola original separada como una pieza completa, desplazada 12 px y colocada detrás de las patas, sin cortes entre filas ni recoloreado.
- Eliminada la costura clara de esa unión mediante composición alfa correcta en los bordes semitransparentes, sin modificar la silueta ni los colores opacos.
- Generación selectiva con `--only=cola,meti-la-pata` y prueba de reproducibilidad para preservar las otras 18 animaciones y las 14 poses/expresiones estáticas.
- Piezas aún candidatas a revisión artística. Sin publicación ni actualización de Figma.

## Sin publicar — 2026-10-03

- Personaje: retoques en las animaciones Cola, Metí la pata (una sola cola), Caminata (patas del fondo en sombra y sombra en el suelo) y Preparando el pago (oreja del primer fotograma). Las expresiones y poses estáticas no cambian.
- Promesa de marca: **Dinero sin fronteras. Siempre tuyo.** sustituye a «Tus dólares ya saben moverse» en la guía de voz y en la entrega externa. La filosofía se mantiene.

## 1.0.0-rc.1 — 2026-10-02

Candidata preparada para revisión, sin aprobación artística automática ni publicación.

- Política de estados: base vigente, propuestas, referencias internas y retirados.
- Cuatro composiciones horizontales SVG con texto trazado desde Recursive local, PNG y trazabilidad de la fuente.
- Tres símbolos monocromáticos y un símbolo para fondo oscuro, sin sustituir el original.
- Catálogo offline de botones, campos, diálogos, skeletons, carga, recibo y QR de ejemplo.
- Tres plantillas sociales SVG/PNG y una plantilla documental HTML A4; fuentes editables en el generador.
- Entregas interna y externa separadas; paquete npm local y privado para assets del frontend.
- Sharp actualizado a 0.35.5; lockfile fijado. Fontkit, wawoff2 y qrcode procesan trazados y ejemplos localmente.
- Originales, fuentes, frames y arte previo conservados. No se trabajó en la app ni en las diapositivas.

## Base 2026-09-28 / organización 2026-10-01

Identidad existente organizada en un kit reproducible. El repositorio se convirtió
en biblioteca de marca y recursos; la landing y la app permanecen en el checkout unificado.
El trabajo retirado se separó del ZIP y el personaje se mantuvo como candidato.
