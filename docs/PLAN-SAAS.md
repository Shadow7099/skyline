# Plan: convertir Skyline en un SaaS autogestionable

Objetivo: que cualquier organizador de eventos pueda registrarse, configurar su
marca y sus eventos, invitar a su staff, operar la puerta y la logística, y pagar
su suscripción **sin intervención manual**. Skyline Halloween Fest pasa a ser el
primer cliente (tenant) de la plataforma.

## 1. Estado actual (noviembre 2026)

- Frontend: HTML estático (`index`, `comprar`, `confirmacion`, `admin`, `puerta`,
  `parqueadero`, `crew`, `fila`, `terminos`).
- Backend: Supabase `kyaegqllwjihaoudazoh`, Edge Functions `admin-tickets`,
  `door-sync`, `create-order`, `vip-order`, `parking-order`, `get-tickets`,
  `reconcile-orders`, `promoter-signup`. El código de las funciones **no está en
  este repo**.
- Autenticación: PIN compartido (uno para admin, otro para puerta).
- Fijo en código: nombre del evento, fechas (30 y 31 oct), niveles
  (General / VIP / Vice), etapas y precios, logo, fuentes, fondo, WhatsApp,
  Instagram, Meta Pixel, pasarela Bold.

## 2. Modelo de datos multi-cliente

Todas las tablas de negocio llevan `org_id` y RLS por membresía.

| Tabla | Campos clave |
|---|---|
| `orgs` | id, slug (subdominio/URL), nombre, logo_url, colores, fuente, whatsapp, instagram, pixel_id, plan, estado_suscripcion |
| `org_members` | org_id, user_id (auth.users), rol: `owner` · `admin` · `taquilla` · `portero` · `logistica` |
| `events` | org_id, slug, nombre, sede, zona horaria, estado (borrador/publicado/cerrado), media |
| `event_days` | event_id, fecha, hora apertura, hora cierre venta online |
| `ticket_tiers` | event_id, nombre (General, VIP…), días que cubre, cupo, orden |
| `price_stages` | tier_id, nombre de la etapa, precio, cupo, desde/hasta |
| `promos` | event_id, código o regla por noche, % o valor, vigencia |
| `orders` / `tickets` | lo actual + org_id, event_id, tier_id, stage_id |
| `doors` | event_id, nombre, días habilitados, tiers permitidos |
| `door_devices` | door_id, token del dispositivo, último sync (reemplaza el PIN de puerta) |
| `scans` | ticket_id, door_id, device_id, member_id, resultado, timestamp |
| `parking_zones` | event_id, cupo, precio |
| `promoters` / `tags` | lo actual + org_id |
| `payment_accounts` | org_id, proveedor (Bold/Wompi/MercadoPago), llaves cifradas (Vault) |
| `subscriptions` | org_id, plan, proveedor, estado, periodo_actual_fin |

## 3. Autenticación y roles

- Supabase Auth (email + magic link / contraseña) reemplaza los PIN.
- `org_members.rol` define qué ve cada uno en el panel:
  - **owner/admin**: todo, incluido facturación y staff.
  - **taquilla**: cortesías, ventas directas y la lista de boletas.
  - **logistica**: puertas, parqueadero, aforo en vivo.
  - **portero**: solo `puerta`.
- Puerta: el admin genera un **código de emparejamiento** o QR por puerta. El
  dispositivo lo escanea y recibe un token `door_devices` revocable. Se conserva
  el modo offline actual (service worker y cola de sync).

## 4. Frontend

- Una sola app por rol, parametrizada por organización/evento:
  - Público: `/{org}/{evento}` (landing), `/{org}/{evento}/comprar`, `/confirmacion`.
  - `/app`: login, onboarding, panel (hoy `admin.html`).
  - `/puerta`: escáner (hoy `puerta.html`).
- Todo lo fijo pasa a leerse de `orgs` + `events` vía una función pública
  `public-config` (cacheada).
- Nuevas secciones del panel:
  1. **Onboarding**: nombre, slug, logo, colores, contacto → primer evento.
  2. **Eventos**: CRUD de días, niveles, etapas, cupos, promos, publicar/cerrar.
  3. **Staff**: invitar por email, asignar rol, revocar.
  4. **Puertas y dispositivos**: crear puertas, emparejar/revocar dispositivos.
  5. **Logística**: aforo en vivo por puerta/hora, parqueadero, dobles usos.
  6. **Pagos**: conectar la pasarela propia del cliente (para vender boletas).
  7. **Facturación**: plan, método de pago, facturas.

## 5. Cobro del SaaS

- Planes sugeridos (para validar): Gratis (1 evento, comisión por boleta),
  Pro (mensual, eventos ilimitados), Pro + puerta (dispositivos ilimitados).
- Proveedor de suscripción con webhooks → `subscriptions` → `orgs.plan`.
- Límites aplicados en las Edge Functions (eventos activos, dispositivos, staff).
- Cada cliente cobra sus boletas con **su propia** cuenta de pasarela; las
  llaves se guardan en Supabase Vault y nunca llegan al navegador.

## 6. Fases

1. **Traer el backend al repo**: exportar las Edge Functions actuales a
   `supabase/functions/` y el esquema a `supabase/migrations/`. Sin cambios de
   comportamiento.
2. **Multi-cliente en BD**: crear `orgs` y `org_members`, añadir `org_id` a todo,
   migrar Skyline como org #1, activar RLS.
3. **Auth y roles**: login con Supabase Auth en admin y puerta; mantener el PIN
   como respaldo hasta terminada la migración.
4. **Configuración dinámica**: `events`/`tiers`/`stages`/`doors` en BD;
   `public-config`; quitar del HTML todo lo que está fijo.
5. **Onboarding y staff**: registro self-service, invitaciones.
6. **Puertas y logística**: emparejamiento de dispositivos, tablero de aforo.
7. **Pagos y suscripción**: pasarela por cliente y facturación del SaaS.
8. **Endurecimiento**: auditoría (`scans`, acciones de admin), rate limits,
   backups y página de estado.

## 7. Bloqueo actual

La cuenta de Supabase conectada a la sesión no tiene el proyecto
`kyaegqllwjihaoudazoh`. Hay que conectarla para empezar la fase 1.
