import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="*" element={<Home title={"Prometeus"} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <footer>
        <Footer />
      </footer>
    </HashRouter>
  );
}

export default App;
