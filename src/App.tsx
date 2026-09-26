import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import AppLayout from "./components/AppLayout";
import {ProtectedRoute} from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import {Logout} from "./pages/Logout";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth">
                    <Route index element={<Navigate to="login" replace/>}/>
                    <Route path="cadastro" element={<Register/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="logout" element={<Logout/>}/>
                </Route>

                <Route element={<ProtectedRoute/>}>
                    <Route path="/" element={<AppLayout/>}>
                        <Route index element={<Feed/>}/>
                        <Route path="postagem" element={<NewPost/>}/>
                        <Route path="perfil" element={<Profile/>}/>
                        <Route path="perfil/editar" element={<EditProfile/>}/>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
