export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">{children}</div>

        {/* Right side - Branding */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-600 p-12 items-center justify-center">
          <div className="max-w-md text-white space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Welcome to IdeasToWeb</h1>
              <p className="text-xl text-blue-100">Your platform for building amazing web applications</p>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-blue-100">Multi-tenant architecture out of the box</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-blue-100">Secure authentication with JWT tokens</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-blue-100">Beautiful, modern UI components</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-blue-100">Deploy and scale with confidence</p>
              </div>
            </div>

            <div className="pt-8 border-t border-blue-500">
              <p className="text-sm text-blue-200">"This platform helped us launch our SaaS product in record time. The authentication system works flawlessly!"</p>
              <p className="mt-2 text-sm font-medium">— Sarah Chen, Founder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
