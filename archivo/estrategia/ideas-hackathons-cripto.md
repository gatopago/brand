# Proyectos futuros para ganar hackathones cripto

> **Estado:** banco experimental de junio de 2026. No es el roadmap de GatoPago ni una decisión de abandonar la estrategia B2C/B2B2C/B2B. Cualquier idea debe volver a validarse contra el índice maestro antes de entrar al producto.
>
> Objetivo de este documento: una lista de proyectos pensados para GANAR hackathones cripto. Innovadores, con factor wow, y alineados con lo que tú ya sabes construir. No son ideas de negocio de consumo (esas no ganan hackathones cripto, lo aprendimos). Son ideas cripto-nativas, técnicas, con un momento "wow" claro para el jurado.
>
> Fecha: junio 2026. Investigado con fuentes públicas (al final).

---

## 0. La estrategia en una frase

La categoría más caliente de 2026 son los **pagos agénticos** (agentes de IA que pagan solos con stablecoins, estándar x402) y la **privacidad** (FHE). Y resulta que el cruce de pagos + account abstraction + passkeys + paymaster + API de pagos es exactamente lo que ya construiste en GatoPago.

Conclusión: no compitas como "app de pagos para personas". Reempaqueta tu infraestructura como **infraestructura para la economía de agentes**. Es el meta ganador, tiene factor wow incorporado (un robot pagando solo), y reutilizas el 80% de tu stack. Bonus: lo que ganes aquí puede volverse el foso técnico de GatoPago.

---

## 1. Qué hace ganar un hackathon cripto (para diseñar con eso en mente)

Los jurados puntúan, en este orden práctico:

1. **Factor wow.** El momento "no se me habría ocurrido" o "esto da escalofríos". Casi siempre es una demo en vivo que parece magia.
2. **Profundidad técnica + originalidad.** Que se note que hay ingeniería real, no un wrapper.
3. **Demo impecable y simple.** Una sola cosa que funcione perfecta gana a cinco a medias. Storytelling claro.
4. **Integración con el sponsor.** Usar de verdad la tecnología del que pone el premio (x402 de Coinbase, FHE de Zama, etc.). Los premios grandes son por track de sponsor.
5. **UX.** Que se entienda en 10 segundos.

Regla de oro: **diseña la demo primero**. Decide el momento wow (los 15 segundos que hacen que el jurado se incline hacia adelante) y construye hacia atrás desde ahí. Recorta todo lo demás sin piedad.

Ejemplo real de demo ganadora: escanear tu pasaporte con el celular, generar una prueba y verificarla on-chain, en vivo, sin fallar.

---

## 2. El mapa de categorías calientes 2026 (dónde está el dinero)

- **Pagos agénticos / x402.** Agentes de IA que pagan recursos y APIs con stablecoins. Estándar x402 (de Coinbase, ahora en la Linux Foundation, ya mueve unos 600 millones al año). También Google AP2. Es EL tema.
- **Agent wallets y seguridad de agentes.** Billeteras inteligentes para agentes, con límites y frenos. Evitar que un agente con prompt injection vacíe la cuenta.
- **Account abstraction + passkeys.** "La billetera más inteligente gana." Onboarding en un toque, recuperación social, gasless.
- **Privacidad: FHE + ZK + TEE.** DeFi confidencial, order books cifrados, pagos privados. Zama (fhEVM), Fhenix, Inco.
- **Prediction markets con oráculos de IA.** Enjambres de agentes que verifican la verdad del mundo real.
- **RWAs.** Tokenización y mercados de activos del mundo real.
- **Chain abstraction.** Que el usuario no sepa en qué red está.

Tus fortalezas (ERC-4337, passkeys, paymaster gasless, ERC-7913 multi-passkey, recuperación con guardianes, API de pagos con webhooks, swaps on-chain) caen de lleno en los primeros tres. Ahí debes pegar.

---

## 3. Las ideas (ordenadas de mayor a menor encaje contigo)

Cada idea trae: el momento wow, por qué gana, qué reutilizas y el track de sponsor al que apunta.

### Idea 1. Cartera con conciencia para agentes de IA (TOP)

Un smart account (ERC-4337) hecho para que un agente de IA gaste solo, pero con frenos: presupuestos, lista de permitidos, límite de gasto por hora, y un **veto con tu huella** para montos grandes. El agente paga por APIs y datos con x402, pero la cartera lo obliga a portarse bien.

