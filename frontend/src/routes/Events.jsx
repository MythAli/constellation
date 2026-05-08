/*
The Events page used by the student user to view the events they have added to their attending list
*/

// LIBRARY IMPORTS
import { Fragment } from "react";
import { useLoaderData, redirect, useRevalidator } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";

// COMPONENT IMPORTS
import Event from "../components/Event";

// HELPERS IMPORTS
import api from "../utils/api";

// CSS IMPORTS
import classes from "./Events.module.css";

// MAIN COMPONENT
const Events = () => {
  const { events, id: userId } = useLoaderData() || []; // Extracting loader data

  // Hooks initialization
  const revalidator = useRevalidator(); // For refreshing the page with new loader data

  // The handler function to add the event to the Student's attending list
  const eventToggleHandler = async (id) => {
    // Post a request to the toggle event route
    const response = await api.post(`/user/toggleEvent/${id}`);

    // If the request is successful
    if (response.status >= 200 && response.status < 300) {
      // Re-runs all active route loaders, updating the UI with fresh data
      revalidator.revalidate();
    }
  };

  // Create the jsx button that the user can press to toggle the event for attending (Will be passed
  //    to the Event component)
  const FavoriteButton = ({ id }) => {
    return (
      <div className={classes.attend_div}>
        <GoHeartFill
          className={classes.attend_fill}
          size={50}
          onClick={() => eventToggleHandler(id)}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <p className={classes.title}>Upcoming Events</p>
      <div className={classes.events}>
        {events.map(({ title, description, start_time, end_time, id }) => (
          <Event
            key={id}
            id={id}
            title={title}
            description={description}
            start_time={start_time}
            end_time={end_time}
            /* Pass the FavoriteButton jsx component to the event component to use */
            Button={() => <FavoriteButton id={id} />}
            style={classes.event} // Pass class to control the event's main div CSS styles
          />
        ))}
      </div>
    </Fragment>
  );
};

export default Events;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const verify = await api.verifyToken(); // Check if user is logged in using backend
    const { id, authenticated, userType } = verify; // Extract backend response data

    // If the user in not authenticated, redirect to student login/signup page
    if (!authenticated) {
      return redirect("/account/student");
    }

    // If club is trying to access student events, redirect to home page
    if (userType !== "student") {
      return redirect("/");
    }

    // Use the student profile's backend route to get the attending events
    const userData = await api.get(`/user/profile?eventsFull=true`); // eventsFull=true: include all events
    const events = userData.data.attending; // Collect response from backend

    return { id, events }; // Return data for the loader to use
  } catch (error) {
    // Redirect if unauthorized, or return empty array if it's a network error
    if (error.response?.status === 401) return redirect("/account/student");
    return [];
  }
};
