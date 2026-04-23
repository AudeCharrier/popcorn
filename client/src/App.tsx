import { Outlet, useLocation } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import Footer from "./components/Footer/Footer";
import ChatBox from "./components/Messagerie/ChatBox";

function App() {
  const { pathname } = useLocation();

  let themeClass = "default-theme";

  if (pathname === "/") {
    themeClass = "home-theme";
  } else if (pathname.startsWith("/films-series/movie/")) {
    themeClass = "movie-theme";
  } else if (pathname.startsWith("/films-series/tv/")) {
    themeClass = "tv-theme";
  } else if (pathname.startsWith("/rechercher/")) {
    themeClass = "search-theme";
  } else if (pathname === "/seances") {
    themeClass = "seances-theme";
  }

  return (
    <div className={`app ${themeClass}`}>
      <Navbar />
      <ChatBox />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
