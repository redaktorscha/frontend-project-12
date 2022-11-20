const getAuthConfig = () => {
  const { token } = JSON.parse(localStorage.getItem('user'));
  const authRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return authRequestConfig;
};

export default getAuthConfig;
