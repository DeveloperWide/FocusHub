export const clearLegacyAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
