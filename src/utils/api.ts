// ! aquí - check a ver si funciona con la API
/* 
  Aunque queda:
  Login: Obtain a JWT token upon successful login and store it (e.g., in localStorage).
  Attach Token: Include the token in Authorization headers for protected requests.
  Error Handling: Handle 401 Unauthorized errors by redirecting users to the login page.

  If API does not work after it ensure the backend middleware is properly configured at in API project passport.js
*/
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get the JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Adjust based on how you store tokens
  if (!token) {
    throw new Error("User is not authenticated");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchPosts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  return response.json();
};

// Toggle post publish status (protected)
export const togglePublishPost = async (id: number, publish: boolean) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ published: publish }),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }
};

export const createPost = async (post: { title: string; content: string; published: boolean }) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(post),
  });

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
