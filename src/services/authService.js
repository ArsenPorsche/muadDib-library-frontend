import { loginUser, registerUser } from "../api/authApi";

export async function login(credentials) {
    const { data } = await loginUser(credentials);
    return data;
}

export async function signup(userData) {
    const { data } = await registerUser(userData);
    return data;
}
