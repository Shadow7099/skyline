# Graph Report - skyline  (2026-10-09)

## Corpus Check
- Corpus is ~22,739 words - fits in a single context window. You may not need a graph.

## Summary
- 206 nodes · 415 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.87)
- Token cost: 232,319 input · 0 output

## Community Hubs (Navigation)
- Panel Admin de Boletas
- Confirmación y Entrega de Boletas
- Admisión en Puerta
- Flujo de Compra y Pago
- Sincronización Offline del Escáner
- Sitio Público y Términos
- Render y Compartir Boleta
- Registro Crew y Edge Functions
- PWA del Escáner

## God Nodes (most connected - your core abstractions)
1. `confirmacion.html (Payment confirmation & tickets)` - 31 edges
2. `comprar.html` - 28 edges
3. `sync()` - 18 edges
4. `terminos.html` - 16 edges
5. `tryAdmit()` - 13 edges
6. `api()` - 12 edges
7. `evaluate()` - 11 edges
8. `index.html` - 11 edges
9. `isTestMode()` - 10 edges
10. `state (door scanner local state)` - 10 edges

## Surprising Connections (you probably didn't know these)
- `waMessage()` --semantically_similar_to--> `promoMessage()`  [INFERRED] [semantically similar]
  crew.html → admin.html
- `comprar validateForm()` --references--> `Terms §10 Aceptación`  [INFERRED]
  comprar.html → terminos.html
- `comprar rememberOrder()` --semantically_similar_to--> `confirmacion rememberOrder()`  [INFERRED] [semantically similar]
  comprar.html → confirmacion.html
- `renderStats()` --shares_data_with--> `Check-ins entity`  [INFERRED]
  admin.html → puerta.html
- `Check-ins entity` --conceptually_related_to--> `puerta.html`  [INFERRED]
  puerta.html → admin.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **QR scan to admission verdict flow** — puerta_scanloop, puerta_handlecode, puerta_parseandverify, puerta_evaluate, puerta_tryadmit, puerta_showverdict [EXTRACTED 1.00]
- **Offline check-in queue and door-sync pipeline** — puerta_admitlocal, puerta_ls_sky_local_checkins, puerta_schedulesync, puerta_sync, concept_door_sync, puerta_mergetickets, puerta_addservercheckin [EXTRACTED 1.00]
- **Offline signed-ticket verification** — concept_skyline_qr_format, puerta_public_jwk, concept_webcrypto, puerta_parseandverify, puerta_b64urltobytes [EXTRACTED 1.00]
- **Courtesy ticket issuance: create -> render PNG with QR -> share/download** — admin_create_tickets_handler, admin_showresult, admin_renderticket, concept_qrcode_lib, admin_share, admin_download [EXTRACTED 1.00]
- **Promoter lifecycle: web signup -> admin approval -> code shared by WhatsApp** — crew_submit_handler, concept_edge_fn_promoter_signup, admin_renderpromoters, concept_promoters, concept_whatsapp [INFERRED 0.85]
- **admin-tickets edge function action dispatch (login/list/create/revoke/sales_summary/promoters)** — admin_api, admin_refresh, admin_loadsales, admin_loadpromoters, admin_togglerevoke, concept_edge_fn_admin_tickets [EXTRACTED 1.00]
- **Ticket purchase flow: landing -> checkout -> create-order -> Bold -> confirmation/get-tickets** — index, comprar, concept_fn_create_order, concept_bold, confirmacion, concept_fn_get_tickets [EXTRACTED 1.00]
- **Per-device purchase memory via localStorage shared across checkout and confirmation** — concept_ls_sky_orders, concept_ls_sky_buy_draft, comprar_rememberorder, confirmacion_rememberorder, comprar_showresume, confirmacion_renderotherorders [INFERRED 0.85]
- **Client-side ticket PNG rendering with QR** — confirmacion_renderticket, confirmacion_loadlogo, confirmacion_fontsready, concept_qrcode_generator, concept_ticket_qr, confirmacion_download, confirmacion_share [EXTRACTED 1.00]

## Communities (10 total, 1 thin omitted)

