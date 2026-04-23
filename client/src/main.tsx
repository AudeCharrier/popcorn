// Import necessary modules from React and React Router
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import FilmsSeries from "./pages/FilmsSeries/FilmsSeries";
import Home from "./pages/Home/Home";
import Rechercher from "./pages/Rechercher/Rechercher";
import Seances from "./pages/Seances/Seances";

const router = createBrowserRouter([
  {
    element: <App />,
    id: "app",
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/films-series/movie/:movieId",
        element: <FilmsSeries type="movie" />,
      },
      {
        path: "/films-series/tv/:movieId",
        element: <FilmsSeries type="tv" />,
      },
      {
        path: "/rechercher/:id",
        element: <Rechercher />,
      },
      {
        path: "/seances",
        element: <Seances />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(<RouterProvider router={router} />);
