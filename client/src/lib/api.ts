export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchHealth = async () => {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error("Failed to fetch health status");
  }
  return response.json();
};
