"use client";

import React, { useState } from "react";
import { createPost } from "../../../../utils/api";
import RichTextEditor from "../../../components/RichTextEditor";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {
      const formData = new FormData();
      console.log(formData);
      formData.append("title", title);
      formData.append("content", content);
      if (cover) {
        formData.append("cover", cover);
      }

      await createPost(formData); 
      setTitle("");
      setContent("");
      setCover(null); 
      setError("");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCover(e.target.files[0]);
    }
  };

  return (
    <div className="creator-container">
      <h2>Create a blog post</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Post created successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </div>
        <div className="form-field">
          <label htmlFor="cover">Cover image</label>
          <input required type="file" name="cover" id="cover" onChange={handleCoverChange} />
        </div>
        <div className="form-field">
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
