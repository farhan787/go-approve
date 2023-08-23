'use client';

import React, { useState } from 'react';

const CHUNK_SIZE_IN_MB = 5 * 1024 * 1024;

export default function RequestApproval() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadProgressPercentage, setUploadProgressPercentage] =
    useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    setUploadProgressPercentage(0);
    setIsUploading(true);

    const fileName = Date.now().toString() + '_' + file.name;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE_IN_MB);

    const res = await fetch(`/api/initiateUpload`, {
      method: 'POST',
      body: JSON.stringify({ fileName }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { uploadId } = await res.json();

    const uploadPromises = [];
    let uploadedChunks = 0;
    let start = 0,
      end;

    for (let i = 0; i < totalChunks; i++) {
      end = start + CHUNK_SIZE_IN_MB;
      const chunk = file.slice(start, end);
      const formDataBody = new FormData();

      formDataBody.append('index', i);
      formDataBody.append('totalChunks', totalChunks);
      formDataBody.append('fileName', fileName);
      formDataBody.append('fileChunk', chunk);

      const uploadPromise = fetch(`/api/upload?uploadId=${uploadId}`, {
        method: 'POST',
        body: formDataBody,
      }).then(() => {
        uploadedChunks++;
        const progress = Math.floor((uploadedChunks / totalChunks) * 100);
        setUploadProgressPercentage(progress);
      });
      uploadPromises.push(uploadPromise);
      start = end;
    }

    await Promise.all(uploadPromises);

    const completeRes = await fetch(
      `/api/completeUpload?fileName=${fileName}&uploadId=${uploadId}`
    );
    const { success, data } = await completeRes.json();
    if (!success) {
      throw new Error('Error completing upload');
    }
  };

  return (
    <div className="max-w-md mx-auto ">
      <h1 className="text-4xl font-semibold mb-4 mt-10">Upload Video</h1>
      <form onSubmit={handleSubmit} className="mt-48">
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border rounded text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="file" className="block font-medium">
            Select Video File
          </label>
          <input
            type="file"
            id="file"
            className="w-full"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload
        </button>

        {isUploading ? (
          <div className="mx-auto my-10 h-6 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-6 animate-pulse rounded-full bg-green-500"
              style={{ width: `${uploadProgressPercentage}%` }}
            >
              <p className="pl-2 text-black">
                {uploadProgressPercentage}% Uploaded
              </p>
              <div className="h-full w-full translate-x-full transform bg-white"></div>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
