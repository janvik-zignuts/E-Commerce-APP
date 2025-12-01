'use client';

import Link from 'next/link';
import Icon from '@/componnets/ui/appIcon';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function AccountProfile() {
  const { user, loading } = useAuthUser();

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-6 py-4 text-text-secondary">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
          Loading your profile...
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24">
        <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-5">
          <Icon name="LockClosedIcon" size={40} variant="outline" className="mx-auto text-primary" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary">Sign in to view your account</h1>
            <p className="text-text-secondary">
              Access profile information, saved carts, and order history once you sign in.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium transition-smooth hover:opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  const displayName = user.displayName ?? 'FashionHub shopper';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <div className="rounded-2xl border border-border bg-card shadow-elevation-md">
        <div className="flex flex-col items-center gap-6 border-b border-border px-6 py-10 text-center sm:flex-row sm:text-left">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center">
    <span className="text-5xl font-bold text-primary">
      {firstLetter}
    </span>
  </div>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-text-secondary">Welcome back</p>
            <h1 className="text-3xl font-bold text-text-primary">{displayName}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary sm:justify-start">
              <Icon name="EnvelopeIcon" size={18} variant="outline" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <ProfileDetail label="Email" value={user.email ?? 'Not provided'} />
          <ProfileDetail label="User ID" value={user.uid} />
          <ProfileDetail label="Account created" value={formatDate(user.metadata.creationTime)} />
          <ProfileDetail label="Last sign-in" value={formatDate(user.metadata.lastSignInTime)} />
          <ProfileDetail
            label="Provider"
            value={user.providerData.map(provider => provider.providerId).join(', ') || 'Email/password'}
          />
          <ProfileDetail label="Email verified" value={user.emailVerified ? 'Yes' : 'No'} />
        </div>
      </div>
    </section>
  );
}

interface ProfileDetailProps {
  label: string;
  value: string;
}

function ProfileDetail({ label, value }: ProfileDetailProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-base font-medium text-text-primary">{value}</p>
    </div>
  );
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) {
    return 'Not available';
  }
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

