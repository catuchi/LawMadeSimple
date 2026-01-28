import { AuthProvider } from '@/components/auth/auth-provider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
