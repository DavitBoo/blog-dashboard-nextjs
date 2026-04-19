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

/* ---- media manager ---- */
export const listImages = async () => {
  try {
    const response = await fetch(`${API_URL}/media/`, {
      method: "GET",
      headers: getAuthHeaders("application/json"),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.status}`);
    }

    const data = await response.json();
    console.log("Images fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/media/upload/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(), // NO incluir 'Content-Type' aquí (el navegador lo establecerá automáticamente)
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error uploading image");
  }

  return res.json();
};

export const deleteImage = async (fileName: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/media/${fileName}`, {
      method: "DELETE",
      headers: getAuthHeaders("application/json"),
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error deleting image:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      throw new Error(errorData.error || `Failed to delete image: ${response.status}`);
    }

    console.log('✅ Image deleted successfully:', fileName);
    
  } catch (error) {
    console.error('💥 Delete image failed:', error);
    throw error;
  }
};

export const deleteMultipleImages = async (fileNames: string[]): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/media/batch/delete`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders("application/json"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileNames }),
    });

    console.log("Batch delete response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error deleting multiple images:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      throw new Error(errorData.error || `Failed to delete images: ${response.status}`);
    }

    console.log('✅ Images deleted successfully:', fileNames);
    
  } catch (error) {
    console.error('💥 Batch delete failed:', error);
    throw error;
  }
};

/* ---- Project Categories ---- */
export const createProjectCategory = async (category: { name: string }) => {
  try {
    const response = await fetch(`${API_URL}/project-categories/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders("application/json"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to create category");
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectCategories = async () => {
  const response = await fetch(`${API_URL}/project-categories/`, {
    method: "GET",
    headers: getAuthHeaders("application/json"),
  });
  if (!response.ok) throw new Error("Failed to fetch project categories");
  return response.json();
};

export const updateProjectCategory = async (id: string, category: { name: string }) => {
  const response = await fetch(`${API_URL}/project-categories/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
};

export const deleteProjectCategory = async (id: string) => {
  const response = await fetch(`${API_URL}/project-categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders("application/json"),
  });
  if (!response.ok) throw new Error("Failed to delete category");
  return response;
};

/* ---- Projects ---- */
export const fetchProjects = async () => {
  const response = await fetch(`${API_URL}/projects/backend/`, {
    method: "GET",
    headers: getAuthHeaders("application/json"),
  });
  return response.json();
};

export const fetchProjectById = async (id: number) => {
  const response = await fetch(`${API_URL}/projects/${id}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
};

export const createProject = async (projectData: {
  title: string;
  content: string;
  categoryId: string | null;
  isPublished: boolean;
  cover?: File | null;
}) => {
  const formData = new FormData();
  formData.append("title", projectData.title);
  formData.append("content", projectData.content);
  formData.append("isPublished", JSON.stringify(projectData.isPublished));
  if (projectData.categoryId) formData.append("categoryId", projectData.categoryId);
  if (projectData.cover) formData.append("cover", projectData.cover);

  const response = await fetch(`${API_URL}/projects/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to create project");
  return await response.json();
};

export const editProject = async (id: string, projectData: {
  title: string;
  content: string;
  categoryId: string | null;
  isPublished: boolean;
  cover?: File | null;
}) => {
  const formData = new FormData();
  formData.append("title", projectData.title);
  formData.append("content", projectData.content);
  formData.append("isPublished", JSON.stringify(projectData.isPublished));
  if (projectData.categoryId !== null) formData.append("categoryId", projectData.categoryId);
  if (projectData.cover) formData.append("cover", projectData.cover);

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to update project");
  return await response.json();
};

export const deleteProject = async (id: number) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete project");
};
