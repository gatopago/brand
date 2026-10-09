# Auditoría de marca y recursos · 3 de octubre de 2026

**Estado:** diagnóstico y propuesta. No cambia el brandkit ni aprueba nada.
**Nota:** las rutas citadas son las de antes de la reorganización del 3 de octubre de 2026 (`recursos/` pasó a `archivo/`, `contenido/` y `comercial/`; `documentacion/` pasó a `estrategia/`). Los enlaces apuntan a las ubicaciones nuevas.
**Alcance:** brandkit 1.0.0-rc.1, `recursos/` (incluido el laboratorio), iconos, manuales, banners y piezas sociales.

## Resumen

El kit está sano: `brandkit:verify` pasa sin fallos y la identidad (paleta, Recursive, símbolo pixel, voz) es coherente en todo lo revisado. Los problemas no son de calidad, sino de **duplicidad y de puntos de entrada**: hay tres manuales, dos familias de piezas sociales y dos sitios donde viven iconos. Quien llega al repositorio no sabe cuál es la referencia.

Prioridades:

1. Un único manual de referencia (el del kit) y los otros dos marcados como derivados.
2. Decidir qué parte del laboratorio se integra al kit y qué queda como archivo.
3. Cuatro iconos del laboratorio que rompen la familia (ver abajo).
4. Limpiar las dos ramas antiguas.

## 1. Iconos

Familia del laboratorio: `brandkit/11-iconos/` (antes en el laboratorio), 32 SVG en una retícula de 24 unidades, trazo de 2 y remates cuadrados. En conjunto es consistente y encaja con el símbolo pixel. Hay cuatro excepciones:

| Icono | Problema | Propuesta |
|---|---|---|
| `ajustes` | Usa bloques rellenos y pesa más que el resto a 16–24 px | Redibujar solo con trazo: tres líneas con un nodo cuadrado de trazo |
| `saldo` | Mismo caso: los bloques rellenos se leen como una mancha | Contorno de cartera o pila de monedas con el mismo trazo 2 |
| `contactos` | Dos figuras solapadas que a 24 px no se distinguen | Una sola figura o figura con un pequeño `+` |
| `escanear` | Los puntos interiores quedan sueltos y vibran a tamaño pequeño | Dejar solo las cuatro esquinas y una línea central |

Las versiones corregidas están en [iconos-2026-10](./iconos-2026-10/README.md), pendientes de aprobación. Dos posts de esta entrega usan iconos señalados: `consejo-04` usa `escanear` y `acciones-02` usa `escanear` y `contactos`. Al tamaño del post se leen bien, pero heredarán la corrección cuando exista. Si se aprueban las correcciones, deben hacerse como nueva versión en el laboratorio, sin sobrescribir los originales; después basta con volver a ejecutar `npm run brandkit:social`.

El kit no tiene aún una familia de iconos de interfaz: `02-logos` solo cubre símbolo, favicons y PWA. Hoy esa familia vive en el laboratorio.

## 2. Manuales: tres documentos para lo mismo

| Documento | Dónde | Situación |
|---|---|---|
| Manual práctico del kit | `brandkit/01-manual/` + `brandkit/index.html` | **Referencia.** Versionado, verificado y empaquetado en el ZIP |
| Manual visual del laboratorio | `archivo/laboratorio-gatopago/02-manual/` (HTML y PDF de 12 páginas). **Descartado el 3 de octubre de 2026.** | Bien maquetado y coherente con el kit, pero es una propuesta paralela |
| Manual editorial en PDF | `output/gatopago-manual-de-marca-2026-09.pdf` | Ignorado por Git: solo existe en este equipo |

**Propuesta:** el kit es la única fuente de reglas. El PDF del laboratorio puede pasar a ser «la edición imprimible» del kit si se regenera desde `01-manual` (para que no diverjan), o quedar como archivo con una nota en su README. El PDF de `output/` debe tratarse como borrador local.

