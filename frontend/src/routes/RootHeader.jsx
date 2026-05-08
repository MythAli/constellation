/*
The Root header page/component that is responsible for displaying both the public and user headers
*/

// LIBRARY IMPORTS
import { useEffect, Fragment } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "react-router-dom";

// COMPONENT IMPORTS
import PublicHeader from "../components/PublicHeader";
import UserHeader from "../components/UserHeader";
import GlobalLoader from "../components/GlobalLoader";
import { useLoading } from "../context/LoadingContext";

// HELPERS IMPORTS
import api, { injectLoader } from "../utils/api";

// CSS IMPORTS
import classes from "./RootHeader.module.css";

// MAIN COMPONENT
const RootHeader = () => {
  // Accessing the global context state to control the loader spinner
  const { isLoading, showLoader, hideLoader } = useLoading();

  // Extracting loader data
  const userData = useLoaderData();
  const { authenticated: isAuth, userType } = userData;

  // Hooks initialization
  const navigate = useNavigate(); // To allow redirecting to another page
  const revalidator = useRevalidator(); // For refreshing the page with new loader data

  // This useEffect is responsible for changing the state of the loader spinner
  useEffect(() => {
    injectLoader(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  const logOutHandler = () => {
    localStorage.clear(); // Clear localstorage from tokens

    // Redirect club user to club login/signup, and student user to student login/signup
    navigate(`/account/${userType === "student" ? "student" : "club"}`);

    // Trigger a revalidation of all loaders after localStorage has been updated
    revalidator.revalidate();
  };

  return (
    <Fragment>
      {/* The Global Loader only shows when isLoading is true */}
      {isLoading && <GlobalLoader />}

      <div className={isLoading ? classes.dimmed : ""}>
        <div style={{ marginBottom: "13rem" }}>
          {isAuth ? (
            <UserHeader onSetLogOut={logOutHandler} user={userData} />
          ) : (
            <PublicHeader />
          )}
        </div>

        <Outlet />
      </div>
    </Fragment>
  );
};

export default RootHeader;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const userData = await api.verifyToken(); // Check if user is logged in using backend
    return userData; // Return data for the loader to use
  } catch (err) {
    // Not authenticated or refresh failed
    return { isAuth: false, user: null };
  }
};
