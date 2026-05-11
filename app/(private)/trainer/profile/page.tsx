"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import ProfileUpdate from "@/components/profile/ProfileUpdate";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrainerProfilePage() {
  const { data: user, isLoading, refetch } = useFetchAccount();

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded" />
          </div>
          <div>
            <Skeleton className="h-64 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-8">
      <ProfileUpdate user={user} onUpdate={refetch} />
    </div>
  );
}
