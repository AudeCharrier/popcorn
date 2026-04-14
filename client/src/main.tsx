// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import FilmsSeries from "./pages/FilmsSeries/FilmsSeries";
import Home from "./pages/Home/Home";

const router = createBrowserRouter([
  {
    //path: "/", // The root path
    // element: <App />, // Renders the App component for the home page
    element: <App />,
    id: "app",
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/films-series",
        element: <FilmsSeries />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
