'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

const LogIn = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session.status === 'authenticated') {
    const { role } = session.data?.user;

    if (role === 'admin') {
      return router?.push('/admin-dashboard');
    }
    router?.push('/editor-dashboard');
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const workspace = formData.get('workspace') ?? '';
    const email = formData.get('email') ?? '';
    const password = formData.get('password') ?? '';
    const role = formData.get('role') ?? '';

    signIn('credentials', { workspace, email, password, role });
  };

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
  ];

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
        <div className="mb-4">
          <label htmlFor="role" className="block text-white mb-1">
            Role
          </label>
          <select name="role" className="w-full px-3 py-2 rounded">
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LogIn;
