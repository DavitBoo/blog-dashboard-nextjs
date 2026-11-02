'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchCommentsByPostId, deleteComment } from '../../../../utils/api';
import CommentList, { type Comment } from '../../../components/CommentList';

const CommentManagement = () => {
  const { postId } = useParams() as { postId: string };
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchCommentsByPostId(postId);
      setComments(data);
    };
    loadComments();
  }, [postId]);

  const handleDelete = async (id: number) => {
    await deleteComment(id);
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  return (
    <div className="container">
      <h1>Manage Comments</h1>
      <CommentList comments={comments} onDelete={handleDelete} />
    </div>
  );
};

export default CommentManagement;
