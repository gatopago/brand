# Alcance del repositorio

Este checkout (`gatopago/brand`) es la biblioteca de marca, estrategia, activos comerciales y herramientas de GatoPago. No es un frontend ni una landing web.
La app y la landing viven en el repositorio unificado `gatopago/gatopago`.

- Trabajar aquí en `brandkit/`, `estrategia/`, `comercial/`, `contenido/`, `archivo/` y `herramientas/`.
- No recrear `src/`, `public/`, un servidor web ni configuración de despliegue.
- No modificar otro checkout ni publicar, hacer push o desplegar por inferencia.
- Conservar originales, licencia tipográfica y cambios previos del usuario.
- No redibujar, recortar ni recolorear recursos al hacer tareas de organización.
- Los archivos del kit incluyen fuentes editables; no borrar `brandkit/` para regenerarlo.
- La paleta editable es `brandkit/05-colores/tokens.json`. Los mapas del logo están en `brandkit/02-logos/modelo/` y los originales en `brandkit/06-originales/`.
- Los recortes del personaje siguen siendo candidatos hasta aprobación artística.
- No recrear el ZIP duplicado retirado de `03-personaje/descargas/`.
  La entrega completa se genera en `output/` con `brandkit:zip`.

Validar cambios con `npm run brandkit:build`, `npm run brandkit:verify -- --sources`, `npm run brandkit:test` y `npm run brandkit:zip`. Los HTML del kit son catálogos locales, no una nueva landing. La verificación técnica no prueba capacidades financieras, despliegue ni aprobación visual del personaje.
