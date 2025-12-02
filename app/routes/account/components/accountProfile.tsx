'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/componnets/ui/appIcon';
import { useAuthUser } from '@/hooks/useAuthUser';
import { auth } from '@/lib/firbase';
import { updateProfile } from 'firebase/auth';
import { updateUserInFirestore } from '@/app/routes/actions/updateUser';
import { useToast } from '@/componnets/ui/toastProvider';

const AccountProfile = () => {
  const { user, loading } = useAuthUser();
  const { showToast } = useToast(); 
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

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
          <h1 className="text-3xl font-bold text-text-primary">Sign in to view your account</h1>

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

  const displayName = user.displayName ?? "FashionHub Shopper";
  const firstLetter = displayName.charAt(0).toUpperCase();

  const handleSave = async () => {
    const userAuth = auth.currentUser;
    if (!userAuth) {
      showToast({ type: "error", message: "You are not logged in!" });
      return;
    }

    try {
      // 1️⃣ Update Firebase Auth
      await updateProfile(userAuth, { displayName: newName });

      // 2️⃣ Update Firestore
      const res = await updateUserInFirestore(userAuth.uid, newName);

      if (!res.success) {
        showToast({ type: "error", message: "Failed to update profile!" });
        return;
      }

      showToast({ type: "success", message: "Profile updated successfully!" });

      setEditing(false);      // ⬅️ CLOSE EDIT UI  
    } catch (error) {
      console.log(error);
      showToast({ type: "error", message: "Something went wrong!" });
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <div className="rounded-2xl border border-border bg-card shadow-elevation-md">

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center gap-6 border-b border-border px-6 py-10 text-center sm:flex-row sm:text-left">

          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center">
            <span className="text-5xl font-bold text-primary">{firstLetter}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-text-secondary">Welcome back</p>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-text-primary">{displayName}</h1>

              <button
                onClick={() => {
                  setNewName(displayName);
                  setEditing(true);
                }}
                className="text-sm underline text-primary hover:opacity-80 transition cursor-pointer text-green-600"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Icon name="EnvelopeIcon" size={18} variant="outline" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {editing && (
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">Edit Name</h2>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-card text-text-primary"
              placeholder="Enter your name"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* DETAILS GRID */}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <ProfileDetail label="Email" value={user.email ?? 'Not provided'} />
          <ProfileDetail label="User ID" value={user.uid} />
          <ProfileDetail label="Account created" value={formatDate(user.metadata.creationTime)} />
          <ProfileDetail label="Last sign-in" value={formatDate(user.metadata.lastSignInTime)} />
          <ProfileDetail
            label="Provider"
            value={user.providerData.map(p => p.providerId).join(', ') || 'Email/password'}
          />
          <ProfileDetail label="Email verified" value={user.emailVerified ? 'Yes' : 'No'} />
        </div>
      </div>
    </section>
  );
};

export default AccountProfile;

interface ProfileDetailProps {
  label: string;
  value: string;
}

const ProfileDetail = ({ label, value }: ProfileDetailProps) => (
  <div className="rounded-xl border border-border bg-muted/30 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
    <p className="mt-1 text-base font-medium text-text-primary">{value}</p>
  </div>
);

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Not available";
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
