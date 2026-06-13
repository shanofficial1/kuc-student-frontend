export const checkAuth = async (token) => {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER}/api/auth/check-auth`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Token invalid");
  }

  return await res.json();
};