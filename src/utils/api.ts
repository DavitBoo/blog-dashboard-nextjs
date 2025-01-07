export const fetchPosts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    return response.json();
  };
  
  export const togglePublishPost = async (id: number, publish: boolean) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: publish }),
    });
  };
  
  export const createPost = async (post: { title: string; content: string }) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
  };
  
  export const fetchCommentsByPostId = async (postId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`
    );
    return response.json();
  };
  
  export const deleteComment = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`, {
      method: 'DELETE',
    });
  };
  