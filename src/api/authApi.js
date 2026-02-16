import api from "./axiosConfig";

export const loginUser = async (credentials) => {
    return api.post("/users/login", credentials);
};

export const registerUser = async (userData) => {
    return api.post("/users", userData);
};
