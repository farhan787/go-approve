'use client';

import { createRef, useEffect, useState } from 'react';

const editorsList = [
  {
    email: 'farhan@gmail.com',
  },
  {
    email: 'zk@gmail.com',
  },
];

const EditorsList = () => {
  const [editors, setEditors] = useState<any[]>([]);
  const [passwordSetUrl, setPasswordSetUrl] = useState<string>('');

  const newEditorEmail = createRef();

  useEffect(() => {
    setEditors(editorsList);
  }, []);

  async function handleAddEditor(e) {
    const email = newEditorEmail?.current?.value;
    if (!email || !email.includes('@')) {
      alert('Invalid email');
      return;
    }

    const res = await fetch('/api/editors', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    });

    if (res.status === 201) {
      newEditorEmail.current.value = '';
      alert(email);
      setEditors((prev) => [...prev, { email }]);

      const resData = await res.json();
      const { passwordSetUrl } = resData?.data;
      setPasswordSetUrl(passwordSetUrl);
    }
  }

  function handleRemoveEditor(idx) {
    const editorToRemove = editors.filter((editor, pos) => pos === idx);
    alert('Removing ' + editorToRemove[0].email);

    const filteredEditors = editors.filter((editor, pos) => pos !== idx);
    setEditors(filteredEditors);
  }

  return (
    <div className="bg-gray-800 w-4/12 my-28 mx-auto p-4 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <ul className="w-full">
          {editors && editors.length ? (
            editors.map((editor, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-white">{editor.email}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  onClick={() => handleRemoveEditor(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))
          ) : (
            <div>No Editor Added Yet</div>
          )}
        </ul>
        <div className="mt-12 flex items-center">
          <input
            type="email"
            ref={newEditorEmail}
            placeholder="Enter editor's email"
            className="p-2 rounded-l-md text-black flex-grow border-gray-300 focus:ring focus:ring-orange-200 focus:outline-none"
            required
          />
          <button
            className="bg-orange-400 ml-2 text-white p-2 rounded-r-md hover:bg-orange-700 focus:outline-none"
            onClick={handleAddEditor}
          >
            Add Editor
          </button>
        </div>
        {passwordSetUrl && passwordSetUrl.length ? (
          <div>
            <p className="mt-12">
              Share it with editor to signup on this workspace{' '}
              <i>{passwordSetUrl}</i>
            </p>
            <br />
            <p>Soon we will send notification to editors for this.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EditorsList;
