# Multi-Tenant Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         INCOMING REQUESTS                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────────┐
        │            Next.js Middleware                  │
        │         (src/middleware.ts)                    │
        │                                                │
        │  • Extract hostname from request               │
        │  • Detect tenant vs main app                   │
        │  • Check authentication                        │
        │  • Route to appropriate handler                │
        └────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
         ┌─────────────────┐      ┌─────────────────────┐
         │   MAIN APP      │      │   TENANT APP        │
         │   (Primary      │      │   (Subdomain/       │
         │   Domain)       │      │   Custom Domain)    │
         └─────────────────┘      └─────────────────────┘
                 │                          │
                 ▼                          ▼
    ┌──────────────────────┐    ┌──────────────────────────┐
    │  Main App Routes     │    │  Tenant Routes           │
    │                      │    │  (tenant) route group    │
    │  /login              │    │                          │
    │  /register           │    │  / → Dashboard           │
    │  /dashboard          │    │  /auth/login             │
    │  /dashboard/tenants  │    │  /auth/register          │
    └──────────────────────┘    │  /users                  │
                                │  /products               │
                                │  /settings               │
                                └──────────────────────────┘
```

## Tenant Detection Flow

```
Request: http://tenant1.localhost:3000/users
                    │
                    ▼
         ┌──────────────────────┐
         │  Middleware          │
         │  1. Get hostname     │
         │     → tenant1.localhost:3000
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  getTenantFromHost() │
         │  2. Parse hostname   │
         │     → Extract "tenant1"
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Tenant Config       │
         │  {                   │
         │    code: "tenant1"   │
         │    domain: "..."     │
         │    isSubdomain: true │
         │  }                   │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Route to:           │
         │  app/(tenant)/users  │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Server Component    │
         │  requireTenant()     │
         │  → Returns tenant    │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Render Component    │
         │  with tenantCode     │
         └──────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      TENANT APPLICATION                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Tenant Layout        │
                    │   (tenant)/layout.tsx  │
                    │                        │
                    │   • Tenant branding    │
                    │   • Common header      │
                    │   • Wraps all pages    │
                    └────────────────────────┘
                                 │
                    ┌────────────┴───────────────┐
                    │                            │
                    ▼                            ▼
        ┌──────────────────────┐    ┌──────────────────────┐
        │   Server Pages       │    │   Client Components  │
        │   (page.tsx)         │    │   "use client"       │
        │                      │    │                      │
        │   • Fetch tenant     │    │   • Interactive UI   │
        │   • Get context      │    │   • Form handling    │
        │   • Load template    │    │   • State management │
        │   • Pass to client   │    │   • API calls        │
        └──────────────────────┘    └──────────────────────┘
```

## Template System

```
┌─────────────────────────────────────────────────────────────────┐
│                      UI SERVICE SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌───────────────┐
│  Auth Service │      │  User Service   │      │ Product       │
│               │      │                 │      │ Service       │
├───────────────┤      ├─────────────────┤      ├───────────────┤
│ Templates:    │      │ Templates:      │      │ Templates:    │
│ • Modern      │      │ • Table         │      │ • Grid        │
│ • Classic     │      │ • Grid          │      │ • List        │
│ • Minimal     │      │ • List          │      │ • Cards       │
└───────────────┘      └─────────────────┘      └───────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌───────────────┐
│ Component     │      │ Component       │      │ Component     │
│ Rendered      │      │ Rendered        │      │ Rendered      │
└───────────────┘      └─────────────────┘      └───────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              TENANT AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. User visits: http://tenant1.localhost:3000/auth/login
                                │
                                ▼
2. Middleware detects tenant → tenant1
                                │
                                ▼
3. Routes to: (tenant)/auth/login/page.tsx
                                │
                                ▼
4. Server Component:
   • Gets tenant context → "tenant1"
   • Selects template → AUTH_MODERN
   • Renders: <TenantLoginModern tenantCode="tenant1" />
                                │
                                ▼
5. Client Component:
   • Displays login form
   • User enters credentials
   • On submit:
                                │
                                ▼
6. API Call:
   POST /auth/login
   {
     email: "user@example.com",
     password: "password",
     tenantCode: "tenant1"  ← Important!
   }
                                │
                                ▼
7. Backend:
   • Validates credentials
   • Checks tenant context
   • Returns JWT token
                                │
                                ▼
8. Frontend:
   • Stores token in cookie
   • Redirects to: http://tenant1.localhost:3000/
                                │
                                ▼
9. Middleware:
   • Detects authenticated user
   • Allows access to protected pages
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TENANT DATA FLOW                              │
└─────────────────────────────────────────────────────────────────┘