### Community 0 - "Panel Admin de Boletas"
Cohesion: 0.09
Nodes (31): api(), card(), Create tickets (Crear boletas) handler, el(), enter(), fileName(), loadPromoters(), loadSales() (+23 more)

### Community 1 - "Confirmación y Entrega de Boletas"
Cohesion: 0.13
Nodes (34): comprar lsGet(), comprar showResume(), Edge Function get-tickets, localStorage key skyline_pixel_purchase_<order_id>, localStorage key sky_orders, Meta (Facebook) Pixel, Order status (pagado / pendiente_pago / fallido), qrcode-generator 1.4.4 library (inline) (+26 more)

### Community 2 - "Admisión en Puerta"
Cohesion: 0.11
Nodes (23): admitLocal(), allCheckins(), byDevice(), checkinsFor(), closeSearch(), closeVerdict(), currentNight(), evaluate() (+15 more)

### Community 3 - "Flujo de Compra y Pago"
Cohesion: 0.14
Nodes (29): promoMessage(), comprar.html, comprar applyPromo(), comprar applyServerPrices(), comprar boldReady(), comprar clearMsg(), comprar currentBuyer(), comprar loadPrices() (+21 more)

### Community 4 - "Sincronización Offline del Escáner"
Cohesion: 0.12
Nodes (26): BarcodeDetector Web API, Screen Wake Lock API, addServerCheckin(), indexTickets(), keepAwake(), Login screen (#login), localStorage sky_conflicts, localStorage sky_device (+18 more)

### Community 5 - "Sitio Público y Términos"
Cohesion: 0.15
Nodes (17): renderPromoters(), Instagram, WhatsApp wa.me deep links, WhatsApp support (wa.me/573133308294), confirmacion renderNotFound(), crew.html (Skyline Crew signup), index.html, Mobile nav toggle (+9 more)

### Community 6 - "Render y Compartir Boleta"
Cohesion: 0.18
Nodes (9): admin.html (Panel de boletas), download(), loadLogo(), renderTicket(), share(), showResult(), Inline qrcode-generator library, Supabase Storage bucket skyline-media (logo, Eurostile font) (+1 more)

### Community 7 - "Registro Crew y Edge Functions"
Cohesion: 0.25
Nodes (7): Edge function admin-tickets, Edge function promoter-signup, Supabase, showSuccess(), Crew form submit handler, validate(), waLink()

### Community 8 - "PWA del Escáner"
Cohesion: 0.33
Nodes (5): jsQR 1.4.0 library, puerta.html (Door Scanner PWA), scanLoop(), FILES, puerta.webmanifest

## Knowledge Gaps
- **15 isolated node(s):** `PUBLIC_JWK (ECDSA P-256 public key)`, `BarcodeDetector Web API`, `Web Crypto API (ECDSA verify)`, `Screen Wake Lock API`, `puerta.webmanifest` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 35 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Supabase` connect `Registro Crew y Edge Functions` to `Panel Admin de Boletas`, `Confirmación y Entrega de Boletas`, `Flujo de Compra y Pago`, `Render y Compartir Boleta`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **What connects `PUBLIC_JWK (ECDSA P-256 public key)`, `BarcodeDetector Web API`, `Web Crypto API (ECDSA verify)` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Panel Admin de Boletas` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Why does `Supabase Edge Function door-sync` connect `Panel Admin de Boletas` to `Admisión en Puerta`, `Sincronización Offline del Escáner`, `Registro Crew y Edge Functions`?**
  _High betweenness centrality (0.357) - this node is a cross-community bridge._
- **Should `Confirmación y Entrega de Boletas` be split into smaller, more focused modules?**
  _Cohesion score 0.13368983957219252 - nodes in this community are weakly interconnected._
- **Why does `Supabase Storage bucket skyline-media` connect `Confirmación y Entrega de Boletas` to `Flujo de Compra y Pago`, `Sitio Público y Términos`, `Registro Crew y Edge Functions`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Should `Admisión en Puerta` be split into smaller, more focused modules?**
  _Cohesion score 0.11088709677419355 - nodes in this community are weakly interconnected._