export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }

  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken) {
    throw new Error("Access token not found.");
  }

  let response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(
      `${apiUrl}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    const refreshResult = await refreshResponse.json();

    if (!refreshResponse.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      throw new Error(
        refreshResult.message ||
          "Session expired. Please login again."
      );
    }

    accessToken = refreshResult.accessToken;

    localStorage.setItem(
      "accessToken",
      refreshResult.accessToken
    );

    response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
}