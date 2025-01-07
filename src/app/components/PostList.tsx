'use client';

import React from 'react';

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
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id} className="postItem">
          <div>
            <h3>{post.title}</h3>
            <p>Status: {post.published ? 'Published' : 'Unpublished'}</p>
          </div>
          <button
            className="toggleButton"
            onClick={() => onTogglePublish(post.id, post.published)}
          >
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
