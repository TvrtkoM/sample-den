# Graph Report - .  (2026-05-14)

## Corpus Check
- 91 files · ~53,043 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1114 nodes · 1452 edges · 35 communities (27 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.88)
- Token cost: 3,800 input · 2,100 output

## Community Hubs (Navigation)
- [[_COMMUNITY_User Model Types|User Model Types]]
- [[_COMMUNITY_Prisma Namespace Core|Prisma Namespace Core]]
- [[_COMMUNITY_Auth Pages & Forms|Auth Pages & Forms]]
- [[_COMMUNITY_Purchase Model Types|Purchase Model Types]]
- [[_COMMUNITY_Account Model Types|Account Model Types]]
- [[_COMMUNITY_CartItem Model Types|CartItem Model Types]]
- [[_COMMUNITY_Session Model Types|Session Model Types]]
- [[_COMMUNITY_App Routes & Layout|App Routes & Layout]]
- [[_COMMUNITY_Webhook Event Model|Webhook Event Model]]
- [[_COMMUNITY_Verification Model Types|Verification Model Types]]
- [[_COMMUNITY_Cart UI Components|Cart UI Components]]
- [[_COMMUNITY_Navbar & Verification UI|Navbar & Verification UI]]
- [[_COMMUNITY_Feature Pages & API Routes|Feature Pages & API Routes]]
- [[_COMMUNITY_Auth & Data Access Layer|Auth & Data Access Layer]]
- [[_COMMUNITY_Prisma Filter Types|Prisma Filter Types]]
- [[_COMMUNITY_Client-Side Providers|Client-Side Providers]]
- [[_COMMUNITY_UI Primitive Dependencies|UI Primitive Dependencies]]
- [[_COMMUNITY_Cart & Sanity Types|Cart & Sanity Types]]
- [[_COMMUNITY_Prisma Browser Enums|Prisma Browser Enums]]
- [[_COMMUNITY_Prisma Client Core|Prisma Client Core]]
- [[_COMMUNITY_Upload API (S3 + Sanity)|Upload API (S3 + Sanity)]]
- [[_COMMUNITY_Upload External Services|Upload External Services]]
- [[_COMMUNITY_Better Auth Integration|Better Auth Integration]]
- [[_COMMUNITY_updateAuthRoutes|updateAuthRoutes]]
- [[_COMMUNITY_revalidateAuthRoutes|revalidateAuthRoutes]]
- [[_COMMUNITY_redirectToHome|redirectToHome]]
- [[_COMMUNITY_Class Names Utility|Class Names Utility]]
- [[_COMMUNITY_Signup Cookie Util|Signup Cookie Util]]
- [[_COMMUNITY_Duration Formatter|Duration Formatter]]
- [[_COMMUNITY_Session Context|Session Context]]
- [[_COMMUNITY_App Loading|App Loading]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 43 edges
2. `Button()` - 19 edges
3. `useSession()` - 14 edges
4. `getSession()` - 13 edges
5. `SamplesPage (app/samples/page.tsx)` - 12 edges
6. `cn utility` - 10 edges
7. `Button` - 9 edges
8. `API Checkout Sessions Route (app/api/payment/checkout-sessions/route.ts)` - 8 edges
9. `SamplesList / SamplesListContainer` - 8 edges
10. `getCartSamplesIds()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `auth (betterAuth instance)` --shares_data_with--> `Session (Prisma model)`  [INFERRED]
  lib/auth.ts → prisma/schema.prisma
- `auth (betterAuth instance)` --shares_data_with--> `User (Prisma model)`  [INFERRED]
  lib/auth.ts → prisma/schema.prisma
- `ProcessedWebhookEvent (Prisma model)` --conceptually_related_to--> `stripe (Stripe instance)`  [INFERRED]
  prisma/schema.prisma → lib/stripe/server.ts
- `Purchase (Prisma model)` --conceptually_related_to--> `stripe (Stripe instance)`  [INFERRED]
  prisma/schema.prisma → lib/stripe/server.ts
- `useAddToCart` --shares_data_with--> `CartItem (Prisma model)`  [INFERRED]
  hooks/use-cart.ts → prisma/schema.prisma

## Hyperedges (group relationships)
- **Cart data flow: API -> DB -> Sanity -> Client hooks** — fetchcart_fetchCart, fetchcart_addToCart, fetchcart_removeFromCart, usecart_useCart, usecart_useAddToCart, usecart_useRemoveFromCart, db_getCartSamplesIds, schema_cartitem [INFERRED 0.85]
- **Auth session flow: betterAuth -> getSession -> SessionContext -> useSession** — auth_auth, getsession_getSession, sessioncontext_sessionContext, sessioncontext_useSessionContext, usesession_useSession [EXTRACTED 0.95]
- **Sanity query pipeline: groq queries -> sanityClient -> fetch functions** — samples_samplesPageQuery, samples_samplesByIdsQuery, samples_samplesPriceSumByIdsQuery, sanityclient_sanityClient, fetchsamples_fetchSamplesPage, fetchsamples_fetchSamplesByIds, fetchsamples_fetchSamplesPriceSumByIds [EXTRACTED 0.95]
- **Anonymous user cart migration on sign-in** — auth_auth, db_migrateCart, utils_getAnonymousUserIdCookie, schema_cartitem, schema_user [EXTRACTED 0.95]
- **Authentication Flow** — app_signin_page, app_signup_page, app_verify_page, api_auth_route, lib_auth, component_public_guard, external_better_auth [INFERRED 0.95]
- **Payment/Checkout Flow** — api_checkout_sessions_route, api_webhook_route, app_checkout_success_page, lib_stripe_server, external_stripe, prisma_model_purchase, prisma_model_processed_webhook_event, prisma_model_cart_item [INFERRED 0.95]
- **Cart Management** — api_cart_route, lib_db, prisma_model_cart_item, component_cart_drawer, app_samples_page [INFERRED 0.85]
- **Sample Upload Pipeline (WAV to S3, MP3 to Sanity)** — api_upload_route, external_aws_s3, external_sanity [EXTRACTED 1.00]
- **shadcn/ui primitive components using CVA and Radix UI** — ui_badge, ui_button, ui_dropdown_menu, ui_input, ui_label, ui_separator, ui_skeleton, ui_field, ui_back_button, ui_pagination [INFERRED 0.95]
- **Samples feature components** — samples_sampleitem, samples_sampleplayer, samples_samplesearch, samples_sampleslist [INFERRED 0.95]
- **Authentication Flow Components** — publicguard_component, signinform_component, signupform_component, verifyemail_component, googlesigninbutton_component [INFERRED 0.95]
- **Cart UI Components** — cartdrawer_component, cart_component, cartitem_component, cartheader_component, cartfooter_component, carticon_component [INFERRED 0.95]
- **App Providers Setup** — appprovider_component, sessioncontext_ctx, getqueryclient_lib, cartstore_lib [INFERRED 0.85]
- **Anonymous Cart Transfer on Auth** — signinform_component, signupform_component, usesession_hook, utils_lib [INFERRED 0.85]

## Communities (35 total, 8 thin omitted)

### Community 0 - "User Model Types"
Cohesion: 0.02
Nodes (110): AggregateUser, BoolFieldUpdateOperationsInput, DateTimeFieldUpdateOperationsInput, GetUserAggregateType, GetUserGroupByPayload, NullableBoolFieldUpdateOperationsInput, NullableStringFieldUpdateOperationsInput, Prisma__UserClient (+102 more)

### Community 1 - "Prisma Namespace Core"
Cohesion: 0.02
Nodes (106): AccountScalarFieldEnum, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, BooleanFieldRefInput (+98 more)

### Community 2 - "Auth Pages & Forms"
Cohesion: 0.05
Nodes (58): GoogleSignInButton(), FormData, SignInPage(), FormData, SignUpForm(), UserDropdown(), CartFooterProps, CartTotalPrice() (+50 more)

### Community 3 - "Purchase Model Types"
Cohesion: 0.02
Nodes (82): AggregatePurchase, GetPurchaseAggregateType, GetPurchaseGroupByPayload, IntFieldUpdateOperationsInput, Prisma__PurchaseClient, PurchaseAggregateArgs, PurchaseAvgAggregateInputType, PurchaseAvgAggregateOutputType (+74 more)

### Community 4 - "Account Model Types"
Cohesion: 0.03
Nodes (76): AccountAggregateArgs, AccountCountAggregateInputType, AccountCountAggregateOutputType, AccountCountArgs, AccountCountOrderByAggregateInput, AccountCreateArgs, AccountCreateInput, AccountCreateManyAndReturnArgs (+68 more)

### Community 5 - "CartItem Model Types"
Cohesion: 0.03
Nodes (76): AggregateCartItem, CartItemAggregateArgs, CartItemCountAggregateInputType, CartItemCountAggregateOutputType, CartItemCountArgs, CartItemCountOrderByAggregateInput, CartItemCreateArgs, CartItemCreateInput (+68 more)

### Community 6 - "Session Model Types"
Cohesion: 0.03
Nodes (75): AggregateSession, GetSessionAggregateType, GetSessionGroupByPayload, Prisma__SessionClient, SessionAggregateArgs, SessionCountAggregateInputType, SessionCountAggregateOutputType, SessionCountArgs (+67 more)

### Community 7 - "App Routes & Layout"
Cohesion: 0.06
Nodes (39): { POST, GET }, geistMono, geistSans, metadata, RootLayout(), PublicGuard(), DELETE(), GET() (+31 more)

### Community 8 - "Webhook Event Model"
Cohesion: 0.04
Nodes (54): AggregateProcessedWebhookEvent, GetProcessedWebhookEventAggregateType, GetProcessedWebhookEventGroupByPayload, Prisma__ProcessedWebhookEventClient, ProcessedWebhookEventAggregateArgs, ProcessedWebhookEventCountAggregateInputType, ProcessedWebhookEventCountAggregateOutputType, ProcessedWebhookEventCountArgs (+46 more)

### Community 9 - "Verification Model Types"
Cohesion: 0.04
Nodes (54): AggregateVerification, GetVerificationAggregateType, GetVerificationGroupByPayload, Prisma__VerificationClient, VerificationAggregateArgs, VerificationCountAggregateInputType, VerificationCountAggregateOutputType, VerificationCountArgs (+46 more)

### Community 10 - "Cart UI Components"
Cohesion: 0.09
Nodes (33): CartDrawerContent(), CartDrawerImpl(), CartHeader(), CartIcon(), ClientOnly(), addToCart(), fetchCart(), removeFromCart() (+25 more)

### Community 11 - "Navbar & Verification UI"
Cohesion: 0.1
Nodes (16): ClearSignUpVerificationCookie(), fetchSamplesPage(), fetchSamplesPriceSumByIds(), samplesByIdsQuery, samplesPageQuery, samplesPriceSumByIdsQuery, useSamplesPage(), sanityClient (+8 more)

### Community 12 - "Feature Pages & API Routes"
Cohesion: 0.08
Nodes (34): API Cart Route (app/api/cart/route.ts), API Checkout Sessions Route (app/api/payment/checkout-sessions/route.ts), API Webhook Route (app/api/payment/webhook/route.ts), CheckoutSuccessPage (app/(payment)/checkout/success/page.tsx), HomePage (app/page.tsx), RootLayout (app/layout.tsx), SamplesPage (app/samples/page.tsx), SignInPage (app/(auth)/sign-in/page.tsx) (+26 more)

### Community 13 - "Auth & Data Access Layer"
Cohesion: 0.07
Nodes (33): auth (betterAuth instance), getCartSamplesIds, migrateCart, addToCart, fetchCart, removeFromCart, fetchSamplesByIds, fetchSamplesPage (+25 more)

### Community 14 - "Prisma Filter Types"
Cohesion: 0.06
Nodes (31): BoolFilter, BoolNullableFilter, BoolNullableWithAggregatesFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter (+23 more)

### Community 15 - "Client-Side Providers"
Cohesion: 0.1
Nodes (31): AppPagination, AppProvider, auth (Better Auth), auth-client, Cart, CartDrawer, CartFooter, CartHeader (+23 more)

### Community 16 - "UI Primitive Dependencies"
Cohesion: 0.11
Nodes (29): AppPagination, class-variance-authority, @mantine/hooks useDebouncedCallback, nuqs useQueryState, @radix-ui/react-dropdown-menu, @radix-ui/react-label, @radix-ui/react-separator, @radix-ui/react-slot (+21 more)

### Community 17 - "Cart & Sanity Types"
Cohesion: 0.09
Nodes (20): CartProps, AllSanitySchemaTypes, Category, Geopoint, HighResFile, MediaTag, Sample, SamplesByIdsQueryResult (+12 more)

### Community 18 - "Prisma Browser Enums"
Cohesion: 0.09
Nodes (20): AccountScalarFieldEnum, CartItemScalarFieldEnum, ModelName, NullsOrder, NullTypes, ProcessedWebhookEventScalarFieldEnum, PurchaseScalarFieldEnum, QueryMode (+12 more)

### Community 19 - "Prisma Client Core"
Cohesion: 0.29
Nodes (4): config, LogOptions, PrismaClient, PrismaClientConstructor

### Community 20 - "Upload API (S3 + Sanity)"
Cohesion: 0.38
Nodes (5): POST(), s3, sanity, signPayload(), timingSafeEqualHex()

### Community 23 - "Upload External Services"
Cohesion: 0.67
Nodes (3): API Upload Route (app/api/upload/route.ts), AWS S3 (external storage), Sanity CMS (external CMS)

### Community 24 - "Better Auth Integration"
Cohesion: 0.67
Nodes (3): API Auth Route (app/api/auth/[...all]/route.ts), Better Auth (external auth library), lib/auth (Better Auth instance)

## Knowledge Gaps
- **791 isolated node(s):** `adapter`, `globalForPrisma`, `authClient`, `resend`, `cartPageNumAtom` (+786 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Boolean` connect `Auth Pages & Forms` to `Prisma Namespace Core`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `adapter`, `globalForPrisma`, `authClient` to the rest of the system?**
  _791 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User Model Types` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Prisma Namespace Core` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Auth Pages & Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Purchase Model Types` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Account Model Types` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._