// AuthProvider is already wrapped at the root level (src/app/layout.tsx)
// Middleware handles route protection (src/middleware.ts)
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
