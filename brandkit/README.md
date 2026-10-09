# GatoPago · Brandkit

Versión **1.0.0-rc.1**, candidata para revisión. **Empieza por [el catálogo visual](./index.html)**: se abre en el navegador y funciona sin conexión.

- **Listo:** logo, color, tipografía y manual.
- **En revisión:** el personaje ([galería](./03-personaje/galeria.html)), variantes del logo, componentes, plantillas, iconos y movimiento.

| Carpeta | Contenido |
|---|---|
| [01-manual](./01-manual/identidad-y-voz.md) | Identidad y voz, sistema visual, movimiento y componentes, mantenimiento y aprobación |
| [02-logos](./02-logos/README.md) | Símbolo en pixel art (SVG, PNG, 16 px, mapas editables), favicons, wordmarks y variantes |
| [03-personaje](./03-personaje/README.md) | El gato: 14 poses, 20 animaciones, fotogramas, hojas y versiones HD |
| [04-tipografia](./04-tipografia/README.md) | Recursive: WOFF2, CSS y licencia |
| [05-colores](./05-colores/README.md) | Paleta en HEX, RGB, CSS, JSON, CSV, GPL y contraste. Se edita `tokens.json` |
| [06-originales](./06-originales/README.md) | Ilustraciones originales del gato, sin tocar |
| [08-imagenes](./08-imagenes/README.md) | Avatar sobre Milk (180 a 2160 px) e imagen para compartir enlaces |
| [09-componentes](./09-componentes/README.md) | Estados, diálogos, recibo y QR de referencia |
| [10-plantillas](./10-plantillas/README.md) | Post cuadrado, historia, portada y documento A4 |
| [11-iconos](./11-iconos/README.md) | 32 iconos SVG; los usa el generador de redes |
| [12-movimiento](./12-movimiento/README.md) | Seis animaciones SVG y sus versiones reducidas |

## Regenerar y entregar

```sh
npm ci
npm run brandkit:build      # regenera catálogo, exports y manifest.json
npm run brandkit:verify     # comprueba inventario, hashes y enlaces
npm run brandkit:zip        # output/: ZIP interno con todo el kit
npm run brandkit:external   # output/: ZIP solo con la identidad aprobada
```

- Comparte el ZIP completo: mover solo `index.html` rompe las rutas.
- La licencia OFL cubre la fuente, no el logo ni los dibujos.
- Detalles en [mantenimiento](./01-manual/entrega-y-mantenimiento.md) y [aprobación](./01-manual/aprobacion-y-versiones.md).
