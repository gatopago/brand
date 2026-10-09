# GatoPago · Marca

Repositorio [`gatopago/brand`](https://github.com/gatopago/brand) (privado): identidad, estrategia, material comercial y contenido de GatoPago. La app y la landing viven en `gatopago/gatopago`.

```
brandkit/       Identidad oficial: manual, logos, personaje, tipografía, colores,
                imágenes, componentes, plantillas, iconos y movimiento.
                Empieza por brandkit/index.html.
estrategia/     vigente/ (manda), planes/ e investigacion/
comercial/      pitch/ (decks ES y EN), partners/ (one-pager), grants/,
                equipo/ y data-room/
contenido/      redes/ (172 piezas y portada de X) y calendario/
herramientas/   Scripts que generan, verifican y empaquetan el kit
output/         Entregas generadas en tu PC (no va a Git)
```

## Comandos

Con Node 22.12 o superior:

```sh
npm ci
npm run brandkit:build       # regenera el kit
npm run brandkit:verify      # verifica inventario, hashes y enlaces
npm run brandkit:test        # pruebas del pipeline
npm run brandkit:zip         # ZIP interno en output/
npm run brandkit:external    # ZIP solo con lo aprobado
npm run brandkit:social      # rehace las piezas de contenido/redes/2026-10
npm run contenido:calendario # rehace el calendario editorial
```