- **Momento wow:** en vivo, un agente autónomo compra llamadas a una API pagando con x402, todo solo. Luego intenta gastar de más o pagar a una dirección no autorizada, y la cartera lo bloquea on-chain delante del jurado. "El agente quiso, la cartera no lo dejó."
- **Por qué gana:** une los dos temas más calientes (agentes + account abstraction) y resuelve un miedo real y actual (agentes que se descontrolan). Es ENShell + Abstract Wallet, pero con tu stack.
- **Reutilizas:** tu ERC-4337, paymaster, ERC-7913 (multi-passkey para el veto), guardianes, y la lógica de payment intents.
- **Apunta a:** tracks de agentic / x402 (Coinbase), account abstraction, seguridad.
- **Esfuerzo:** medio. Tienes casi todo. Lo nuevo es el motor de políticas y la integración x402.

### Idea 2. Paymaster x402 (agentes que pagan sin tener ETH)

Un facilitador x402 + paymaster ERC-4337: el agente paga recursos en stablecoins, pero el gas lo patrocina el paymaster. El agente nunca necesita ETH ni entiende de gas.

- **Momento wow:** un agente con saldo cero de ETH paga 100 microtransacciones x402 seguidas, sin fricción. Contador en pantalla subiendo solo.
- **Por qué gana:** quita el dolor más obvio de los pagos de agentes (el gas). Infraestructura pura, muy del gusto de los jurados de sponsors.
- **Reutilizas:** tu paymaster casi tal cual.
- **Apunta a:** x402 / Coinbase, Arbitrum, account abstraction.
- **Esfuerzo:** bajo a medio. Es de los más rápidos de shippear bien.

### Idea 3. Escrow programable para comercio entre agentes

Agentes que contratan a otros agentes. El pago queda en un escrow de smart account y se libera solo cuando se prueba la entrega (oráculo o prueba ZK). Trustless de agente a agente.

- **Momento wow:** dos agentes negocian una tarea, el dinero se bloquea, el trabajo se entrega y se verifica, y el pago se libera solo. Sin humanos en el medio.
- **Por qué gana:** es la "infraestructura de confianza" que le falta a la economía de agentes. Suena a futuro.
- **Reutilizas:** smart accounts, payment intents, webhooks como señal de entrega.
- **Apunta a:** agentic, x402, RWA si la entrega es un activo real.
- **Esfuerzo:** medio.

### Idea 4. Sub-cuentas desechables para agentes

Una cuenta madre (smart account) que crea sub-cuentas efímeras por tarea, cada una con presupuesto tope y autodestrucción al terminar. Aíslas el riesgo: si un agente se corrompe, solo pierde su presupuesto.

- **Momento wow:** un clic genera 10 carteras de agente desechables, cada una con su límite, todas gasless, y al terminar se revocan solas.
- **Por qué gana:** patrón de seguridad elegante y nuevo para el mundo de agentes. Muy "por qué no se me ocurrió".
- **Reutilizas:** ERC-4337, factory de cuentas (ya tienes AccountFactory), paymaster.
- **Apunta a:** account abstraction, agentic, seguridad.
- **Esfuerzo:** medio.

### Idea 5. Nómina y pagos confidenciales con FHE (la apuesta wow)

Pagar sueldos o facturas en stablecoins donde los **montos van cifrados on-chain** (FHE, fhEVM de Zama) pero siguen siendo verificables. Nadie ve cuánto cobra cada quién, pero el total se prueba correcto.

- **Momento wow:** una nómina on-chain donde el explorador muestra montos cifrados, imposibles de leer, y aun así se prueba que la suma cuadra y que a cada quien le llegó lo suyo.
- **Por qué gana:** privacidad es top de 2026 y casi nadie la hace bien aplicada a pagos. Factor wow altísimo (el ganador de la categoría agentic en Arbitrum fue infra de stablecoins con FHE).
- **Reutilizas:** tu DNA de pagos. Lo nuevo y más difícil es aprender FHE (Zama/Fhenix/Inco).
- **Apunta a:** tracks de privacidad (Zama, Fhenix, Inco), pagos.
- **Esfuerzo:** alto (FHE tiene curva), pero el premio de diferenciación es enorme. Ideal si tienes 2 a 3 semanas o un buen tutorial de fhEVM.

### Idea 6. Pagos por QR privados

Tu cobro por QR, pero el monto y las partes van cifrados on-chain. Combina tu pieza más reconocible (el QR) con el meta de privacidad.

- **Momento wow:** escaneas un QR, pagas, y on-chain nadie puede ver cuánto ni a quién. Solo tú y el cobrador.
- **Por qué gana:** privacidad aplicada a algo cotidiano y entendible. UX clarísima.
- **Reutilizas:** todo tu flujo de QR y pagos.
- **Apunta a:** privacidad, pagos.
- **Esfuerzo:** alto (por la parte FHE/ZK).

