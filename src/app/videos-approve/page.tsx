'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const key = '1692781434397_Harkirat_10_years_embarrassment_youtube_video.mp4';

const VideosApprove = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [uploadStart, setUploadStart] = useState<boolean>(false);

  useEffect(() => {
    const authCode = searchParams.get('code');
    if (authCode?.length) {
      setUploadStart(true);
      fetch(`/api/approve?key=${key}&authCode=${authCode}`, {
        method: 'POST',
      });
    }
  }, []);

  const handleApprove = async () => {
    const res = await fetch(`/api/approve`);
    const { data } = await res.json();

    const authUrl = data?.authUrl || '';
    if (authUrl.length) {
      router.push(data?.authUrl);
    }
  };

  return (
    <div className="m-10">
      <h2>Approve Videos To Upload on YouTube</h2>
      <div className="mt-10">
        <button onClick={handleApprove}>Approve</button>
        {uploadStart ? (
          <div>
            <h2>
              Upload started on our server, you'll be notified once the process
              completes.
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VideosApprove;
