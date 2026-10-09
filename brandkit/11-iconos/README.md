# Iconos de caminos

**Estado:** en revisión, pendiente de aprobación. Movido desde el laboratorio el 9 de octubre de 2026: es la única familia de iconos de la marca y la usa el generador de redes (`herramientas/brandkit/social.mjs`). Hay una propuesta de mejora de cuatro iconos en `estrategia/auditorias/iconos-2026-10/` del repositorio de marca.

32 iconos originales SVG, retícula de 24 × 24, contorno de 2 unidades, extremos cuadrados y esquinas sin redondear. No son emojis ni logos de activos.

Abrir `index.html`: buscar, filtrar, alternar fondos y comprobar tamaños de 16, 24, 32 y 48 px. El color usa `currentColor`; dar al control un nombre accesible y ocultar el icono cuando acompañe una etiqueta. El tamaño del icono no es el tamaño del área táctil: mantener al menos 44 × 44 px para el botón.

Cobrar: flecha hacia una cuenta. Enviar: salida diagonal. Cambiar: dos direcciones. Escanear: encuadre. Seguridad: escudo. Los símbolos de riesgo requieren texto, no solo color. En 16 px la cuadrícula escala a fracciones: preferir 24 px para QR y detalles finos; comprobar visualmente antes de integrar.

Uso inline: insertar el SVG en un botón con texto. Uso sprite: `href="sprite.svg#gp-enviar"`; algunos navegadores restringen referencias externas desde file://, por eso la galería incluye los SVG inline.
