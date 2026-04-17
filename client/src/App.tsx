import { Outlet, useLocation } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import Footer from "./components/Footer/Footer";

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
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
