import RequestApproval from '../upload-for-approval/page';

export default function EditorDashboard() {
  const currentUser = 'editor';
  return (
    <div className="mt-5">
      <h1 className="text-center text-7xl">Editor Dashboard</h1>
      {/* <Link href="/request-approval">Upload video</Link> */}
      <RequestApproval />
    </div>
  );
}
