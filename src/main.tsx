import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Route, Routes} from "react-router";
import Feed from "./pages/Feed/index.tsx";
import Register from "./pages/Register/index.tsx";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Feed />} />

              <Route path="/cadastro" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/perfil/editar" element={<EditProfile />} />

          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