### Idea 7. Billetera passkey de un toque, como SDK (tu base ya construida)

Lo que ya tienes: passkey, crea smart account y hace su primera acción gasless, todo en un clic. Recuperación social con passkeys de amigos (ERC-7913), sin frases semilla. Empaquetado como SDK para que cualquier dev lo meta en su app.

- **Momento wow:** onboarding de cero a cuenta usable en 5 segundos con FaceID. Y la recuperación: "perdí el teléfono", dos amigos tocan su huella y recuperas la cuenta. Cero frases semilla.
- **Por qué gana:** "la billetera más inteligente gana". Es onboarding mainstream, lo que todos los sponsors quieren ver. Y tú ya lo tienes funcionando.
- **Reutilizas:** casi todo GatoPago. Es repackaging.
- **Apunta a:** account abstraction, cualquier sponsor de wallets, onboarding.
- **Esfuerzo:** bajo. Es la apuesta segura de ejecución impecable.

### Idea 8. Tesorería autónoma con freno de huella

Un agente que maneja una tesorería en un smart account: rebalancea, paga cuentas con x402, busca rendimiento, todo solo. Pero cualquier movimiento grande te pide la huella. Autonomía con cinturón de seguridad.

- **Momento wow:** la tesorería se mueve sola en pantalla (paga, rebalancea), y cuando intenta un retiro grande, te llega el prompt de huella a ti. "Trabaja sola, pero me pide permiso para lo importante."
- **Por qué gana:** mezcla agentes + AA + UX humana. Cuenta una historia que el jurado entiende y desea.
- **Reutilizas:** smart accounts, swaps, paymaster, passkeys, notificaciones.
- **Apunta a:** agentic, account abstraction, DeFi.
- **Esfuerzo:** medio a alto.

### Idea 9. Recibos verificables para la economía de agentes (proof-of-payment)

Un estándar de comprobante criptográfico (firmado o ZK) que un agente presenta para probar que pagó, componible entre servicios. El "recibo" de la era de los agentes.

- **Momento wow:** un agente paga en el servicio A y presenta una prueba reutilizable en el servicio B sin volver a pagar ni confiar en nadie.
- **Por qué gana:** primitiva de infraestructura que falta. Suena a estándar, y a los jurados les encanta apostar por estándares.
- **Reutilizas:** payment intents, webhooks, tu modelo de comprobantes.
- **Apunta a:** x402, agentic, infraestructura.
- **Esfuerzo:** medio.

### Idea 10. Gateway x402 multi-cadena (un endpoint para cobrar de agentes)

Un solo endpoint para que cualquier app acepte pagos x402 a través de varias cadenas, enrutando al settlement más barato. Tu API de pagos, pero para el mundo agente y cross-chain.

- **Momento wow:** integras "aceptar pagos de agentes" en una app cualquiera con 5 líneas de código, y un agente le paga desde otra cadena sin que nadie note el puente.
- **Por qué gana:** es "Stripe para pagos de agentes". Infra que escala, con tu API ya construida como base.
- **Reutilizas:** tu Payment Intent API, dashboard, webhooks, sandbox.
- **Apunta a:** x402, chain abstraction, Arbitrum.
- **Esfuerzo:** medio.

---

## 4. Top 3 recomendado para ti (si tuviera que elegir)

1. **Idea 1 (Cartera con conciencia para agentes).** Máximo cruce de meta ganador + tus fortalezas + factor wow. Es la apuesta de mayor techo.
2. **Idea 7 (Billetera passkey de un toque, SDK).** La apuesta de ejecución segura: ya la tienes construida, la demo es impecable, difícil que falle en vivo. Buena para no irte con las manos vacías.
3. **Idea 5 (Pagos confidenciales con FHE).** La apuesta de diferenciación: la más arriesgada por la curva de FHE, pero la de mayor factor wow puro. Si tienes tiempo de aprender fhEVM, puede ser la que te haga ganar una categoría sin competencia.

Estrategia combinada para un mismo hackathon: construye sobre la **Idea 7** como base sólida (passkeys + smart account), y súbele la **Idea 1** encima (el motor de políticas para agentes). Así tienes una demo segura y un techo alto en el mismo proyecto.

---

## 5. Tu ventaja injusta (lo que ya tienes y otros no)

