
"use client";

import React, { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from '@/navigation';
import { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // You can replace this with a more sophisticated loading spinner
    return (
        <div className="container mx-auto py-10 w-full">
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-2 pt-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
