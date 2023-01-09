const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default getAuthConfig;
