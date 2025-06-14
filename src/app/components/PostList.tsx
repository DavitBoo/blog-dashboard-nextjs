"use client";

import React, { useState } from "react";

import ConfirmArticleDelete from "./ConfirmArticleDelete";
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';
import Link from "next/link";



type Post = {
  id: number;
  title: string;
  published: boolean;
};

type PostListProps = {
  posts: Post[];
  onTogglePublish: (id: number, isPublished: boolean) => void;
};

const PostList: React.FC<PostListProps> = ({ posts, onTogglePublish }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleDelete = (postId: number) => {
    setSelectedPostId(postId);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedPostId(null);
  };

  return (
    <>
      {showDeleteModal && selectedPostId && (
        <ConfirmArticleDelete isOpen={showDeleteModal} onClose={handleCloseModal} postId={selectedPostId} />
      )}
      
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-card-header">
              <h3 className="post-title">{post.title}</h3>
              <span className={`post-status ${post.published ? 'published' : 'draft'}`}>
                {post.published ? "Published" : "Draft"}
              </span>
            </div>
            
            <div className="post-card-meta">
              {/* <span className="post-date">Created: {new Date(post.createdAt).toLocaleDateString()}</span>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>} */}
            </div>
            
            <div className="post-card-actions">
              <button 
                className={`btn btn-sm ${post.published ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => onTogglePublish(post.id, post.published)}
              >
                {post.published ? <FaEye /> : <FaEye />}
                {post.published ? "Unpublish" : "Publish"}
              </button>
              
              <Link href={`./posts/edit/${post.id}`} className="btn btn-sm btn-secondary">
                <FaEdit /> Edit
              </Link>
              
              <button 
                className="btn btn-sm btn-danger" 
                onClick={() => handleDelete(post.id)}
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No posts yet</h3>
          <p>Create your first blog post to get started</p>
          <Link href="/dashboard/posts/new" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      )}
    </>
  );
};

export default PostList;
