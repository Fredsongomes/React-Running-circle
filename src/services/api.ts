import axios, {isAxiosError} from 'axios';
import {clearToken, getToken} from "./token.ts";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Token expirado ou inválido: limpa a sessão e volta para o login.
// O próprio /auth/login também responde 401 (senha errada) — esse caso
// é tratado pela tela, então não redireciona.
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        if (isAxiosError(error) && error.response?.status === 401 && !isLoginRequest) {
            clearToken();
            window.location.assign('/auth/login');
        }
        return Promise.reject(error);
    }
);

/** Extrai a mensagem `{ message }` que a API devolve em todo erro. */
export function getErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}
