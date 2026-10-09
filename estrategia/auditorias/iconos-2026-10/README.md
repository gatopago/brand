# Iconos corregidos · propuesta de octubre de 2026

**Estado:** propuesta pendiente de aprobación. Los originales siguen intactos en `brandkit/11-iconos/svg/`.

Corrige los cuatro iconos que la [auditoría de marca](../gatopago-auditoria-marca-2026-10-03.md) señaló como fuera de la familia. Mantienen las reglas de la familia: retícula de 24 unidades, trazo de 2, remates cuadrados, uniones en inglete y `currentColor`.

![Comparativa entre originales y propuestas a 24, 48 y 96 px](./comparativa.png)

| Icono | Problema del original | Corrección |
|---|---|---|
| `ajustes` | Las líneas atraviesan los mandos y, a tamaño pequeño, se leen como bloques rellenos | Las líneas se cortan en cada mando, que queda hueco |
| `saldo` | Doble marco superior y un punto relleno: pesa más que el resto | Cartera de un solo marco, una tarjeta asomando y un bolsillo sin relleno |
| `contactos` | Dos figuras solapadas que no se distinguen a 24 px | Una figura y tres líneas de lista: se lee como agenda |
| `escanear` | Dos puntos sueltos que vibran a tamaño pequeño | Cuatro esquinas y la línea de lectura, nada más |

## Si se aprueban

1. Copiar `svg/*.svg` sobre los originales del laboratorio, o mejor: crear la familia de iconos dentro del kit (`brandkit/`), que hoy no la tiene.
2. Ejecutar `npm run brandkit:social`: los posts `consejo-04` y `acciones-02` usan `escanear` y `contactos` y se actualizan solos.
3. Si los iconos entran al kit: `brandkit:build`, `brandkit:verify -- --sources`, `brandkit:test` y `brandkit:zip`.
