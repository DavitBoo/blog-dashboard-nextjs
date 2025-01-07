'use client';

import { useState, useEffect } from 'react';
import { fetchCommentsByPostId, deleteComment } from '../../../../utils/api';
import CommentList from '../../../components/CommentList';


const CommentManagement = ({ params }: { params: { postId: string } }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchCommentsByPostId(params.postId);
      setComments(data);
    };
    loadComments();
  }, [params.postId]);

  const handleDelete = async (id: number) => {
    await deleteComment(id);
    setComments((prev) => prev.filter((comment: any) => comment.id !== id));
  };

  return (
    <div className="container">
      <h1>Manage Comments</h1>
      <CommentList comments={comments} onDelete={handleDelete} />
    </div>
  );
};

export default CommentManagement;