Frontend (Browser)
        │
        │ http://tenant1.localhost:3000/users
        │
        ▼
┌───────────────────┐
│   Middleware      │
│   tenant="tenant1"│
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Server Component │
│  • getTenant()    │
│  • Fetch data     │
└───────────────────┘
        │
        │ API Request
        │ + tenantCode: "tenant1"
        │
        ▼
┌───────────────────┐
│   Backend API     │
│   /tenants/       │
│   tenant1/users   │
└───────────────────┘
        │
        │ SQL: WHERE tenant_id = 'tenant1'
        │
        ▼
┌───────────────────┐
│   Database        │
│   • User data     │
│   • Filtered by   │
│     tenant_id     │
└───────────────────┘
        │
        │ Returns tenant-specific data
        │
        ▼
┌───────────────────┐
│  Server Component │
│  • Receives data  │
│  • Passes to      │
│    client comp    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Client Component │
│  • Renders UI     │
│  • Shows tenant1  │
│    users only     │
└───────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION SETUP                            │
└─────────────────────────────────────────────────────────────────┘

DNS Configuration:
┌──────────────────────────────────────┐
│  Domain: example.com                 │
│                                      │
│  A     @        → Server IP          │
│  A     *        → Server IP (wildcard)│
│  CNAME www      → example.com        │
│                                      │
│  Result:                             │
│  • example.com        → Main app     │
│  • tenant1.example.com → Tenant 1    │
│  • tenant2.example.com → Tenant 2    │
│  • *.example.com      → Any tenant   │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│  Reverse Proxy (nginx/Apache)       │
│                                      │
│  server {                            │
│    listen 80;                        │
│    server_name *.example.com;        │
│                                      │
│    location / {                      │
│      proxy_pass http://nextjs:3000;  │
│      proxy_set_header Host $host;    │
│    }                                 │
│  }                                   │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│  Next.js Application                 │
│  • Middleware handles routing        │
│  • Server Components for pages       │
│  • API routes for data               │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│  Backend API                         │
│  • Tenant-aware endpoints            │
│  • Data isolation                    │
│  • Authentication                    │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│  Database                            │
│  • Multi-tenant schema               │
│  • Row-level security                │
│  • Tenant isolation                  │
└──────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

Layer 1: DNS/Network
├─ Wildcard DNS for subdomains
└─ SSL/TLS certificates

Layer 2: Reverse Proxy
├─ Rate limiting
├─ DDoS protection
└─ Header validation

Layer 3: Next.js Middleware
├─ Tenant detection & validation
├─ Authentication checks
├─ Route protection
└─ Cookie validation

Layer 4: Server Components
├─ Tenant context validation
├─ Server-side data fetching
└─ No sensitive data to client

Layer 5: API Layer
├─ JWT token validation
├─ Tenant context verification
└─ Request authorization

Layer 6: Database
├─ Row-level security
├─ Tenant isolation
└─ Query filtering
```

## File Organization

```
ideastoweb-next-frontend/
│
├── src/
│   ├── app/
│   │   ├── (auth)/              ← Main app auth (grouped route)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (tenant)/            ← Tenant pages (grouped route)
│   │   │   ├── layout.tsx       ← Tenant-wide layout
│   │   │   ├── page.tsx         ← Tenant dashboard
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   └── settings/
│   │   │
│   │   ├── dashboard/           ← Main app dashboard
│   │   ├── layout.tsx           ← Root layout
│   │   └── page.tsx             ← Homepage
│   │
│   ├── components/
│   │   ├── auth/                ← Main app components
│   │   └── tenant/              ← Tenant components
│   │       ├── auth/            ← Auth templates
│   │       ├── users/           ← User templates
│   │       └── products/        ← Product templates
│   │
│   ├── lib/
│   │   ├── tenant.ts            ← Tenant utilities (client-safe)
│   │   ├── tenantContext.ts     ← Server-side context
│   │   ├── cookies.ts
│   │   └── tokenManager.ts
│   │
│   ├── models/
│   │   ├── UIService.ts         ← UI service definitions
│   │   ├── Tenant.ts
│   │   └── User.ts
│   │
│   ├── api/
│   │   ├── UIServiceApi.ts      ← UI service API
│   │   ├── AuthApi.ts
│   │   └── TenantApi.ts
│   │
│   └── middleware.ts            ← Request routing logic
│
├── .env.example                 ← Environment template
├── next.config.ts               ← Next.js config
├── TENANT_ROUTING_GUIDE.md      ← Full documentation
└── IMPLEMENTATION_SUMMARY.md    ← Quick reference
```