Del repositorio de la app GatoPago ya tienes funcionando y verificable:
- Smart accounts ERC-4337 con paymaster (gasless) en Arbitrum.
- Passkeys WebAuthn, multi-passkey (ERC-7913), recuperación con guardianes.
- Factory de cuentas con CREATE2 (mismas direcciones cross-chain).
- Batching (ERC-7821).
- Payment Intent API con webhooks, sandbox e idempotencia, y un dashboard de comercios.
- Swaps on-chain (Uniswap v3/v4) sin API keys.

Eso es semanas de trabajo que la mayoría de equipos NO tiene el día 1. Tu jugada: llegar al hackathon con esa base ya lista y dedicar las 36 horas al motor nuevo (agentes, x402, FHE) y a la demo. Mientras otros pelean con el login, tú demuestras magia.

Nota: revisa las reglas de cada hackathon sobre código preexistente. Casi todos permiten librerías y boilerplate propio, pero el "núcleo nuevo" debe construirse en el evento. Empaqueta tu base como SDK o template reusable para estar limpio.

---

## 6. Por qué esto no es tiempo perdido para GatoPago

Todo lo que construyas aquí (pagos de agentes, x402, políticas de gasto, recibos verificables, pagos privados) es infraestructura de pagos. Es el mismo músculo de GatoPago, llevado al frente técnico. Ganar un hackathon con esto te da: premio, validación de terceros (lo que te falta), prensa, y piezas que se vuelven el foso de GatoPago. Es construir el foso y cobrar por construirlo.

---

## 7. Próximos pasos sugeridos

- Elegir 1 idea ancla (recomiendo Idea 1 + base de Idea 7).
- Identificar a qué hackathon de 2026 apuntar y qué tracks de sponsor paga (ver el calendario en la sección 8).
- Escribir el guion de la demo de 2 minutos ANTES de codear, fijando el momento wow.

---

## 8. Calendario de hackathones cripto 2026 (a dónde apuntar)

Nota práctica clave: tu mayor restricción es viajar (estás en Bolivia, tema visa). Por eso prioriza los VIRTUALES, donde compites desde casa sin pasaporte. Los marco con [VIRTUAL].

Próximos y relevantes para ti (a junio 2026):

- **Sui Overflow 2026** [VIRTUAL]. Pool de más de 500.000 dólares, con tracks de AI-agent, payments e infraestructura. Encaje perfecto con tus ideas 1, 2, 8 y 10. Virtual, sin viajar, premio grande. Es tu mejor primera apuesta.
- **Serie x402 (Coinbase / Google / SKALE / Solana).** Hackathones recurrentes de "Agentic Commerce x402" y el "Agents in Action" de Coinbase. Premios típicos de 50.000 más bounties por sponsor, muchos con track online. Encaje directo con ideas 1, 2, 9 y 10. Vigila solana.com/x402/hackathon y los anuncios de Coinbase Developer Platform.
- **Zama Bounty / Developer Program** [VIRTUAL, continuo]. No es un hackathon de fin de semana sino un programa continuo que paga por construir con FHE (fhEVM). Encaje con ideas 5 y 6. Ideal para aprender FHE cobrando, sin presión de reloj.
- **ETHGlobal Lisboa.** 24 a 26 de julio. Más de 125.000 en premios (1inch, Sui, World). Presencial en Portugal. Aplicación en ethglobal.com/events/lisbon2026.
- **ETHGlobal Tokio.** 25 a 27 de septiembre. Presencial, Japón.
- **ETHGlobal Mumbai.** Q4, alrededor de Devcon 8 (6 a 8 de noviembre). Presencial, India.
- **Plataformas continuas:** DoraHacks y Devpost siempre tienen hackathones cripto abiertos, muchos virtuales. Buenos para una segunda bala.

Ruta recomendada: empieza por **Sui Overflow (virtual, gran pool, tracks de agentes y pagos)** con la Idea 1. Mejor riesgo-recompensa: no viajas, el premio es grande, y el track encaja con lo que ya tienes construido.

Aviso: fechas y premios cambian, confirma siempre en la página oficial antes de comprometerte.

---

## 9. Plan de ataque del proyecto top (Idea 1 sobre base de Idea 7)

Proyecto: "Cartera con conciencia para agentes". Un smart account que deja a un agente de IA pagar solo vía x402, pero con políticas on-chain (presupuesto, allowlist, límite por hora) y veto con tu huella para montos grandes.

**El momento wow (los 15 segundos que ganan):** en vivo, el agente paga 3 o 4 recursos vía x402 solo, el contador sube. Luego intenta pagar a una dirección no autorizada o pasarse del presupuesto, y la cartera lo BLOQUEA on-chain en pantalla. Cierras con: "el agente quiso, la cartera no lo dejó. Autonomía con cinturón de seguridad."

