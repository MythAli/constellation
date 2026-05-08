/*
The Club page is for displaying all information associated with an individual club, it has 2 views:
  - A public view, where the club data can be viewed
  - A student view, where the student can add a club to their favoirtes list, or mark an event for attending
*/

// LIBRARY IMPORTS
import { useState, Fragment } from "react";
import { useLoaderData, redirect, Link, useNavigate } from "react-router-dom";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FaInstagram } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { FaTwitter } from "react-icons/fa";

// COMPONENT IMPORTS
import Event from "../components/Event";

// HELPERS IMPORTS
import api from "../utils/api";
import publicApi from "../utils/publicApi";

// CSS IMPORTS
import classes from "./Club.module.css";

// MAIN COMPONENT
const ClubPage = () => {
  // Hooks initialization
  const navigate = useNavigate();

  // Extracting loader function data
  const { clubData, userData, verify } = useLoaderData() || {};
  const {
    id: clubId,
    name,
    about,
    logo_url,
    contact_email,
    officers,
    instagram_url,
    website_url,
    twitter_url,
    tags,
    events,
  } = clubData;
  const { id: userId = 0, authenticated = false, userType = "" } = verify;

  // If logged in as a Student, extract their favorite clubs, and the events they have marked as attending
  const userEvents =
    userType === "student" ? userData.attending.map(({ id }) => id) : []; // [eventId, eventId, ...]
  const userClubs =
    userType === "student" ? userData.favorites.map(({ id }) => id) : [];

  // State initialization
  const [isFavorite, setIsFavorite] = useState(userClubs.includes(clubId)); // Club is favorite state
  //    Array of Objects state for holding the events, and marking the ones on the student's attendace list
  const [eventsAttending, setEventsAttending] = useState(() =>
    events.map((event) => ({
      ...event,
      attending: userEvents.includes(event.id),
    })),
  );

  // The handler function to add the club to the Student's favorites list
  const followButtonHandler = async () => {
    // Post a request to the toggle favorite route
    const response = await api.post(`/user/toggleFavorite/${clubId}`);

    // If the request is successful, update the favorite club state
    if (response.status >= 200 && response.status < 300) {
      setIsFavorite((current) => !current);
    }
  };

  // The handler function to add the event to the Student's attending list
  const eventToggleHandler = async (id) => {
    // Post a request to the toggle event route
    const response = await api.post(`/user/toggleEvent/${id}`);

    // If the request is successful, update the events object array state
    if (response.status >= 200 && response.status < 300) {
      const updatedEvents = eventsAttending.map((event) => {
        if (event.id === id) {
          return { ...event, attending: !event.attending };
        }
        return event;
      });

      setEventsAttending(() => updatedEvents);
    }
  };

  // Create the jsx button that the user can press to toggle the event for attending (Will be passed
  //    to the Event component)
  const FavoriteButton = ({ id, attending }) => {
    return (
      <Fragment>
        {/* If not logged in as a student, don't add the button */}
        {userType === "student" && (
          <div className={classes.attend_div}>
            {/* If event marked for attending use the filled heart icon, otherwise use the empty one */}
            {attending ? (
              <GoHeartFill
                className={classes.attend_fill}
                size={50}
                onClick={() => eventToggleHandler(id)}
              />
            ) : (
              <GoHeart
                className={classes.attend}
                size={50}
                onClick={() => eventToggleHandler(id)}
              />
            )}
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <main className={classes.main}>
      <div className={classes.left}>
        <p className={classes.club_name}>{name}</p>
        <div className={classes.image}>
          <img alt="Club Logo" src={logo_url} />
        </div>
        {/* If not logged in as a student, don't add the button */}
        {userType === "student" && (
          <button className={classes.follow} onClick={followButtonHandler}>
            {/* If club marked as favorite, use the filled heart icon, otherwise use the empty one */}
            {isFavorite ? <GoHeartFill size={25} /> : <GoHeart size={25} />}{" "}
            {isFavorite ? "unfollow" : "follow"}{" "}
          </button>
        )}
        <div className={classes.tags}>
          {tags.map((tag) => (
            <p key={tag} className={classes.tag}>
              {tag}
            </p>
          ))}
        </div>
        <p className={classes.contact}>
          <span>CONTACT: </span>
          {contact_email}
        </p>
        <p className={classes.officers}>
          <span className={classes.officer_title}>OFFICERS: </span>
          {officers.map((officer, index) => (
            <span key={index}>
              {officer}
              {index < officers.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <div className={classes.social_media}>
          <Link to={instagram_url} target="_blank">
            <FaInstagram size={40} className={classes.social} />
          </Link>
          <Link to={website_url} target="_blank">
            <LuGlobe size={40} className={classes.web} />
          </Link>
          <Link to={twitter_url} target="_blank">
            <FaTwitter size={40} className={classes.social} />
          </Link>
        </div>
      </div>
      <div className={classes.right}>
        <p className={classes.about_title}>ABOUT</p>
        <p className={classes.about}>{about}</p>
        <p className={classes.events_title}>EVENTS</p>
        {eventsAttending.map(
          ({ id, title, description, start_time, end_time, attending }) => (
            <Event
              key={id}
              id={id}
              title={title}
              description={description}
              start_time={start_time}
              end_time={end_time}
              /* Pass the FavoriteButton jsx component to the event component to use */
              Button={() => <FavoriteButton id={id} attending={attending} />}
              style={classes.event} // Pass class to control the event's main div CSS styles
            />
          ),
        )}
      </div>
    </main>
  );
};

export default ClubPage;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async ({ params }) => {
  try {
    let verify = await api.verifyToken(); // Check if user is logged in using backend
    let userData = {};

    // If the user is a student, fill the userData object to use in the component
    if (verify.authenticated && verify.userType === "student") {
      userData = await api.get(`/user/profile?clubsFull=true&eventsFull=true`);
      userData = userData.data;
    }

    // Get the club data from the backend
    const response = await publicApi.get(`/${params.clubId}`);
    const clubData = await response.data; // Collect response from backend

    return { clubData, userData, verify }; // Return data for the loader to use
  } catch (error) {
    console.error(error);
    return redirect("/"); // Redirect user to home page if any error occurs
  }
};
