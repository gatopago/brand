# Logos e iconos

Edición 2026-09-25 · Símbolo reconstruido como pixel art; favicons generados desde el símbolo.

| Carpeta | Entrega | Uso |
|---|---|---|
| `modelo/` | [simbolo.txt](./modelo/simbolo.txt) (30 × 23) y [simbolo-16.txt](./modelo/simbolo-16.txt) (16 × 16) | **Fuente editable**. Un carácter por bloque: `#` Ink, `o` Cat Fire, `s` Cat Shadow, `.` transparente |
| `simbolo/` | [gatopago.svg](./simbolo/gatopago.svg), [gatopago-16.svg](./simbolo/gatopago-16.svg), [gatopago.png](./simbolo/gatopago.png) (×8) | Símbolo principal, fondo transparente |
| `iconos-web/` | `favicon.svg`, `favicon.ico` (16/32/48), PNG 16/32/48 y `apple-touch-icon.png` | Identidad del sitio |
| [horizontal/](./horizontal/README.md) | Cuatro wordmarks SVG trazados y PNG | Propuestas pendientes de aprobación |
| [variantes/](./variantes/index.html) | Monocromáticas Ink, Milk y Cat Fire, y variante oscura | Propuestas; no sustituyen el símbolo principal |

## El símbolo

Es la cabeza del personaje original reconstruida sobre su rejilla real: 30 × 23 bloques, tres colores de marca, simétrica.

- **Escala**: siempre a múltiplos enteros para que cada bloque quede nítido: 30 × 23, 60 × 46, 90 × 69, 120 × 92… En navegación, ×1 o ×2. El ×1,5 queda descartado: solo es exacto en pantallas 2×.
- **Lienzo**: 32 × 32 con la cabeza en (1, 4), igual que el favicon de 32 px.
- **Tamaños pequeños**: por debajo de 30 px de ancho, usar la versión de 16 × 16. Mantiene orejas, ojos, nariz, boca y bigotes, sin rayas ni sombras.
- **Área libre**: al menos 3 bloques alrededor (1/10 del ancho).
- **Fondos oscuros**: el contorno Ink se pierde. Colocar el símbolo sobre un contenedor Milk.
- **No** rotar, estirar, añadir resplandor ni cambiar la expresión: las expresiones pertenecen al personaje, no al logo.

## Favicons

Los genera `npm run brandkit:build` desde los mapas; no se editan a mano.

| Archivo | Contenido |
|---|---|
| `favicon-16x16.png` | Versión 16 × 16 a 1 píxel por bloque |
| `favicon-32x32.png` | Símbolo completo a 1 píxel por bloque, centrado |
| `favicon-48x48.png` | Versión 16 × 16 a ×3 |
| `favicon.ico` | Las tres anteriores en un solo archivo |
| `favicon.svg` | Versión 16 × 16 en vector: nítida a 16, 32 y 48 px |
| `apple-touch-icon.png` | 180 × 180, **opaco** sobre Milk, símbolo a ×4 centrado (iOS pinta de negro la transparencia) |

El [catálogo principal](../index.html#logo) conserva la composición de base con texto vivo. Las nuevas composiciones [horizontales](./horizontal/README.md) usan contornos reales de Recursive, sin depender de fuentes instaladas. Ver la [galería de variantes](./variantes/index.html) y su trazabilidad antes de aprobarlas.

## Avatar para redes

[08-imagenes/avatar](../08-imagenes/avatar/README.md) contiene el mismo símbolo sobre Milk, como el apple-touch-icon: SVG con fondo y siete PNG cuadrados, de 180 a 2160 px. El de 180 es idéntico visualmente al apple-touch-icon; los tamaños de 1080 y 2160 conservan exactamente su composición. Los archivos son cuadrados y opacos; el margen protege las orejas y los bigotes al mostrarlos en un círculo.

