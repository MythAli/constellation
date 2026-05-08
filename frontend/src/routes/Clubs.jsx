/*
The Clubs page used by the student user to view the clubs they have added to their favorites' list
*/

// LIBRARY IMPORTS
import { Fragment } from "react";
import { useLoaderData, redirect } from "react-router-dom";

// COMPONENT IMPORTS
import Clubs from "../components/Clubs";

// HELPERS IMPORTS
import api from "../utils/api";

// CSS IMPORTS
import classes from "./Clubs.module.css";

// MAIN COMPONENT
const ClubsPage = () => {
  const clubs = useLoaderData() || []; // Extracting loader data
  return (
    <Fragment>
      <p className={classes.title}>My Clubs</p>
      <Clubs clubs={clubs} />
    </Fragment>
  );
};

export default ClubsPage;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const verify = await api.verifyToken(); // Check if user is logged in using backend
    const { authenticated, userType } = verify; // Extract backend response data

    // If the user in not authenticated, redirect to student login/signup page
    if (!authenticated) {
      return redirect("/account/student");
    }

    // If club is trying to access student clubs, redirect to home page
    if (userType !== "student") {
      return redirect("/");
    }

    // Use the student profile's backend route to get the favorite clubs
    const userData = await api.get(`/user/profile?clubsFull=true`); // clubsFull=true: include all clubs
    const clubs = userData?.data?.favorites || []; // Collect response from backend

    return clubs; // Return data for the loader to use
  } catch (error) {
    // Redirect if unauthorized, or return empty array if it's a network error
    if (error.response?.status === 401) return redirect("/account/student");
    return [];
  }
};
