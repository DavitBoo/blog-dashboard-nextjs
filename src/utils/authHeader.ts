export const getAuthHeaders = (contentType?: string) => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const token = cookies["token"];
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`
  };

  // Solo añade Content-Type si se especifica
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
};