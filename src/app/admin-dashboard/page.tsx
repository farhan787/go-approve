'use client';

import EditorsList from '@/components/EditorsList';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callback=/admin-dashboard');
    },
  });

  return (
    <div className="mt-5">
      <h1 className="text-center text-7xl">Admin Dashboard</h1>
      <EditorsList />
    </div>
  );
}
