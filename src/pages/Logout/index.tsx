import {useEffect} from "react";
import {Navigate} from "react-router";
import {clearToken} from "../../services/token.ts";

export function Logout() {
    // efeito colateral fora da renderização
    useEffect(() => {
        clearToken();
    }, []);

    return <Navigate to="/auth/login" replace />;
}
