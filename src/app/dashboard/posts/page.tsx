'use client';

import { useState, useEffect } from 'react';
import { fetchPosts, togglePublishPost } from '../../../utils/api';
import { exportAllPostsAsZip } from '../../../utils/postToMarkdown';
import PostList, { type Post } from '../../components/PostList';
import Link from 'next/link';
import { FaFileArchive } from 'react-icons/fa';

const PostManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  const handleTogglePublish = async (id: number, isPublished: boolean) => {
    await togglePublishPost(id, !isPublished);
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, published: !isPublished } : post)),
    );
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    setExportError('');
    try {
      await exportAllPostsAsZip();
    } catch (error) {
      console.error('Error exporting posts: ', error);
      setExportError('No se pudieron exportar los artículos. Inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Manage Posts</h1>
            <p className="page-subtitle">Create, edit, and manage your blog posts</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={handleExportAll}
              disabled={isExporting || posts.length === 0}
            >
              <FaFileArchive /> Export all (.zip)
            </button>
            <Link href="/dashboard/posts/new" className="btn btn-primary">
              ➕ Create New Post
            </Link>
          </div>
        </div>
      </div>

      {exportError && <p className="error">{exportError}</p>}

      <div className="dashboard-card">
        <PostList posts={posts} onTogglePublish={handleTogglePublish} />
      </div>
    </>
  );
};

export default PostManagement;
