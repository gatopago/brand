# Personaje

**Estado: propuestas para revisión, pendientes de aprobación artística.** Se incluyen 14 ilustraciones y 20 animaciones recortadas de las hojas originales para comparar y revisar. No constituyen la versión final de pixel art.

**[Abrir la galería](./galeria.html).** Funciona sin conexión. Permite pausar las previews, abrir los 147 fotogramas completos y descargar cada pieza. Comienza sin movimiento si el sistema pide movimiento reducido.

## Lo que se entrega ahora

- `estaticos/`: 8 expresiones y 6 poses en PNG, al tamaño del recorte original.
- `animaciones/`: 20 previews WebP sin pérdida. Todas se reproducen en bucle para revisión.
- `animaciones/fotogramas/`: 147 fotogramas PNG; un lienzo constante dentro de cada secuencia.
- [Manifiesto del personaje](./animaciones/manifest.json): tamaños, procedencia de los recortes, hashes de las hojas, orden y duración de cada paso. `playback: once` describe el uso previsto en producto, no el bucle de la preview.
- `hd/`: 14 PNG estáticos, 147 fotogramas y 20 WebP ampliados por múltiplos enteros; lado mayor de al menos 2048 px. Se conservan proporciones, tiempos, RGB y alfa de los PNG originales, sin interpolación ni detalle inventado.
- `hojas/`: 20 hojas PNG con todos los fotogramas únicos de cada secuencia, con su lienzo completo. También tienen una versión HD en `hd/hojas/`.
- [Exportaciones](./exportaciones.json): dimensiones, escalas, hashes y procedencia de los 221 exports.
- Entrega completa: ejecutar `npm run brandkit:zip`. El ZIP general en `output/` incluye directamente los originales, HD, hojas y metadatos del personaje, sin un ZIP duplicado dentro del kit.
- [Avatar de GatoPago](../08-imagenes/avatar/README.md): logo SVG sobre Milk y siete tamaños PNG, separados del personaje.

Estas piezas conservan semitransparencias, variaciones de color y densidades de píxel de los originales. Por ejemplo, la expresión neutral original contiene 7.018 valores RGB visibles y 71.243 píxeles con alfa entre 1 y 254. Las versiones HD amplían esos mismos píxeles: no convierten los recortes en arte de paleta cerrada. El SVG entregado corresponde al logo y al avatar; todavía no se entregan vectores ni borde para fondo oscuro del personaje.

Para regenerar los recortes: `npm run brandkit:personaje`, después `npm run brandkit:build` y `npm run brandkit:verify`. El build crea los HD, las hojas, la galería y el ZIP de avatares. El ZIP de entrega general se genera por separado con `brandkit:zip`. Reutiliza únicamente exports cuyos hashes y receta siguen coincidiendo con las fuentes. El generador comprueba las entradas y prepara una carpeta temporal antes de sustituir las piezas actuales; conserva este README.

Para una revisión limitada, usar `npm run brandkit:personaje -- --only=cola,meti-la-pata` antes del build. Esta opción conserva las poses estáticas y las demás animaciones byte a byte. Los tiempos y tamaños de las dos secuencias no cambian.

- El gato acompaña, orienta y reacciona. **No es el logo**: el símbolo de [02-logos](../02-logos/README.md) no cambia.
- No tiene nombre público. En textos se habla de «el gato» o de la acción que realiza.

## Encargo para rehacerlo

### Diseño de referencia

El diseño que se conserva es el de las ilustraciones originales de [06-originales](../06-originales/README.md):

| Archivo | Contenido |
|---|---|
| `spritesmeli1.png` | Hoja de expresiones de la cabeza |
| `spritesmeli2.png` | Hoja de poses con cuerpo |
| `d54017bf-….png` | Cabeza de referencia |
| Cinco hojas `Image Aug 19, 2026…` | Secuencias de animación |

Hay que respetar:
- las proporciones;
- las orejas grandes con interior Cat Shadow;
- las tres rayas en la frente;
- los ojos negros separados;
- la boca «ω»;
- dos bigotes por lado;
- la cola anillada;
- el pelaje atigrado.

### Piezas

| Grupo | Piezas | Uso |
|---|---|---|
| Expresiones (cabeza) | Neutral, contento, atento, cauto, curioso, emocionado, somnoliento, asomado | Estados y reacciones |
| Poses (cuerpo) | Sentado, mensajero con caja, empujando un carrito, con QR, asomado tras una tarjeta, durmiendo | Bienvenida, envío, procesamiento, cobro, descubrimiento, espera |
| Animaciones | Parpadeo, oreja, ojos, reposo sentado, cola, siesta, asomarse, «metí la pata», salto feliz, caminata, preparando pago, comprobante, reparar rail, intercambio, creciendo, tarjeta, linterna, saludo, mantenimiento, seguridad | Acompañar estados del producto |

### Requisitos técnicos para la versión final

- **Pixel art real:** un color por píxel, sin antialias, semitransparencias, degradados ni tramas.
- **Contorno Ink continuo** y de grosor constante.
- **Paleta cerrada:**

  | Uso | Colores |
  |---|---|
  | Pelaje y línea | Ink #0B0B0F, Cat Fire #F85239, Cat Shadow #CF3433, Cat Deep #9F292E |
  | Brillo y papel | Milk #FFF8F0 |
  | Objetos | Crema tarjeta #FCECDD, caja #FAB23A / #DC7C17 / #93421A, rail #434F68, lengua #F0908A |

- **Una sola densidad de píxel** en todas las piezas. Lienzos sugeridos: cabezas de 64 × 64, poses de 96 × 96 con el suelo en la misma fila, y animaciones de 144 × 96 con un punto de apoyo común.
- **Animación:** 4–8 frames por ciclo, 80–150 ms por frame (nunca menos de 50 ms), sin frames repetidos.
- **Entrega:**
  - PNG a ×1 (tamaño del lienzo), ×4 y ×8, y SVG;
  - versión para fondos oscuros con borde Milk de 1 píxel;
  - en animaciones, frames sueltos y una hoja por secuencia, con los tiempos de cada frame.

### Uso en producto

Las reglas de uso están en [movimiento y componentes](../01-manual/movimiento-y-componentes.md#uso-del-personaje):
- una sola animación ambiental por pantalla;
- nunca encima de datos, confirmaciones o alertas;
- celebrar solo estados confirmados;
- el QR dibujado no es un QR de cobro.

### Aprobación pendiente

La versión final la aprueba la persona responsable de la marca, pieza a pieza, junto al original. La verificación técnica de esta entrega comprueba archivos y tiempos; no sustituye esa aprobación ni acredita calidad de pixel art en los recortes.
