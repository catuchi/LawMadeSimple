'use client';

import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to LawMadeSimple</h1>
        <p className="mt-2 text-gray-600">Signed in as {user?.email || 'Unknown'}</p>
      </div>

      <button
        onClick={signOut}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Sign Out
      </button>

      <p className="mt-8 text-sm text-gray-500">Dashboard coming soon...</p>
    </div>
  );
}
