import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Route, Routes} from "react-router";
import Feed from "./pages/Feed/index.tsx";
import Register from "./pages/Register/index.tsx";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayout";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>

              <Route path="/auth">
                  <Route path="cadastro" element={<Register />} />
                  <Route path="login" element={<Login />} />
              </Route>

              <Route path="/" element={<AppLayout />}>

              <Route path="" element={<Feed />} />
              <Route path="postagem" element={<NewPost />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="perfil/editar" element={<EditProfile />} />

              </Route>


          </Routes>
      </BrowserRouter>
  </StrictMode>
)
