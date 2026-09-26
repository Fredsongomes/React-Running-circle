const TOKEN_KEY = 'token'

// "Lembrar-me" marcado → localStorage (sobrevive ao fechar o navegador).
// Desmarcado → sessionStorage (some quando a aba fecha).
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string, remember: boolean): void {
    clearToken()
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
}
