import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Album from "./pages/Album";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadMusic from "./pages/UploadMusic";
import CreateAlbum from "./pages/CreateAlbum";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";


function App() {

  return (

    <BrowserRouter>

      <div style={{
        background: "black",
        minHeight: "100vh"
      }}>

        <Navbar />

        <div style={{
          display: "flex"
        }}>

          <Sidebar />

          <div style={{
            flex: 1
          }}>

            <Routes>

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/albums/:albumId"
                element={<Album />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              <Route
                path="/upload"
                element={<UploadMusic />}
              />

              <Route
                path="/create-album"
                element={<CreateAlbum />}
              />



            </Routes>

          </div>

        </div>

      </div>

    </BrowserRouter>

  )

}

export default App;