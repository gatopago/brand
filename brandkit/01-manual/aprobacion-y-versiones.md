# Aprobación y versiones

Preparación 1.0.0-rc.1 · 2 de octubre de 2026.

Esta es una candidata de entrega, no una nueva identidad aprobada automáticamente.
La revisión técnica verifica archivos; la decisión artística corresponde a Daniel.
La política legible por las herramientas está en [release.json](../release.json).

## Tres estados, sin confundirlos

| Estado | Contenido | Distribución |
|---|---|---|
| Base vigente | Símbolo principal, favicons web, fuente con licencia, paleta y avatares existentes | Entrega interna, externa y paquete local de assets |
| En revisión | Nuevos logos horizontales y variantes, personaje, componentes y plantillas | Solo entrega interna |
| Retirado | Trabajo en `descartado/` | Versionado para consulta; fuera de ambas entregas |

Los originales y los planes extensos son referencias internas,
no assets listos para instalar. Los HTML son catálogos locales, no otra landing.

## Decisiones pendientes

| Propuesta | Qué revisar | Estado |
|---|---|---|
| Wordmark horizontal | Lectura de GatoPago, espaciado, tamaño mínimo, fondos claro y oscuro | Pendiente |
| Monocromáticas y contorno claro | Identificación del gato y legibilidad de ojos/boca a tamaño pequeño | Pendiente |
| Personaje | Las 14 poses y 20 animaciones; especialmente cola, siesta, asomarse, repair rail y swap | Pendiente; no se cambiaron frames en esta preparación |
| Componentes | Jerarquía, padding, estados de botones, foco de teclado, diálogos, recibo y QR | Referencia visual, sin integrar a la app |
| Plantillas | Encuadre, tamaño de titulares, zona libre para avatar y contenidos de ejemplo | Pendiente |

El nombre interno del personaje sigue siendo Meli; no se añade a textos públicos.
La validación de un QR de ejemplo no prueba el flujo financiero de cobro.

## Pasar de candidata a 1.0.0

1. Daniel revisa los catálogos y confirma qué propuestas se aceptan; registrar fecha y archivos concretos.
2. Ajustar la política en `release.json`. No mover toda una carpeta a la base vigente si contiene propuestas rechazadas o documentos internos.
3. Promover la versión a `1.0.0` en release y paquete raíz. Un cambio de versión no constituye aprobación por sí mismo.
4. Añadir la decisión al [historial](../CHANGELOG.md); regenerar, verificar, probar y empaquetar.
5. Revisar el contenido del ZIP externo extraído. Compartirlo o integrarlo requiere autorización aparte.

Versionado posterior: patch para correcciones de export/documentación sin cambiar la identidad,
minor para ampliar recursos compatibles, major para cambiar paleta, logo o contratos de tokens.
No reutilizar un número de versión para una entrega diferente. Los ZIP de revisión actual
son reproducibles y pueden regenerarse mientras la candidata siga abierta.

## Antes de dar por cerrada una entrega

- Originales y fuente conservados; sin recortes accidentales.
- SVG trazados y PNG coinciden; contraste y tamaños revisados.
- No hay secretos, referencias internas ni propuestas en el ZIP externo.
- Licencia tipográfica incluida; no se presume una licencia sobre el arte.
- Manifiesto exacto, enlaces locales válidos y pruebas del pipeline aprobadas.
- App y landing sin modificaciones por esta entrega; publicación no implícita.