**Reparto de las 36 a 48 horas:**
- Horas 0 a 2: llegas con tu base ya lista (smart account ERC-4337, paymaster, passkeys). Solo la conectas. No construyes esto en el evento, lo traes como template.
- Horas 2 a 12: el motor de políticas on-chain. Un módulo que valida cada UserOperation contra reglas (monto máximo, allowlist de destinos, límite por ventana de tiempo). Es lo nuevo y el corazón técnico.
- Horas 12 a 22: integración x402. Un agente simple (script con un LLM) que hace requests, recibe el 402, y paga vía la cartera. Usa el paymaster para que sea gasless.
- Horas 22 a 30: el veto con huella. Cuando el agente intenta un monto sobre el umbral, dispara una confirmación con passkey a tu teléfono. Ya tienes WebAuthn, reúsalo.
- Horas 30 a 40: pulir LA demo. Nada de features nuevas. Solo que el momento wow salga perfecto 10 de 10 veces. Graba un respaldo en video por si la red falla en vivo.
- Resto: el pitch de 2 minutos y el README.

**Qué track tocar:** agentic / x402 (premio principal), account abstraction (premio secundario), seguridad (si hay). Apunta a varios bounties con el mismo proyecto.

**Errores a evitar:** no metas swaps, ni earn, ni 5 pantallas. Una sola historia: el agente paga solo, pero la cartera tiene reglas. Si te sobra tiempo, suma las sub-cuentas desechables (Idea 4) como bonus, no como base.

**Guion de demo de 2 minutos:**
1. (15s) El problema: "Los agentes de IA ya pagan solos con x402. Genial, hasta que uno se corrompe y vacía tu cuenta. Hoy no hay frenos."
2. (30s) La solución en una frase, mostrando la cartera con sus reglas en pantalla.
3. (45s) El momento wow: el agente paga 3 recursos solo y gasless, contador subiendo. Luego intenta pasarse: BLOQUEADO on-chain.
4. (20s) El veto de huella: intenta un monto grande, te llega el prompt al teléfono, apruebas con FaceID.
5. (10s) Cierre: "Autonomía con cinturón de seguridad. Construido sobre cuentas inteligentes, passkeys y x402."

---

## Fuentes

- ETHGlobal, eventos y finalistas 2025-2026: https://ethglobal.com/
- AI agents, privacy y prediction markets en ETHGlobal Cannes 2026: https://crypto.news/ai-agents-privacy-and-prediction-markets-define-ethglobal-cannes-2026-finalists/
- x402, estándar de pagos internet-native (Coinbase): https://www.coinbase.com/developer-platform/discover/launches/x402
- x402 explicado (cómo pagan los agentes): https://eco.com/support/en/articles/12328618-x402-protocol-explained-how-ai-agents-pay-onchain
- Agentic payments, x402 y MPP (AMINA Bank): https://aminagroup.com/research/agentic-payments-explained-how-ai-agents-use-crypto-stablecoins-x402-and-mpp/
- FHE en 2026, proyectos y estado (KuCoin): https://www.kucoin.com/news/articles/fhe-in-2026-computing-on-encrypted-data-and-the-projects-making-private-blockchains-a-reality
- Infra de privacidad web3 ZK/FHE/TEE (BlockEden): https://blockeden.xyz/blog/2026/02/04/web3-privacy-infrastructure-zk-fhe-tee-reshaping-blockchain/
- "The smartest wallet wins" (The Block): https://www.theblock.co/post/375647/smart-wallets-ai-ux-mainstream-crypto-adoption
- Guía para ganar hackathones web3 (Bitcoin.com): https://news.bitcoin.com/the-definitive-guide-to-winning-web3-hackathons/
- Criterios de jurado de hackathon (TAIKAI): https://taikai.network/en/blog/hackathon-judging
- ETHGlobal Lisboa 2026 (24-26 jul, 125k+): https://ethglobal.com/events/lisbon2026
- ETHGlobal, calendario de eventos 2026: https://ethglobal.com/events
- SF Agentic Commerce x402 Hackathon (SKALE/Google/Coinbase): https://blog.skale.space/blog/skale-google-coinbase-virtuals-edge-node-and-vodafone-present-the-sf-agentic-commerce-x402-hackathon-with-50-000-in-prizes
- Solana x402 Hackathon: https://solana.com/x402/hackathon
- Coinbase, ganadores del Agents in Action (pagos autónomos): https://www.coinbase.com/developer-platform/discover/launches/agents-in-action-winners
- Zama Bounty Program (FHE): https://github.com/zama-ai/bounty-program
- awesome-x402 (recursos y SDKs): https://github.com/xpaysh/awesome-x402
