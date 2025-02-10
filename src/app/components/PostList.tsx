"use client";

import React, { useState } from "react";

import ConfirmArticleDelete from "./ConfirmArticleDelete";
import { FaTrashAlt } from "react-icons/fa";
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
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="postItem">
            <div>
              <h3>{post.title}</h3>
              <p>Status: {post.published ? "Published" : "Unpublished"}</p>
            </div>
            <button className="toggleButton" onClick={() => onTogglePublish(post.id, post.published)}>
              {post.published ? "Unpublish" : "Publish"}
            </button>

            <Link href={`./posts/edit/${post.id}`} className="toggleButton">
              Editar
            </Link>
            <button className="toggleButton" onClick={() => handleDelete(post.id)}>
              Borrar artículo <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostList;
