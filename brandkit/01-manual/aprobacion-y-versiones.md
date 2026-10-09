# Aprobación y versiones

Esta es una candidata de entrega, no una nueva identidad aprobada automáticamente.
La revisión técnica verifica archivos; la decisión artística corresponde a Daniel.
La política legible por las herramientas está en [release.json](../release.json).

## Dos estados

| Estado | Contenido | Distribución |
|---|---|---|
| Base vigente | Símbolo principal, favicons web, fuente con licencia, paleta y avatares existentes | Entrega interna y externa |
| En revisión | Nuevos logos horizontales y variantes, personaje, componentes, plantillas, iconos y movimiento | Solo entrega interna |

Los originales son referencias internas, no assets listos para instalar. Los HTML son catálogos locales, no otra landing.

## Decisiones pendientes

| Propuesta | Qué revisar | Estado |
|---|---|---|
| Wordmark horizontal | Lectura de GatoPago, espaciado, tamaño mínimo, fondos claro y oscuro | Pendiente |
| Monocromáticas y contorno claro | Identificación del gato y legibilidad de ojos/boca a tamaño pequeño | Pendiente |
| Personaje | Las 14 poses y 20 animaciones; especialmente cola, siesta, asomarse, repair rail y swap | Pendiente |
| Componentes | Jerarquía, padding, estados de botones, foco de teclado, diálogos, recibo y QR | Pendiente |
| Plantillas | Encuadre, tamaño de titulares, zona libre para avatar y contenidos de ejemplo | Pendiente |
| Iconos | Las 32 piezas y la propuesta de corrección de cuatro (`11-iconos/propuesta-2026-10/`) | Pendiente |
| Movimiento | Las seis animaciones y sus duraciones | Pendiente |

El nombre interno del personaje sigue siendo Meli; no se añade a textos públicos.
La validación de un QR de ejemplo no prueba el flujo financiero de cobro.

## Pasar de candidata a 1.0.0

1. Daniel revisa los catálogos y confirma qué propuestas se aceptan; registrar fecha y archivos concretos.
2. Ajustar la política en `release.json`. No mover toda una carpeta a la base vigente si contiene propuestas rechazadas o documentos internos.
3. Promover la versión a `1.0.0` en release y paquete raíz. Un cambio de versión no constituye aprobación por sí mismo.
4. Regenerar, verificar, probar y empaquetar.
5. Revisar el contenido del ZIP externo extraído. Compartirlo o integrarlo requiere autorización aparte.

Versionado posterior: patch para correcciones de export/documentación sin cambiar la identidad,
minor para ampliar recursos compatibles, major para cambiar paleta, logo o contratos de tokens.
No reutilizar un número de versión para una entrega diferente.

## Antes de dar por cerrada una entrega

- Originales y fuente conservados; sin recortes accidentales.
- SVG trazados y PNG coinciden; contraste y tamaños revisados.
- No hay secretos, referencias internas ni propuestas en el ZIP externo.
- Licencia tipográfica incluida; no se presume una licencia sobre el arte.
- Manifiesto exacto, enlaces locales válidos y pruebas del pipeline aprobadas.
- Publicar requiere autorización aparte.
