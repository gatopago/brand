# Movimiento de caminos

**Estado:** en revisión. Las reglas generales están en [movimiento y componentes](../01-manual/movimiento-y-componentes.md); `09-componentes/` usa dos animaciones CSS equivalentes a ruta y espera.

Seis SVG nativos, sin imágenes raster ni bibliotecas externas. Ruta, conexión, confirmación, intercambio, espera y entrada. Las variantes `reducido/` no contienen animaciones. Las variantes animadas respetan `prefers-reduced-motion` por CSS.

`index.html` muestra una animación a la vez. Permite pausar, reiniciar y elegir movimiento reducido. Duraciones: ruta 2400 ms; conexión 2800 ms; confirmación 650 ms una vez; intercambio 2600 ms; espera 1800 ms; entrada 280 ms una vez.

Mover con transform y opacidad; evitar sombras, filtros y posiciones que alteran el layout en cada fotograma. El trazo animado tiene geometría constante. No convertir una carga indeterminada en un porcentaje ficticio. No disparar confirmación antes de la respuesta del sistema. Una sola animación ambiental importante por pantalla.

En flujos financieros el texto de estado es la fuente de información; la ilustración no confirma liquidación ni ofrece tiempo estimado. El botón Pausar del catálogo solo pausa CSS: no simula el estado de ninguna operación.

## Continuidad de los loops

El centro del bloque de ruta parte de x=24 y llega a x=280, los extremos reales del rail. El reinicio ocurre con opacidad cero; el bloque no salta de vuelta mientras es visible. Conexión e intercambio usan el mismo criterio. Las variantes reducidas quedan visibles y no contienen animaciones.

