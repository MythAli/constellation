/*
The Matching Events page used by the student user to view the events from their favorite clubs that match 
the schedule they have provided
*/

// LIBRARY IMPORTS
import { Fragment } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

// COMPONENT IMPORTS
import Event from "../components/Event";

// HELPERS IMPORTS
import api from "../utils/api";
import { formatDateTime, formatDate, formatTime } from "../utils/helpers";

// CSS IMPORTS
import classes from "./MatchingEvents.module.css";

// MAIN COMPONENT
const MatchingEvents = () => {
  // Extracting loader data
  const {
    events = [],
    range: { start, end } = { start: new Date(), end: new Date() },
  } = useLoaderData() || [];

  return (
    <Fragment>
      <p className={classes.title}>
        Matching Events ({formatDate(start)} {"->"} {formatDate(end)})
      </p>
      <div className={classes.events}>
        {events.map(({ id, title, description, start_time, end_time }) => (
          <Event
            key={id}
            id={id}
            title={title}
            description={description}
            start_time={start_time}
            end_time={end_time}
            style={classes.event}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default MatchingEvents;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async ({ request }) => {
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

    // The start and end date for the student schedule are stored in the url parameters
    const url = new Date(request.url);
    const searchParams = new URL(request.url).searchParams;
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    // Validation, ensure both dates exist before sending the request
    if (!start || !end) {
      return { events: [], error: "Missing date range parameters." };
    }

    // Post a request to the backend to get the matching events
    const response = await api.post("/user/matching-events", {
      start,
      end,
    });

    return {
      events: response.data.events,
      range: { start, end },
    }; // Return data for the loader to use
  } catch (error) {
    return redirect("/account/student");
  }
};
