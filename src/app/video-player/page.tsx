'use client';
import { useEffect, useState } from 'react';

const VideoRenderer = () => {
  const [videoByteArray, setVideoByteArray] = useState<number[]>([]);

  useEffect(() => {
    async function fetchVideo() {
      const resp = await fetch('/api/upload');

      const respData = await resp.json();
      console.log('resp data:', respData);
      setVideoByteArray(respData?.data || []);
    }
    fetchVideo();
  }, []);

  const videoBlob = new Blob([videoByteArray], { type: 'video/mp4' });
  console.log('videoBlob:', videoBlob);
  const videoUrl = URL.createObjectURL(videoBlob);
  console.log('video url:', videoUrl);
  //   const videoUrl = '';

  return (
    <div>
      <h2>Video</h2>
      <video controls width="640" height="360">
        <source src={videoUrl} type="video/mp4" />
        {/* <source src={'/api/'} type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoRenderer;
