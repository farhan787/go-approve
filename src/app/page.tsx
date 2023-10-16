'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="m-10">
      <div className="flex  gap-10">
        <button onClick={() => router.push('/editor-dashboard')}>
          Editor Dashboard
        </button>
        <button onClick={() => router.push('/admin-dashboard')}>
          Admin Dashboard
        </button>
      </div>

      <div className="mt-32 flex gap-10">
        <button onClick={() => router.push('/login')}>
          Login Into Existing Workspace
        </button>
        <button onClick={() => router.push('/signup')}>
          Create New Workspace
        </button>
      </div>
    </div>
  );
}
