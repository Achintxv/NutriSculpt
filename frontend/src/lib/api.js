const API_URL = "http://localhost:8000";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = { detail: text };
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
}