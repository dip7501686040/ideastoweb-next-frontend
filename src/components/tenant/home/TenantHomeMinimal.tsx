import Link from "next/link"

interface TenantHomeMinimalProps {
  tenantCode: string
}

export default function TenantHomeMinimal({ tenantCode }: TenantHomeMinimalProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        {/* Tenant Badge */}
        <div className="inline-block">
          <span className="text-sm font-mono text-gray-400 uppercase tracking-wider">{tenantCode}</span>
        </div>

        {/* Hero Content */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 tracking-tight">
            Simple.
            <br />
            Powerful.
            <br />
            <span className="font-bold">Ready.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto font-light">Everything you need to build and scale your business, nothing you don't.</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/register" className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors">
            Get Started
          </Link>
          <Link href="/login" className="px-10 py-4 text-gray-900 hover:text-gray-600 font-medium transition-colors underline underline-offset-4">
            Sign In →
          </Link>
        </div>

        {/* Minimal Features */}
        <div className="grid grid-cols-3 gap-8 pt-16 border-t border-gray-100">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">99.9%</div>
            <div className="text-sm text-gray-500">Uptime</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">&lt;100ms</div>
            <div className="text-sm text-gray-500">Response Time</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-500">Support</div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Trusted by teams worldwide</p>
          <div className="flex justify-center gap-8 items-center opacity-40">
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
