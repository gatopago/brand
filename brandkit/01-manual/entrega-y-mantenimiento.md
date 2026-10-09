# Mantenimiento y entrega

## Qué se edita y dónde

| Grupo | Fuente |
|---|---|
| Símbolo y favicons | Mapas en `02-logos/modelo/`; el build genera SVG, PNG, ICO y apple-touch-icon |
| Wordmarks, variantes, componentes y plantillas | Recetas en `herramientas/brandkit/design-files.mjs`; copy de plantillas en `10-plantillas/modelo.json` |
| Personaje | Generado desde `06-originales/` con `npm run brandkit:personaje` |
| Tipografía | `04-tipografia/recursive/`, con su licencia |
| Paleta | `05-colores/tokens.json`; CSS, CSV, GPL y contraste se generan desde ahí |
| Iconos y movimiento | SVG en `11-iconos/svg/` y `12-movimiento/` |
| Catálogo y galería | `herramientas/brandkit/catalogo.html` y `galeria-personaje.mjs` |
| Manuales | Se editan directamente en `01-manual/` |

Las imágenes copiadas se conservan byte a byte; los textos generados usan saltos de línea LF. No borres `brandkit/` para regenerarlo: contiene fuentes versionadas.

## Comandos

```sh
npm ci
npm run brandkit:build
npm run brandkit:verify
npm run brandkit:test
npm run brandkit:zip
npm run brandkit:external
```

- **build:** valida las entradas, genera el kit en una copia temporal y solo la sustituye si pasa la verificación. Si algo falla, el kit actual no se toca.
- **verify:** comprueba el inventario exacto de `manifest.json` (ruta, peso, SHA-256), los enlaces y el pixel art exacto del símbolo, los favicons, el avatar y el personaje. Con `--kit <carpeta>` valida un ZIP extraído.
- **zip:** `output/gatopago-brandkit-interno-<versión>.zip`, con todo el kit y su propio manifiesto.
- **external:** `output/gatopago-brandkit-externo-<versión>.zip`, solo con lo aprobado en [release.json](../release.json), con manual breve y catálogo propios.

## Derechos

- Recursive se distribuye con su licencia SIL Open Font License 1.1; conservarla al redistribuir.
- Esa licencia no cubre el logo, el personaje ni el contenido de marca. Este kit no concede permisos públicos sobre la marca.
- Ningún ZIP equivale a autorización para publicar.
