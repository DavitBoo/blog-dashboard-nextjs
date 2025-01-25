// ! aquí - check a ver si funciona con la API
// ! ######### queda conectar las modificaciones de los posts, algo pasa con la ruta de el boton de publicar.
/* 
  Aunque queda:
  Login: Obtain a JWT token upon successful login and store it (e.g., in localStorage).
  Attach Token: Include the token in Authorization headers for protected requests.
  Error Handling: Handle 401 Unauthorized errors by redirecting users to the login page.

  If API does not work after it ensure the backend middleware is properly configured at in API project passport.js
*/

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

export const createPost = async (formData: FormData) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  // ! error 404 al intentar acceder a POST /api/posts
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return await response.json();
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
