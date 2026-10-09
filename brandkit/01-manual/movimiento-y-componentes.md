# Movimiento y componentes

Edición 2026-09-28 · Guía de uso. No se modifican componentes de la app en esta entrega.

## Botones

Base observada en la landing: altura mínima 48 px, borde 2 px, radio 0, sombra desplazada 4 px, Recursive peso 760. Principal Cat Fire + Ink; secundario Paper + Ink; oscuro Ink + Milk.

| Estado | Tratamiento |
|---|---|
| Reposo | Sombra definida; acción descrita por un verbo |
| Hover | Desplazamiento -2/-2 px y sombra 6/6 px |
| Pulsado | Desplazamiento 4/4 px y sombra 0 |
| Procesando | Etiqueta específica, impedir doble envío, conservar dimensiones |
| Deshabilitado | Explicar la causa cuando no sea evidente; no depender solo de opacidad |
| Teclado | Foco visible y consistente, distinto del estado seleccionado |

Referencia: transiciones de 120 ms con `steps(2)` en sombra y transformación, y 160 ms para fondo. No es obligatorio aplicar pasos a cada animación. Movimiento de trayectos o de lectura puede necesitar interpolación continua para no parecer lag.

Una sola acción primaria por contexto. “Cancelar” no compite visualmente con “Confirmar”. No duplicar “Escanear” si ambos controles llevan al mismo flujo.

## Campos y formularios

Etiqueta persistente, ayuda breve y error específico junto al campo. Placeholder no sustituye etiqueta. En importes, explicar activo, moneda, saldo y cualquier equivalencia. Mantener navegación por teclado y foco accesible: retirar un borde molesto de un input no justifica dejar todos los controles sin indicación de foco.

## Diálogos

| Tipo | Contenido mínimo | Comportamiento |
|---|---|---|
| Información | Título descriptivo, explicación corta, siguiente paso | Se puede cerrar sin consecuencias |
| Confirmación de operación | Destinatario, importe, activo, red cuando importe, costes y total | Autorizar de forma explícita; no ocultar diferencias en un tooltip |
| Advertencia | Riesgo concreto y qué puede hacer la persona | No dramatizar ni usar al gato como única advertencia |
| Acción irreversible | Consecuencia y objeto exactos | Cancelar claramente disponible antes de autorizar |
| Error recuperable | Qué ocurrió, estado conocido y opción segura | No invitar a reenviar si se desconoce si el primer intento se ejecutó |
| Resultado | Estado verificado, identificador y acceso al detalle | Celebrar solo cuando el estado lo permita |

El diálogo debe gestionar foco, teclado y retorno al elemento de origen. Una pantalla de mantenimiento bloqueante es una excepción de producto, no el patrón normal de modal.

## Carga y progreso

- Usar skeletons que anticipen la geometría del contenido, no bloques decorativos sin relación con la pantalla.
- Animar preferentemente `transform` y `opacity`; evitar relayout continuo o filtros grandes en móviles.
- No mostrar porcentajes ni una barra “casi completa” sin información real de progreso.
- Para espera indeterminada, usar un ciclo reconocible y un texto de estado. El punto del rail debe recorrer los límites definidos, no desaparecer antes por un recorte.
- No introducir retrasos artificiales para que se vea una animación.
- Si la espera se alarga, explicar el estado y ofrecer una salida segura cuando exista.

## Uso del personaje

Una sola animación ambiental importante por pantalla. El personaje acompaña, no ocupa el espacio de datos, confirmaciones o alertas. El nombre Meli no aparece en el copy público.

| Contexto | Recurso sugerido | Límite |
|---|---|---|
| Bienvenida o vacío | pose-sentado, saludo | No obstruir el primer paso |
| Preparación de envío | pose-mensajero, preparando-pago | No indica que el pago llegó |
| Cobro | pose-qr | Sustituir el QR ilustrado por un QR real solo en una composición implementada y validada |
| Éxito confirmado | comprobante, salto | Una vez, breve, sin bucle de celebración |
| Espera tranquila | Siesta, cola | No sugerir inactividad del servicio cuando una operación está en curso |
| Error recuperable | Metí la pata, reparar rail | Texto claro antes que chiste; no banalizar pérdidas |
| Seguridad | Seguridad, linterna | Ilustración, no sello de auditoría ni garantía |
| Descubrimiento | asomarse, expresion-curioso | No tapar controles ni pedir atención repetidamente |

## Entrega de movimiento

Las [20 propuestas de animación](../03-personaje/galeria.html#animaciones) se incluyen para revisión, pendientes de aprobación artística:
- cada secuencia tiene fotogramas y un manifiesto con el tiempo de cada paso y el modo previsto de reproducción (en bucle o una vez); no se impone un FPS universal;
- en producto se respetará la reproducción única de las secuencias «una vez»; una preview en bucle no sirve para un resultado de pago;
- la galería permite pausar todas las previews y respeta `prefers-reduced-motion`; en producto, acompañar la alternativa estática con un estado en texto;
- la aprobación artística es humana: cada secuencia se revisa en su contexto final y a su tamaño real.

## Descargas

Los comprobantes y QR descargables necesitan el mismo vocabulario visual, pero los datos son prioritarios: contraste, quiet zone del QR, no deformación, identificador y estado verificable. Probar lectura del QR y legibilidad del export; no colocar el gato encima de módulos codificados.
