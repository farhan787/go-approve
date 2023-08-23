'use client';
import { useEffect, useState } from 'react';

const key1 = `1692775770680_Ghazal Cannaugh Place.mp4`;

const key = '1692781434397_Harkirat_10_years_embarrassment_youtube_video.mp4';

const VideoRenderer = () => {
  // const [videoData, setVideoData] = useState<object>({});
  // const videoBlob = new Blob([videoData], { type: 'video/mp4' });
  // const videoUrl = URL.createObjectURL(videoBlob);

  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    async function fetchVideo() {
      const resp = await fetch(`/api/videos?key=${key}`);

      const respData = await resp.json();
      setVideoUrl(respData?.data?.videoUrl ?? '');
    }
    fetchVideo();
  }, []);

  return (
    <div>
      <h2>Video</h2>
      {videoUrl.length ? (
        <video controls={true} width="640" height="360">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : null}
    </div>
  );
};

export default VideoRenderer;