## 3. Banners y piezas sociales

Había tres orígenes sin relación entre sí:

- `brandkit/10-plantillas/`: tres plantillas (post cuadrado, novedad vertical, portada horizontal), sobrias y correctas.
- `archivo/laboratorio-gatopago/06-aplicaciones/social/`: tres piezas (camino, control, cover).
- `recursos/social/gatopago-x-cover-2026-10-01-v1.png`: portada de X ya realizada, con su encargo.

**Nuevo:** [`recursos/social/posts-2026-10/`](../../contenido/redes/2026-10/README.md) reúne 168 piezas generadas desde el kit con `npm run brandkit:social` (más 2 imágenes OG): 83 posts e historias (incluidas las series Pilares, Entre países y DeFi sin jerga), 5 carruseles (30 diapositivas), 7 banners, 4 posts horizontales, 16 portadas de destacadas, 6 fondos para historias, 14 stickers, 3 fondos de pantalla y 2 plantillas con hueco para capturas. Comparten tipografía trazada, paleta, firma, retícula y motivos (escalera, raíl, gato). Cada pieza incluye un texto sugerido.

Reglas aplicadas que conviene llevar al manual:

- El gato no va sobre fondo Cat Fire: el pelaje se funde con el fondo. Sobre Cat Fire, solo tipografía, iconos y escalera en tinta.
- En fondos oscuros y Cat Fire, el símbolo va sobre un contenedor Milk. Milk sobre Cat Fire no llega a AA; Ink sobre Cat Fire sí (5,85:1).
- En historias, el contenido y la firma quedan a 250 px de los bordes superior e inferior.
- En el banner de YouTube, todo el texto va dentro de la zona segura de 1546 × 423.
- Las piezas que muestran un flujo de producto llevan «Alpha en testnet · fondos de prueba».

## 4. Orden del repositorio

| Hallazgo | Propuesta |
|---|---|
| `recursos/README.md` no mencionaba el laboratorio (332 MB, más del 90 % de `recursos/`) ni los posts nuevos | Corregido en esta entrega |
| El laboratorio repite manual, iconos, animaciones y social del kit con otra estructura | Decidir pieza a pieza: integrar al kit (iconos y movimiento son los candidatos) o archivar |
| Rama `brandkit/mascota-hd` | Ya está contenida en `main`; se puede borrar |
| Rama `agents/sin-commit-solo-pedido` | Se quedó en el commit inicial «added all»; se puede borrar |
| Personaje en `brandkit/03-personaje` | Sigue «pendiente de aprobación artística». Las piezas sociales lo usan, así que su publicación depende de esa aprobación |
| Iconos PWA y OG del kit | Son copias de la app y siguen pendientes de rehacer con el símbolo actual |

No se borró ni se movió nada: borrar ramas o archivar el laboratorio requiere confirmación.

## 5. Pitch deck

Archivos: `recursos/presentaciones/originales/GatoPago_Pitch_Deck.pptx` (original) y `propuestas/GatoPago_Pitch_Deck_GatoPago.pptx` + `.pdf` (rehecho, 14 diapositivas, 16:9).

**Veredicto:** la propuesta resuelve la forma, pero no el contenido. Visualmente es limpia y fiel al kit. Como pitch no funciona: le faltan las diapositivas que un inversor busca y el texto es una lista de conceptos de moda que no se pueden comprobar.

### Lo que está bien

- Elimina lo peor del original: ocho imágenes generadas (neón, globo terráqueo, un hombre agobiado entre logos de exchanges, un robot holográfico) y emojis en casi todas las diapositivas.
- Usa la paleta, Recursive con los ejes del manual (títulos `CASL 0.18`, `slnt -4`, peso 760), el símbolo y el gato del kit. Textos y diagramas son objetos editables.
- Es mínima: una idea por diapositiva, mucho aire y alternancia Milk/Ink con ritmo.

