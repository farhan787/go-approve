import Link from 'next/link';

export default function Home() {
  const currentUser = 'editor';
  return (
    <div className="mt-5">
      <h1 className="text-center text-7xl">
        {currentUser === 'editor' ? 'Editor Dashboard' : 'Admin Dashboard'}
      </h1>
      <Link href="/request-approval">Upload video</Link>
    </div>
  );
}
