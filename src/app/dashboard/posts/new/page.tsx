'use client';

import React, { useState } from 'react';
import { createPost } from '../../../../utils/api';
import RichTextEditor from '../../../components/RichTextEditor';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      await createPost({ title, content, published: false });
      setTitle('');
      setContent('');
      setError('');
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Create New Post</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Post created successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <button type="submit" className="button">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
