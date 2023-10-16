'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const workspace = formData.get('workspace') ?? '';
    const email = formData.get('email') ?? '';
    const password = formData.get('password') ?? '';

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workspace,
        email,
        password,
      }),
    });

    if (res.status === 201) {
      alert('Signup complete');
      return router.push('/login?success=Account has been created');
    }

    if (res.status === 400) {
      const { message: errMessage } = await res.json();
      alert(errMessage);
    }

    if (res.status === 500) {
      alert('Something went wrong, please try again after sometime');
      return;
    }
  };

  return (
    <div className="mt-32">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg w-3/12 mx-auto text-black"
      >
        <div className="mb-4">
          <label htmlFor="workspace" className="block text-white mb-1">
            Workspace
          </label>
          <input
            type="text"
            name="workspace"
            placeholder="Enter your unique workspace name"
            className="w-full px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Your good email"
            className="w-full px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Don't worry it's encrypted"
            className="w-full px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Create Workspace
        </button>
      </form>
    </div>
  );
};

export default Signup;
