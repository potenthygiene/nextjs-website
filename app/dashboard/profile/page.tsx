// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AccountInfo } from "@/app/components/common/dashboard-profile/AccountInfo";
import { EditAddressForm } from "@/app/components/common/dashboard-profile/EditAddress";
import { ProfileHeader } from "@/app/components/common/dashboard-profile/ProfileHeader";
import { getProfile, updateProfile } from "@/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";

interface User {
  fullName: string;
  phone: string;
  email: string;
  birthday?: string;
  anniversary?: string;
  emailVerified?: boolean | null;
  createdAt?: Date | string | null;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [birthdayLocked, setBirthdayLocked] = useState(false);
  const [anniversaryLocked, setAnniversaryLocked] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          birthday: data.birthday || "",
          anniversary: data.anniversary || "",
          emailVerified: data.emailVerified,
          createdAt: data.createdAt,
        });
        setBirthdayLocked(Boolean(data.birthday));
        setAnniversaryLocked(Boolean(data.anniversary));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    // New Google sign-ups arrive with ?welcome=1: open the form ready to fill in.
    if (new URLSearchParams(window.location.search).get("welcome")) setIsEditing(true);
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    if (field === "birthday" && birthdayLocked) return;
    if (field === "anniversary" && anniversaryLocked) return;
    setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const updated = await updateProfile({
        fullName: user.fullName,
        phone: user.phone,
        birthday: user.birthday || "",
        anniversary: user.anniversary || "",
      });

      if (updated?.birthday) {
        setBirthdayLocked(true);
        setUser((prev) =>
          prev ? { ...prev, birthday: updated.birthday } : prev,
        );
      }
      if (updated?.anniversary) {
        setAnniversaryLocked(true);
        setUser((prev) => (prev ? { ...prev, anniversary: updated.anniversary } : prev));
      }

      if (updated?.bonusAdded) {
        toast.success(
          "Profile updated! ₹50 birthday credit added to your Rewards, and BIRTHDAY15 is yours in your birthday month.",
        );
      } else {
        toast.success("Profile updated successfully");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-none shadow-sm bg-white rounded-[15px] flex flex-row justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-56 bg-gray-200" />
            <Skeleton className="h-4 w-40 bg-gray-200" />
          </div>

          <Skeleton className="h-10 w-32 rounded-lg bg-gray-300" />
        </Card>

        <Card className="p-8 border-none shadow-sm bg-white rounded-[20px] space-y-6">
          <Skeleton className="h-4 w-40 bg-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Skeleton className="h-3 w-32 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-14 w-full rounded-xl bg-gray-300" />
            <Skeleton className="h-14 w-full rounded-xl bg-gray-200" />
          </div>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white rounded-[15px] space-y-3">
          <Skeleton className="h-4 w-40 bg-gray-300" />
          <Skeleton className="h-4 w-64 bg-gray-200" />
          <Skeleton className="h-4 w-52 bg-gray-200" />
        </Card>
      </div>
    );
  }

  const missing = [
    !user.phone && "phone number (for delivery updates)",
    !user.birthday && "birthday (₹50 credit + BIRTHDAY15 in your birthday month)",
    !user.anniversary && "anniversary, if you'd like (ANNIVERSARY15 in that month)",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      {missing.length > 0 && (
        <div className="rounded-2xl border border-[#1B8392]/25 bg-[#E9F7F9] p-4 sm:p-5">
          <p className="text-[15px] font-bold text-[#016271]">Complete your profile</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13.5px] text-[#0b4c55]">
            {missing.map((m) => (
              <li key={m}>Add your {m}</li>
            ))}
          </ul>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="mt-3 rounded-full bg-[#016271] px-4 py-2 text-[13px] font-bold text-white">
              Add details
            </button>
          )}
          <p className="mt-2 text-[12px] text-[#3c6f76]">Birthday and anniversary can be set once. Birthday and anniversary coupons can&apos;t be combined with other coupons.</p>
        </div>
      )}

      <ProfileHeader isEditing={isEditing} onEdit={() => setIsEditing(true)} />

      <EditAddressForm
        isEditing={isEditing}
        isSaving={isSaving}
        user={user}
        birthdayLocked={birthdayLocked}
        anniversaryLocked={anniversaryLocked}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => setIsEditing(false)}
      />

      <AccountInfo user={user} />
    </div>
  );
}
