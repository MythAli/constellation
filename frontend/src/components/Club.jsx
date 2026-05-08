/*
The Main Club component used in multiple pages
*/

// LIBRARY IMPORTS
import { Link } from "react-router-dom";

// CSS IMPORTS
import classes from "./Club.module.css";

// MAIN COMPONENT
const Club = ({ image, id, clubName, body }) => {
  return (
    <Link to={`/clubs/${id}`}>
      <div className={classes.image_div}>
        <div className={classes.image}>
          <img alt="Club Logo" src={image} />
        </div>
        <div className={classes.caption}>
          <p className={classes.title}>{clubName}</p>
          <p className={classes.body}>{body}</p>
        </div>
      </div>
    </Link>
  );
};

export default Club;
