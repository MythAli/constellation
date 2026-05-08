/*
The student home page the allows the user to:
  - View their favorite clubs' list
  - View their attending events' list
  - Set/Upload their availability schedule.
  - Filter events from their favorite clubs based on their availability schedule.
*/

// LIBRARY IMPORTS
import { useState, Fragment } from "react";
import {
  Link,
  redirect,
  useLoaderData,
  useRevalidator,
  useNavigate,
} from "react-router-dom";
import { addDays, subDays } from "date-fns";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { GoHeartFill } from "react-icons/go";

// COMPONENT IMPORTS
import Calendar from "../components/Calendar";
import Event from "../components/Event";

// HELPERS IMPORTS
import api from "../utils/api";

// CSS IMPORTS
import classes from "./StudentHome.module.css";

// MAIN COMPONENT
const StudentHome = () => {
  const studentData = useLoaderData() || []; // Extracting loader data
  const {
    userId,
    userType,
    authenticated,
    calendarStart,
    calendarEnd,
    favorites: clubs,
    attending: events,
  } = studentData;

  // Hooks initialization
  const revalidator = useRevalidator(); // For refreshing the page with new loader data
  const navigate = useNavigate(); // To allow redirecting to another page

  // Setting calendar start and end dates using loader data
  const startDate = calendarStart
    ? new Date(calendarStart)
    : subDays(new Date(), 2); // If no DB entry, set startDate to two days before today's date
  const endDate = calendarEnd ? new Date(calendarEnd) : addDays(new Date(), 2);
  //    If no DB entry, set endDate to two days after today's date

  // State initialization
  const [range, setRange] = useState({ start: startDate, end: endDate }); // Create calendar range state
  const [calendarUpdateStatus, setCalendarUpdateStatus] = useState("");
  //    State for calendar upload request status

  // The handler function for uploading the new schedule
  const uploadScheduleHandler = async () => {
    // Check if the range objects are valid dates
    const isStartValid = !isNaN(range.start.getTime());
    const isEndValid = !isNaN(range.end.getTime());

    // If invalid date format
    if (!isStartValid || !isEndValid) {
      setCalendarUpdateStatus("Error: Invalid date format.");
      return;
    }

    // Validation, range logic (End must be after Start)
    if (range.start >= range.end) {
      setCalendarUpdateStatus("Error: End date must be after start date.");
      return;
    }

    // If no errors yet, set the request status to "Uploading..."
    setCalendarUpdateStatus(() => "Uploading...");

    // Create calendar range object
    const calendarRange = {
      calendar_start: range.start.toISOString(),
      calendar_end: range.end.toISOString(),
    };

    try {
      // Validate ISO date/time string before sending to backend
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      if (
        typeof calendarRange.calendar_start === "string" &&
        isoRegex.test(calendarRange.calendar_start) &&
        typeof calendarRange.calendar_end === "string" &&
        isoRegex.test(calendarRange.calendar_end)
      ) {
        // Send update request to the backend to update the schedule
        const response = await api.put(`/user/schedule`, calendarRange);

        // If the request succeeds, set the request status to "Successful!"
        if (response.status >= 200 && response.status < 300) {
          setCalendarUpdateStatus(() => "Successful!");
        }
      } else {
        // If the format is incorrect, set the request status to "Error: Invalid date format."
        setCalendarUpdateStatus("Error: Invalid date format.");
        return;
      }
    } catch (err) {
      // If the request fails, set the request status to "Error!"
      setCalendarUpdateStatus(() => "Error!");
    }
  };

  // The function handler that navigates to the Matching Events page, and attaches the appropriate date parameters
  const viewEventsHandler = () => {
    const startParam = range.start.toISOString();
    const endParam = range.end.toISOString();
    navigate(`/matching-events?start=${startParam}&end=${endParam}`); // Navigate to Matching Events page
  };

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
      <div className={classes.widgets}>
        <div className={classes.clubs_and_events}>
          <p className={classes.title}>FAVORITE CLUBS</p>
          <div className={classes.images}>
            {clubs.map(({ logo_url, id }) => (
              <div key={id} className={classes.image}>
                <Link to={`/clubs/${id}`}>
                  <img alt="Club Logo" src={logo_url} />
                </Link>
              </div>
            ))}
            {/* If their is at least one club, show the "Show All" button */}
            {clubs.length > 0 && (
              <Link to="/my-clubs" className={classes.show_all}>
                <p>
                  Show
                  <br />
                  All
                </p>
                <FaArrowRight className={classes.arrow} size={25} />
              </Link>
            )}
          </div>
          <div className={classes.upcoming_events}>
            <div className={classes.left}>
              <p className={classes.title}>UPCOMING EVENTS</p>
              {events.map(
                ({ id, title, description, start_time, end_time }) => (
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
                ),
              )}
            </div>
            {/* If their is at least one event, show the "Show All" button */}
            {events.length > 0 && (
              <Link to="/my-events" className={classes.show_all}>
                <p>
                  Show
                  <br />
                  All
                </p>
                <FaArrowRight className={classes.arrow} size={25} />
              </Link>
            )}
          </div>
        </div>
        <div className={classes.calendar_div}>
          <Calendar range={range} onRangeChange={setRange} />
          <button
            className={classes.upload_schedule}
            onClick={uploadScheduleHandler}
          >
            <MdOutlineFileUpload size={25} className={classes.icon} /> UPLOAD
            SCHEDULE
          </button>
          <p>{calendarUpdateStatus}</p>
          <button className={classes.view_events} onClick={viewEventsHandler}>
            <AiOutlineSchedule size={25} className={classes.icon} /> VIEW YOUR
            <br />
            MATCHING EVENTS
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default StudentHome;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const userData = await api.verifyToken(); // Check if user is logged in using backend
    const { authenticated, userType, id: userId } = userData; // Extract backend response data

    // If the user in not authenticated, redirect to student login/signup page
    if (!authenticated) {
      return redirect("/account/student");
    }

    // If club is trying to access student home, redirect to home page
    if (userType !== "student") {
      return redirect("/");
    }

    // Use the student profile's backend route to get the user's profile data
    const response = await api.get(`/user/profile`);

    // Collect and extract response from backend
    const userProfileData = {
      userId,
      userType,
      authenticated,
      ...response.data,
    };

    return userProfileData; // Return data for the loader to use
  } catch (error) {
    // Redirect if unauthorized, or return empty object if it's a network error
    if (error.response?.status === 401) return redirect("/account/student");
    return {};
  }
};
