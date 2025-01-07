    'use client';

import { useState, useEffect } from 'react';
import { fetchPosts, togglePublishPost } from '../../../utils/api';
import PostList from '../../components/PostList';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  const handleTogglePublish = async (id: number, isPublished: boolean) => {
    await togglePublishPost(id, !isPublished);
    setPosts((prev: any) =>
      prev.map((post: any) =>
        post.id === id ? { ...post, published: !isPublished } : post
      )
    );
  };

  return (
    <div className="container">
      <h1>Manage Posts</h1>
      <PostList posts={posts} onTogglePublish={handleTogglePublish} />
    </div>
  );
};

export default PostManagement;