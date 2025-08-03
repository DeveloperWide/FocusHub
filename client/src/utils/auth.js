export const saveUserData = (token, user) => {
    localStorage.setItem("token", token),
    localStorage.setItem("user", JSON.stringify(user))
}

export const getToken = () => {
    return localStorage.getItem("token")
}

export const getUser = () => {
    let user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"
}

export const isLoggedIn = () => {
    return (!!getToken() && !!getUser());
};