### Forma: defectos concretos

| Diapositiva | Problema |
|---|---|
| 2 | Cinco pasos y cuatro problemas: «Wallet» queda sin texto y las columnas mezclan alineación a la izquierda y centrada |
| 3 y 6 | Flechas de distinta longitud, líneas base desalineadas (BOB y USDC más bajos que PSP o FX Engine) y «/ Chain» huérfano en otra línea |
| 9 | Diagrama en cruz sin significado: los nombres no están conectados por ninguna lógica, y «AI Copilot» y «Risk Scoring» flotan en las esquinas |
| 7, 11 y 12 | Dicen lo mismo tres veces (fondos en blockchain, control del usuario, trazabilidad) |
| Todas | Mezcla de español e inglés sin criterio («settlement», «Fees visibles», «One API. Any currency. Any chain.») |

### Contenido: por qué no es un buen pitch

1. **Faltan las piezas básicas:** equipo, tracción (qué está construido, usuarios y volumen de la alpha), mercado, modelo de negocio (cómo gana dinero: comisión, diferencial de cambio, SaaS), competencia, por qué ahora y qué se pide (importe y uso de fondos).
2. **Exceso de conceptos sin prueba:** intent-based payments, Payment Operating System, Liquidity Marketplace, Best Execution, AI Agents, Risk Scoring, Payroll y Smart Wallet. Se presentan siete productos y seis «motores» para una alpha en testnet. Es lo que hace que el texto suene a generado: mucho vocabulario de moda y ningún dato.
3. **No dice en qué estado está el producto.** El documento de decisiones exige no presentar Card ni mainnet como activos; el deck no los presenta como activos, pero tampoco dice en ningún momento que es una alpha en testnet.
4. **Contradice la narrativa vigente** (`documentacion/README.md` y la narrativa del 18 de agosto):
   - promesa: «Usa cripto como dinero local» y «Tú decides qué hacer. GatoPago decide cómo hacerlo» en lugar de «Tus dólares ya saben moverse» y «Tu dinero sigue siendo tuyo. GatoPago se ocupa del camino»;
   - categoría: «infraestructura de pagos» en lugar de «cuenta onchain programable»;
   - redes: menciona Avalanche, Base y Solana. La narrativa dice que la base actual es Arbitrum (Sepolia en testnet), Avalanche es expansión y Base es histórica. Arbitrum no aparece.
5. **Afirmaciones sin verificar:** «Cotización bloqueada», «Fees visibles» y «Tx trazable» describen capacidades que hay que confirmar en la app antes de enseñarlas.

### Otros

- El `LEEME.txt` de `propuestas/` cita una carpeta `fuentes/` con tres TTF y un `LICENSE.txt` que no existen. La licencia SIL OFL debe acompañar a las fuentes derivadas; hay que añadirla o regenerarla.

### Propuesta

Primero el contenido, después la forma. Reescribir el guion en unas 10–12 diapositivas: problema con un caso real (una persona o empresa en Bolivia), solución en una frase con la promesa vigente, demo o capturas de la alpha, qué está construido y qué no, mercado, modelo de negocio, competencia, equipo, hoja de ruta con fechas y la petición. Mantener el sistema visual de la propuesta y corregir las alineaciones de las diapositivas 2, 3 y 6.

## 6. Siguientes pasos

1. Aprobar o descartar las piezas sociales por series (la galería permite revisarlas una a una).
2. Aprobación artística del personaje, que desbloquea las piezas con gato.
3. Decidir el destino del manual del laboratorio.
4. Encargar la corrección de los cuatro iconos.
5. Revisar el [guion propuesto del pitch deck](../../comercial/pitch/gatopago-pitch-deck-guion-2026-10-03.md) antes de diseñarlo (sección 5).
6. Rehacer los iconos PWA y la imagen OG con el símbolo actual. `banner-compartir-01` (1200 × 630) sirve como base para la OG.
