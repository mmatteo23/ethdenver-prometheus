import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
// import Poh from "./pages/Poh.tsx";
// import SDKDemo from "./pages/SDKDemo.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
// import Explorer from "./pages/Explorer.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
  return (
    <HashRouter>
      <header>
        <Navbar />
      </header>
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
