import api from "./axiosConfig";

export const fetchBooks = async (params) => {
    return api.get("/books", { params });
};

export const fetchUserBooks = async (params) => {
    return api.get("/userBooks", { params });
};

export const addUserBook = async (data) => {
    return api.post("/userBooks", data);
};

export const updateUserBook = async (id, data) => {
    return api.put(`/userBooks/${id}`, data);
};

export const deleteUserBook = async (id) => {
    return api.delete(`/userBooks/${id}`);
};