import {instance} from "./api.ts";
import {saveToken} from "./token.ts";

export interface NewUser {
    name: string;
    login: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    username: string;
    email: string | null;
    avatarUrl: string | null;
    bio: string | null;
    workoutsCount: number;
    createdAt: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface Credentials {
    login: string;
    password: string;
}

export interface UpdateUser {
    name?: string;
    username?: string;
    bio?: string;
    avatar?: File;
}

export async function createUser(user: NewUser): Promise<User> {
    const response = await instance.post<User>('/users', user)
    return response.data
}

export async function signIn(credentials: Credentials, remember = false): Promise<LoginResponse> {
    const response = await instance.post<LoginResponse>('/auth/login', credentials)
    saveToken(response.data.token, remember)
    return response.data
}


export async function fetchLoggedUser(): Promise<User> {
    const response = await instance.get<User>('/users/me');
    return response.data
}


export async function updateUser(user: UpdateUser): Promise<User> {
    const body = new FormData()

    if (user.name) {
        body.append('name', user.name)
    }

    if (user.username) {
        body.append('username', user.username)
    }

    if (user.bio !== undefined) {
        body.append('bio', user.bio)
    }

    if (user.avatar) {
        body.append('avatar', user.avatar)
    }

    const response = await instance.put<User>('/users/me', body)

    return response.data
}
