'use client';

import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { createPost } from '../../../../utils/api';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost({ title, content });
    alert('Post created!');
  };

  return (
    <div>
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Editor
          apiKey="TINYMCE_API_KEY"
          value={content}
          onEditorChange={(newValue) => setContent(newValue)}
          init={{
            height: 400,
            menubar: false,
            plugins: ['link', 'table', 'lists'],
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent',
          }}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default NewPost;
