
// ! ######### queda conectar las modificaciones de los posts, algo pasa con la ruta de el boton de publicar.


import { getAuthHeaders } from "./authHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPosts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/backend/`, {
      method: "GET",
      headers: getAuthHeaders(),
});
  return response.json();
};

// Toggle post publish status (protected)
export const togglePublishPost = async (id: number, publish: boolean) => {
  console.log(getAuthHeaders());
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ published: publish }),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }
};

export const createPost = async (postData: {
  title: string;
  content: string;
  labels: string[];
  isPublished: boolean;
}) => {
  console.log(postData.labels);
  const response = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData),
  });


  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return await response.json();
};


export const deletePost = async (id: number) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
};

export const fetchCommentsByPostId = async (postId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`);
  return response.json();
};

export const deleteComment = async (id: number) => {
  const response = await fetch(`${API_URL}/comments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
};


export const fetchLabels = async () => {
  const response = await fetch(`${API_URL}/labels/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch labels');
  }
  
  return response.json();
};