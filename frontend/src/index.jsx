// LIBRARY IMPORTS
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// COMPONENT IMPORTS + COMPONENT ACTIONS AND LOADERS
import RootHeader, { loader as rootHeaderLoader } from "./routes/RootHeader";
import Home, { loader as homeLoader } from "../src/routes/Home";
import Account, { loader as accountLoader } from "./routes/Account";
import AccountForms, { action as loginAction } from "./routes/AccountForms";
import StudentHome, { loader as studentHomeLoader } from "./routes/StudentHome";
import Clubs, { loader as clubsLoader } from "./routes/Clubs";
import Club, { loader as clubLoader } from "./routes/Club";
import Events, { loader as eventsLoader } from "./routes/Events";
import ClubSignUp, {
  loader as clubSignUpLoader,
  action as clubSignUpAction,
} from "./routes/ClubSignUp";
import ClubHome, {
  loader as clubHomeLoader,
  action as clubHomeAction,
} from "./routes/ClubHome";
import AddEvent, { action as addEventAction } from "./routes/AddEvent";
import MatchingEvents, {
  loader as matchingEventsLoader,
} from "./routes/MatchingEvents";
import { LoadingProvider } from "./context/LoadingContext";

// CSS IMPORTS
import "./index.css";

// CREATING REACT ROUTER'S OBJECT
const router = createBrowserRouter([
  {
    path: "/", // Setting the RootHeader component as the root page for all pages
    element: <RootHeader />,
    loader: rootHeaderLoader,
    children: [
      {
        index: true, // path: "/",
        element: <Home />,
        loader: homeLoader,
      },
      { path: "clubs/:clubId", element: <Club />, loader: clubLoader },
      {
        path: "account",
        element: <Account />,
        loader: accountLoader,
        children: [
          {
            path: "student",
            element: <AccountForms />,
            action: (args) => loginAction(args, 1), // If login for student, set the "type" param to 1
          },
          {
            path: "club",
            element: <AccountForms />,
            action: (args) => loginAction(args, 2), // If login for club, set the "type" param to 1
          },
        ],
      },
      {
        path: "club-signup",
        element: <ClubSignUp />,
        loader: clubSignUpLoader,
        action: clubSignUpAction,
      },
      {
        path: "student-home",
        element: <StudentHome />,
        loader: studentHomeLoader,
      },
      { path: "my-clubs/", element: <Clubs />, loader: clubsLoader },
      { path: "my-events/", element: <Events />, loader: eventsLoader },
      {
        path: "matching-events",
        element: <MatchingEvents />,
        loader: matchingEventsLoader,
      },
      {
        path: "club-home",
        element: <ClubHome />,
        loader: clubHomeLoader,
        action: clubHomeAction,
        children: [
          { path: "add-event", element: <AddEvent />, action: addEventAction },
        ],
      },
    ],
  },
]);

// Creating React Webpage using "index.html" root element, and attaching the router
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* The React context provider for setting up React Context's global state */}
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  </React.StrictMode>,
);
