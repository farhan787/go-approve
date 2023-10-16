'use client';

import React, { useState } from 'react';

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get('password') ?? '';
    const confirmPassword = formData.get('confirmPassword') ?? '';

    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 mt-28 mx-auto w-6/12 p-4 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="password" className="block text-white mb-1">
          Create your Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          className="w-full px-3 py-2 rounded border text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-white mb-1">
          Confirm Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          className="w-full px-3 py-2 rounded border text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-1">Show Password</label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="mr-2"
        />
      </div>
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

export default UpdatePassword;
