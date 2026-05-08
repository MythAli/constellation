/*
The Main Event component used in multiple pages
  - This component has the option to add a button for different parent components that need to add 
    a button for any functionality the parent component desires.
*/

// LIBRARY IMPORTS
import { FaArrowRightLong } from "react-icons/fa6";

// HELPERS IMPORTS
import { formatDateTime, formatTime } from "../utils/helpers";

// CSS IMPORTS
import classes from "./Event.module.css";

// MAIN COMPONENT
const Event = ({
  id,
  title,
  description,
  start_time,
  end_time,
  Button = () => <div />, // Some events have a button to add/remove it
  style, // Any parent component can control the event's main div CSS styles
}) => {
  return (
    <div className={`${classes.event} ${style}`} key={id}>
      <div>
        <p className={classes.event_title}>{title}</p>
        <p className={classes.event_desc}>
          <b>Activity:</b> {description}
        </p>
        <p className={classes.event_date}>
          <b>Time & Date:</b> {formatDateTime(start_time)}{" "}
          <FaArrowRightLong style={{ transform: "translateY(25%)" }} />{" "}
          {formatTime(end_time)}
        </p>
      </div>
      <Button />
    </div>
  );
};

export default Event;
