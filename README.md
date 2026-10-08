# GatoPago — Identidad, Estrategia y Recursos

Repositorio: [`gatopago/brand`](https://github.com/gatopago/brand) (privado). Este repositorio es la biblioteca central de marca, estrategia, activos comerciales y generadores de GatoPago.  
No contiene código de frontend, servidor web ni configuración de despliegue (la app y la landing viven en el repositorio unificado `gatopago/gatopago`).

## Mapa del repositorio

```
├── brandkit/                    IDENTIDAD CANÓNICA
│                                Manual, logos, personaje, tipografía, colores, plantillas y catálogo local
│
├── estrategia/                  QUÉ ES GATOPAGO Y POR QUÉ
│   ├── vigente/                 Narrativa 2026-10, promesa de marca, índice maestro y rebranding
│   ├── planes/                  Planes estratégicos 2026–2030 (producto, finanzas, marketing, B2B…)
│   ├── investigacion/           Datos de Bolivia y guion de entrevistas (benchmarks pendientes)
│   └── auditorias/              Auditoría de marca y recomendaciones de diseño
│
├── comercial/                   VENTAS, CAPITAL Y ALIANZAS
│   ├── pitch/                   Decks vigentes ES/EN (fuente de claude.ai), guion y decks anteriores
│   ├── grants/                  Plantilla, convocatorias y bases de referencia
│   ├── partners/                Propuestas y one-pagers para aliados comerciales
│   └── data-room/               Índice para due diligence (sin datos sensibles)
│
├── contenido/                   COMUNICACIÓN Y PUBLICACIONES
│   ├── redes/2026-10/           172 piezas sociales generadas (posts, carruseles, banners, stickers)
│   ├── redes/portada-x/         Portada de X y su encargo
│   └── calendario/              Plan editorial y cronograma de publicación
│
├── archivo/                     REGISTRO TÉCNICO E HISTÓRICO (No usar en piezas nuevas)
│   ├── laboratorio-gatopago/    255 MB de animaciones, propuestas y rigs experimentales
│   └── estrategia/              Documentos de estrategia anteriores y adaptaciones
│
├── herramientas/                SCRIPTS Y GENERADORES
│   ├── brandkit/                Generadores de personaje, piezas sociales, release y tests
│   ├── build-brandkit.mjs       Compilación determinista del kit
│   ├── verify-brandkit.mjs      Verificación estricta de inventario y hashes
│   └── package-brandkit.mjs     Empaquetado de ZIP interno y externo
│
└── output/                      Entregas locales (ignorado por Git)
```

## Herramientas del Brandkit

Con Node >=22.12:

```sh
npm ci
npm run brandkit:build          # Genera catálogo, tokens CSS/CSV/GPL y manifiesto
npm run brandkit:verify -- --sources  # Valida inventario, hashes y coincidencia de fuentes
npm run brandkit:test           # Ejecuta suite completa de pruebas unitarias
npm run brandkit:zip            # Genera ZIP interno para el equipo
npm run brandkit:external       # Genera ZIP externo sin material en revisión
```

La candidata actual es **1.0.0-rc.1**.  
Las fuentes editables están versionadas: mapas del símbolo, tokens JSON, originales, fuentes tipográficas con licencia y plantillas. No se borra `brandkit/` para regenerarlo.

Consulta [entrega y mantenimiento](./brandkit/01-manual/entrega-y-mantenimiento.md) para más detalles.
