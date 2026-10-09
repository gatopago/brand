# Alcance del repositorio

Este checkout (`gatopago/brand`) es la biblioteca de marca, estrategia, material comercial y herramientas de GatoPago. No es un frontend ni una landing: la app y la landing viven en `gatopago/gatopago`.

- Trabajar en `brandkit/`, `estrategia/`, `comercial/`, `contenido/` y `herramientas/`.
- No recrear `src/`, `public/`, un servidor web ni configuración de despliegue.
- No modificar otro checkout ni publicar, hacer push o desplegar por inferencia.
- No redibujar, recortar ni recolorear recursos al organizar.
- No borrar `brandkit/` para regenerarlo: contiene fuentes editables. La paleta se edita en `brandkit/05-colores/tokens.json`, los mapas del logo están en `brandkit/02-logos/modelo/` y los originales del gato en `brandkit/06-originales/`.
- El personaje, los iconos y el movimiento siguen en revisión hasta aprobación artística.
- No guardar historia ni copias: lo retirado se borra (queda en Git), sin carpetas de archivo ni notas de «retirado el…».

Validar con `npm run brandkit:build`, `npm run brandkit:verify`, `npm run brandkit:test` y `npm run brandkit:zip`. La verificación técnica no prueba capacidades financieras ni aprobación visual.
