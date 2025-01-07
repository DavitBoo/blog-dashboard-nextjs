'use client';

import React from 'react';

type Comment = {
  id: number;
  content: string;
  email: string;
};

type CommentListProps = {
  comments: Comment[];
  onDelete: (id: number) => void;
};

const CommentList: React.FC<CommentListProps> = ({ comments, onDelete }) => {
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id} className="commentItem">
          <div>
            <p>{comment.content}</p>
            <small>{comment.email}</small>
          </div>
          <button className="deleteButton" onClick={() => onDelete(comment.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
