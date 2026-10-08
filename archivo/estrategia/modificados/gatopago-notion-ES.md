# GatoPago

**Última actualización:** 23 de agosto de 2026  
**Estado:** narrativa vigente en español  
**Alcance:** fuente de mensajes para one-pagers, páginas de Notion y pitches; no acredita disponibilidad técnica ni comercial

**Tus dólares ya saben moverse.**

GatoPago es una cuenta onchain programable para cobrar, pagar, cambiar y poner a trabajar una parte de tus USDC sin entregar el control.

> Tu dinero sigue siendo tuyo. GatoPago se ocupa del camino.

## La idea

Recibir USDC es apenas el comienzo. El problema real aparece después: hay que decidir qué parte queda lista para el día a día, qué parte puede crecer y cómo usarla sin saltar entre wallets, protocolos y redes.

GatoPago reúne ese ciclo en una sola cuenta:

1. **Recibe:** cobra con links, QR o transferencias.
2. **Disponible:** deja USDC listo para pagar, enviar, cambiar o retirar.
3. **Creciendo:** mueve la parte que elijas a Aave V3 para buscar rendimiento.
4. **Usa:** vuelve a dejarlo Disponible cuando lo necesites.

## Lo que puedes probar hoy

- Crear una cuenta con passkey desde el navegador.
- Recibir y enviar USDC.
- Crear links de cobro y QR.
- Pagar a usernames.
- Cambiar entre USDC y ETH con cotización y costos visibles.
- Depositar y retirar USDC en Aave V3 desde la experiencia Creciendo.
- Revisar actividad, comprobantes y transacciones onchain.
- Probar payment intents, checkout, sandbox y webhooks desde la API.

La versión pública actual es una **Alpha en Arbitrum Sepolia con fondos de prueba**. No es mainnet.

## Control sin esconder la letra pequeña

Los fondos viven en una smart account y cada movimiento requiere una llave activa. Entras con una passkey, como tu huella o tu cara, sin guardar una frase semilla.

La recuperación asistida puede iniciar un reemplazo de llaves con una espera de 48 horas. Durante ese tiempo, una llave activa puede cancelarlo.

GatoPago cobra **0% de comisión entre sus usuarios**. Una red, un protocolo, una conversión o un proveedor externo pueden tener costos propios; cualquier costo conocido se muestra antes de confirmar.

Creciendo utiliza Aave V3. La tasa es variable y DeFi implica riesgos. GatoPago simplifica el flujo, pero mantiene visibles el protocolo, la red, el contrato y la ruta de salida.

## Para quién empieza

La primera cuña son personas y equipos pequeños de LATAM que ya reciben o usan USDC:

- freelancers y creadores;
- contributors y equipos remotos;
- founders y developers;
- comunidades Web3;
- personas que cobran grants o premios de hackathons;
- agencias y negocios digitales pequeños.

Ellos ya entienden por qué quieren dólares digitales. GatoPago debe demostrar que puede ayudarles a recibirlos, decidir qué hacer con ellos y volver a usarlos.

## Lo que viene después

**GatoPago Card** está en validación como acceso anticipado. La tarjeta todavía no está activa y no están cerrados el proveedor, la cobertura, la elegibilidad, los costos ni los requisitos de verificación.

También se investigan mejores rieles de entrada y salida para Bolivia y LATAM. Los servicios regulados pueden requerir verificación según el proveedor y la jurisdicción.

## Para desarrolladores

La API de GatoPago permite crear payment intents, abrir un checkout y recibir webhooks firmados cuando un pago onchain se confirma. Incluye sandbox, reintentos, idempotencia y consulta de estado.

La API es una vía de distribución y aprendizaje con integraciones piloto. GatoPago Personal sigue siendo el centro de la marca.

## Pitch corto

GatoPago es una cuenta onchain programable para recibir, usar y hacer crecer dólares digitales sin entregar el control. Combina cuentas protegidas con passkeys, pagos por links y QR, DeFi guiado y una futura tarjeta, además de una API para productos que necesitan aceptar stablecoins.

## Enlaces

- Sitio: `https://gatopago.com`
- Alpha: `https://app.gatopago.com`
- Documentación: `https://gatopago.com/docs`
