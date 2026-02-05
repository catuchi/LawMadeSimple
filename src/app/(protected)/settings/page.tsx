'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { UpdateEmailForm } from '@/components/auth/update-email-form';
import { UpdateNameForm } from '@/components/auth/update-name-form';
import { DeleteAccountForm } from '@/components/auth/delete-account-form';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { UsageStatus } from '@/components/subscription/usage-status';
import { UserAvatar, getUserDisplayData } from '@/components/auth/user-avatar';
import type { UserIdentity, Provider } from '@supabase/supabase-js';

// OAuth providers that can be linked
const OAUTH_PROVIDERS: Record<string, { name: string; icon: React.FC<{ className?: string }> }> = {
  google: { name: 'Google', icon: GoogleIcon },
  apple: { name: 'Apple', icon: AppleIcon },
  facebook: { name: 'Facebook', icon: FacebookIcon },
};

// All providers for display (including email)
const ALL_PROVIDERS: Record<string, { name: string; icon: React.FC<{ className?: string }> }> = {
  ...OAUTH_PROVIDERS,
  email: { name: 'Email & Password', icon: EmailIcon },
};

export default function SettingsPage() {
  const { user, isLoading, signOut } = useAuth();
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-foreground-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get connected identities
  const identities = user.identities || [];
  const connectedProviders = new Set(identities.map((i) => i.provider));

  // Get user display data (name, avatar)
  const userDisplayData = getUserDisplayData(user);

  // Available OAuth providers to link (not already connected)
  const availableProviders = Object.keys(OAUTH_PROVIDERS).filter((p) => !connectedProviders.has(p));

  // Handle linking a new provider
  const handleLinkProvider = async (provider: string) => {
    setError(null);
    setLinkingProvider(provider);

    try {
      const supabase = createClient();
      const { error: linkError } = await supabase.auth.linkIdentity({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
        },
      });

      if (linkError) {
        setError(linkError.message);
      }
    } catch {
      setError('Failed to link account. Please try again.');
    } finally {
      setLinkingProvider(null);
    }
  };

  // Handle unlinking a provider
  const handleUnlinkProvider = async (identity: UserIdentity) => {
    // Don't allow unlinking the last identity
    if (identities.length <= 1) {
      setError('You must have at least one sign-in method.');
      return;
    }

    // Don't allow unlinking email if it's the only way to sign in
    if (identity.provider === 'email' && identities.length === 1) {
      setError('You cannot remove your only sign-in method.');
      return;
    }

    setError(null);
    setUnlinkingId(identity.id);

    try {
      const supabase = createClient();
      const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);

      if (unlinkError) {
        setError(unlinkError.message);
      }
    } catch {
      setError('Failed to unlink account. Please try again.');
    } finally {
      setUnlinkingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-foreground mb-8 text-2xl font-bold">Account Settings</h1>

      {/* Profile */}
      <section className="mb-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Profile</h2>
        <div className="border-border rounded-lg border bg-white p-4">
          <div className="mb-6 flex items-center gap-4">
            <UserAvatar
              name={userDisplayData.name}
              email={userDisplayData.email}
              avatarUrl={userDisplayData.avatarUrl}
              size="lg"
            />
            <div>
              <p className="text-foreground font-medium">{userDisplayData.name || 'No name set'}</p>
              <p className="text-foreground-muted text-sm">{user.email}</p>
            </div>
          </div>
          <UpdateNameForm currentName={userDisplayData.name} />
        </div>
      </section>

      {/* Subscription & Usage */}
      <section className="mb-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Subscription & Usage</h2>
        <UsageStatus />
      </section>

      {/* Connected Accounts */}
      <section className="mb-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Connected Accounts</h2>
        <p className="text-foreground-muted mb-4 text-sm">
          Manage how you sign in to LawMadeSimple. You can connect multiple accounts for
          convenience.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="border-border divide-border divide-y rounded-lg border bg-white">
          {identities.map((identity) => {
            const providerInfo = ALL_PROVIDERS[identity.provider] || {
              name: identity.provider,
              icon: EmailIcon,
            };
            const Icon = providerInfo.icon;
            const isUnlinking = unlinkingId === identity.id;

            return (
              <div key={identity.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="text-foreground-muted h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">{providerInfo.name}</p>
                    <p className="text-foreground-muted text-sm">
                      {identity.identity_data?.email || user.email}
                    </p>
                  </div>
                </div>
                {identities.length > 1 && identity.provider !== 'email' && (
                  <button
                    onClick={() => handleUnlinkProvider(identity)}
                    disabled={isUnlinking}
                    className="text-error hover:text-error-dark text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isUnlinking ? 'Removing...' : 'Remove'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Link New Account */}
      {availableProviders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Link Another Account</h2>
          <p className="text-foreground-muted mb-4 text-sm">
            Connect additional accounts to sign in with Google or Apple.
          </p>

          <div className="flex flex-wrap gap-3">
            {availableProviders.map((provider) => {
              const providerInfo = OAUTH_PROVIDERS[provider];
              const Icon = providerInfo.icon;
              const isLinking = linkingProvider === provider;

              return (
                <button
                  key={provider}
                  onClick={() => handleLinkProvider(provider)}
                  disabled={!!linkingProvider}
                  className="border-border hover:bg-background-secondary flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Icon className="h-4 w-4" />
                  {isLinking ? 'Connecting...' : `Connect ${providerInfo.name}`}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Update Email */}
      <section className="mb-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Change Email</h2>
        <div className="border-border rounded-lg border bg-white p-4">
          <UpdateEmailForm currentEmail={user.email} />
        </div>
      </section>

      {/* Change Password - only show for email/password users */}
      {connectedProviders.has('email') && (
        <section className="mb-8">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Change Password</h2>
          <div className="border-border rounded-lg border bg-white p-4">
            <ChangePasswordForm />
          </div>
        </section>
      )}

      {/* Sign Out */}
      <section className="border-border mb-8 border-t pt-8">
        <h2 className="text-foreground mb-4 text-lg font-semibold">Session</h2>
        <button
          onClick={signOut}
          className="border-border hover:bg-background-secondary rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </section>

      {/* Delete Account */}
      <section className="border-error/20 border-t pt-8">
        <h2 className="text-error mb-4 text-lg font-semibold">Danger Zone</h2>
        <div className="border-border rounded-lg border bg-white p-4">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}

// Icon components
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
