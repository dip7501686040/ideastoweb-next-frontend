# IdeasToWeb - Multi-Tenant SaaS Frontend

A complete multi-tenant SaaS platform built with Next.js 16, featuring subdomain routing, customizable UI services, multi-region deployment, and enterprise-grade infrastructure isolation.

## 🎯 Features

- **🏢 Multi-Tenant Architecture**: Support for unlimited tenants with subdomain and custom domain routing
- **🌍 Multi-Region Deployment**: Deploy tenants across regions, clusters, and pods with data-driven routing
- **🎨 Customizable UI Templates**: Multiple pre-built templates for auth, user management, and products
- **🔐 Tenant-Based Authentication**: Isolated authentication per tenant with secure token management
- **⚙️ Infrastructure Isolation**: From shared infrastructure to dedicated clusters (4 isolation levels)
- **⚡ Server-Side Rendering**: Built with Next.js App Router and Server Components
- **🎭 Template System**: Easy-to-customize UI templates (Modern, Classic, Minimal styles)
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🔒 Route Protection**: Middleware-based authentication and authorization
- **☁️ Kubernetes-Ready**: Namespace, pod, and cluster-level isolation support

## 🏗️ Infrastructure Isolation Levels

### Level 0: Shared (Default)
All tenants on same infrastructure - ideal for startups and freemium users.

### Level 1: Pod-Level
Tenants in separate pods within same cluster - good for growing businesses.

### Level 2: Cluster-Level
Dedicated cluster per tenant - perfect for enterprise customers.

### Level 3: Region-Level
Geographic isolation for compliance and data residency.

See [Multi-Region Architecture Guide](./MULTI_REGION_ARCHITECTURE.md) for details.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Main app authentication
│   ├── (tenant)/            # Tenant-specific pages
│   │   ├── auth/            # Tenant auth (login/register)
│   │   ├── users/           # User management
│   │   ├── products/        # Product management
│   │   └── settings/        # Tenant settings
│   └── dashboard/           # Admin dashboard
│       └── tenants/
│           └── [tenantId]/
│               └── deployment/  # Infrastructure config
├── components/
│   ├── auth/                # Main app auth components
│   ├── tenant/              # Tenant UI templates
│   └── admin/               # Admin components
│       └── TenantDeploymentConfig.tsx
├── lib/
│   ├── tenant.ts            # Tenant detection utilities
│   ├── tenantContext.ts     # Server-side context
│   └── routing.ts           # Multi-region routing
├── models/                  # Data models
├── api/                     # API clients
└── middleware.ts            # Routing & protection logic
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_MAIN_DOMAIN=localhost
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. Setup Local Subdomains (Development)

Add to `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 tenant1.localhost
127.0.0.1 tenant2.localhost
127.0.0.1 demo.localhost
```

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Access the Application

- **Main App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/dashboard
- **Tenant 1**: http://tenant1.localhost:3000
- **Tenant 2**: http://tenant2.localhost:3000

## 🌍 Multi-Region Infrastructure

### Data-Driven Routing
All routing decisions are based on database configuration, not hardcoded URLs. Move tenants between infrastructure levels without code changes:

```typescript
// Tenant deployment configuration example
{
  isolationLevel: 'cluster',           // shared | pod | cluster | region
  frontendBaseUrl: 'https://tenant1.yourapp.com',
  backendBaseUrl: 'https://api-tenant1.yourapp.com',
  frontendRegion: 'us-east-1',
  backendRegion: 'us-east-1',
  databaseRegion: 'us-east-1',
  namespace: 'tenant-tenant1'
}
```

### Infrastructure Management
- **Admin UI**: Configure tenant deployment at `/dashboard/tenants/[tenantId]/deployment`
- **Strategy Selector**: Choose placement (shared, balanced, dedicated, region-specific)
- **Migration Planner**: Shows complexity, downtime, and migration steps
- **Validation**: Real-time configuration validation

See [Multi-Region Architecture Guide](./MULTI_REGION_ARCHITECTURE.md) for complete setup.

## 📚 Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Step-by-step setup checklist
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature overview and quick start
- **[TENANT_ROUTING_GUIDE.md](./TENANT_ROUTING_GUIDE.md)** - Complete routing and architecture guide
- **[MULTI_REGION_ARCHITECTURE.md](./MULTI_REGION_ARCHITECTURE.md)** - Multi-region deployment guide
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual architecture diagrams
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Developer quick reference

## 🎨 UI Templates

### Authentication Templates
- **Modern**: Split-screen design with gradient branding
- **Classic**: Traditional centered form layout
- **Minimal**: Ultra-clean, borderless design

### User Management Templates
- **Table**: Sortable data table with advanced filtering
- **Grid**: Card-based layout (coming soon)
- **List**: Compact list view (coming soon)

### Product Templates
- **Grid**: Card grid with image previews
- **List**: Detailed list view (coming soon)
- **Cards**: Enhanced card design (coming soon)

## 🔧 Key Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Server Components** - Better performance and SEO
- **Middleware** - Request routing and protection

## 🏗️ Architecture

### Tenant Detection Flow
```
Request → Middleware → Extract Hostname → Detect Tenant → Route to Pages
```

### Routing Strategy
- **Main Domain** (`example.com`) → Main application
- **Subdomains** (`tenant1.example.com`) → Tenant portals
- **Custom Domains** → Tenant portals (configurable)

### Authentication
- Tenant-specific authentication
- JWT token-based
- Secure cookie management
- Middleware-protected routes

## 🔐 Security

- Row-level tenant isolation
- Server-side authentication checks
- Secure token storage
- CSRF protection
- Rate limiting ready

## 📦 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🌐 Production Deployment

### DNS Configuration
```
A    @           -> Your-Server-IP
A    *           -> Your-Server-IP (wildcard)
CNAME www        -> yourdomain.com
```

### Recommended Platforms
- **Vercel** (Recommended) - Automatic subdomain support
- **AWS** - With Application Load Balancer
- **Custom Server** - With nginx/Apache reverse proxy

See [TENANT_ROUTING_GUIDE.md](./TENANT_ROUTING_GUIDE.md) for detailed deployment instructions.

## 🛠️ Development

### Adding a New Tenant Route
```typescript
// Create page in app/(tenant)/
export default async function MyPage() {
  const tenant = await requireTenant()
  return <div>Hello {tenant.code}</div>
}
```

### Creating a Custom Template
```typescript
// Create component
export default function MyCustomTemplate({ tenantCode }) {
  // Your design
}

// Add to template enum
export enum UITemplate {
  MY_CUSTOM = 'my-custom'
}
```

## 🔍 Troubleshooting

### Subdomain not working?
- Check `/etc/hosts` entries
- Clear DNS cache: `sudo dscacheutil -flushcache`
- Restart browser

### Tenant context missing?
- Use `await requireTenant()` in Server Components
- Verify `NEXT_PUBLIC_MAIN_DOMAIN` is set correctly

See [TENANT_ROUTING_GUIDE.md](./TENANT_ROUTING_GUIDE.md) for more troubleshooting tips.

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the component patterns
4. Update documentation as needed

## 📄 License

[Your License]

## 🆘 Support

Need help? Check our documentation:
1. [Getting Started Guide](./GETTING_STARTED.md)
2. [Complete Documentation](./TENANT_ROUTING_GUIDE.md)
3. [Quick Reference](./QUICK_REFERENCE.md)

---

Built with ❤️ using Next.js and TypeScript
