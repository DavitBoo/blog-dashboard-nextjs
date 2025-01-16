
// Helper function to get the JWT token
export const getAuthHeaders = () => {
    // Parse cookies to find the token
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  
    const token = cookies["token"]; // Replace 'token' with your cookie's name
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };