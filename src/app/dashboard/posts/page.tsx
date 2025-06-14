"use client";

import { useState, useEffect } from "react";
import { fetchPosts, togglePublishPost } from "../../../utils/api";
import PostList from "../../components/PostList";
import Link from "next/link";


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
    setPosts((prev: any) => prev.map((post: any) => (post.id === id ? { ...post, published: !isPublished } : post)));
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Manage Posts</h1>
            <p className="page-subtitle">Create, edit, and manage your blog posts</p>
          </div>
          <Link href="/dashboard/posts/new" className="btn btn-primary">
            ➕ Create New Post
          </Link>
        </div>
      </div>
      
      <div className="dashboard-card">
        <PostList posts={posts} onTogglePublish={handleTogglePublish} />
      </div>
    </>
  );
};

export default PostManagement;
