import { getAuthHeaders } from "./authHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts/backend/`, {
    method: "GET",
    headers: getAuthHeaders("application/json"),
  });
  console.log(response);
  return response.json();
};

export const fetchPostById = async (id: number) => {
  console.log(id);
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
};

// Toggle post publish status (protected)
export const togglePublishPost = async (id: number, publish: boolean) => {
  console.log(getAuthHeaders());
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders("application/json"),
    body: JSON.stringify({ published: publish }),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }
};

export const createPost = async (postData: {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  labels: string[];
  isPublished: boolean;
  cover?: File | null;
}) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("content", postData.content);
  formData.append("metaTitle", postData.metaTitle);
  formData.append("metaDescription", postData.metaDescription);
  formData.append("labels", JSON.stringify(postData.labels));
  formData.append("isPublished", JSON.stringify(postData.isPublished));
  if (postData.cover) {
    formData.append("cover", postData.cover);
  }

  // Debug: muestra lo que se está enviando
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  // hasta aquí formData correcto

  const response = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(), // NO incluir 'Content-Type' aquí (el navegador lo establecerá automáticamente)
    },
    body: formData,
  });

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

export const editPost = async (postData: {}, id: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders("application/json"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }
};

export const fetchCommentsByPostId = async (postId: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`);
  return response.json();
};

export const deleteComment = async (id: number) => {
  const response = await fetch(`${API_URL}/comments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders("application/json"),
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
};

export const createLabel = async (label: { name: string }) => {
  try {
    const response = await fetch(`${API_URL}/labels/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders("application/json"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(label),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    const data = await response.json();
    console.log("Response body:", data);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${data.message || "Failed to create label"}`);
    }

    return data;
  } catch (error) {
    console.error("createLabel error:", error);
    throw error;
  }
};

export const fetchLabels = async () => {
  const response = await fetch(`${API_URL}/labels/`, {
    method: "GET",
    headers: getAuthHeaders("application/json"),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch labels");
  }

  return response.json();
};

export const deleteLabel = async (id: string) => {
  const response = await fetch(`${API_URL}/labels/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders("application/json"),
  });

  if (!response.ok) {
    throw new Error("Failed to delete label");
  }

  return response;
};

export const updateLabel = async (id: string, label: { name: string }) => {
  const response = await fetch(`${API_URL}/labels/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(label),
  });

  if (!response.ok) {
    throw new Error("Failed to update label");
  }

  return response.json(); // Add this to get the updated label data
};
