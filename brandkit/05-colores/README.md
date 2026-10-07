# Paleta de GatoPago

La fuente editable es [tokens.json](./tokens.json). Se conservan los valores de la identidad existente, sin depender del código de un frontend. [tokens.css](./tokens.css), CSV, GPL y contraste se regeneran desde ese JSON. Los nombres internos `--meli-*` se mantienen por compatibilidad; no son nombres públicos de producto. Los colores semánticos identifican estados; no son acentos intercambiables.

| Token | HEX | RGB |
|---|---|---|
| cat-fire | #F85239 | 248, 82, 57 |
| cat-shadow | #CF3433 | 207, 52, 51 |
| cat-deep | #9F292E | 159, 41, 46 |
| ink | #0B0B0F | 11, 11, 15 |
| ink-soft | #15151B | 21, 21, 27 |
| ink-raised | #1D1D24 | 29, 29, 36 |
| milk | #FFF8F0 | 255, 248, 240 |
| paper | #FFFDF9 | 255, 253, 249 |
| oat | #EEE4D8 | 238, 228, 216 |
| stone | #A99F96 | 169, 159, 150 |
| growth | #71D5A1 | 113, 213, 161 |
| info | #79B9FF | 121, 185, 255 |
| pending | #F6C65B | 246, 198, 91 |
| danger | #FF6B7A | 255, 107, 122 |

## Contraste calculado

| Texto / fondo | Ratio | AA texto normal |
|---|---:|---|
| ink / milk | 18.65:1 | Sí |
| ink / cat-fire | 5.85:1 | Sí |
| milk / ink | 18.65:1 | Sí |
| milk / cat-fire | 3.19:1 | No |
| cat-shadow / milk | 4.76:1 | Sí |

No son colores Pantone ni una conversión CMYK aprobada para imprenta.
