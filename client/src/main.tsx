import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
//import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/Error";
import RacesPage from "./pages/Races.js";


import CharacterDashboard from "./pages/CharacterDashboard.jsx";
import CharacterInfoPage from "./pages/CharacterInfoPage.tsx";
import CharacterStatsPage from "./pages/CharacterStatsPage.tsx";
import CharacterProficiencies from "./pages/CharacterProficienciesPage.tsx";
import CharacterEquipmentPage from "./pages/CharacterEquipmentPage.tsx";
import CharacterSpellsPage from "./pages/CharacterSpellsPage.tsx";
import CharacterEditPage from "./pages/CharacterEditPage.tsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CharacterDashboard  />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/characterinfo",
        element: <CharacterInfoPage />
      },
      {
        path: "/character-stats",
        element: <CharacterStatsPage />

      },
      
      {
        path: "/profiles/:username",
        element: <Profile />,
      },
      {
        path: '/characters',
        element: <CharacterDashboard />,
      },
      {
        path: '/character-equipment',
        element: <CharacterEquipmentPage />,
      },
      {
        path: '/character-proficiencies',
        element: <CharacterProficiencies />,

      },
      {
        path: "/character-spells",
        element: <CharacterSpellsPage />,
      },
      {
        path: "/character-edit",
        element: <CharacterEditPage />,
      },
      {
        path: "/me",
        element: <Profile />,
      },
      {
        path: "/thoughts/:thoughtId",
        element: <SingleThought />,
      },
      {
        path: "/Races",
        element: <RacesPage />,
      },
    
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
