import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Game />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
