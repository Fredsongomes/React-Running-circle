import {Navigate, Outlet} from "react-router";
import {getToken} from "../../services/token.ts";

export function ProtectedRoute () {
    if (!getToken()) {
        return <Navigate to="/auth/login" replace />
    }
    return <Outlet />
}
