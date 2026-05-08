/*
The Main Clubs list component used in multiple pages
*/

// LIBRARY IMPORTS
import { useState, Fragment } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

// COMPONENT IMPORTS
import Club from "./Club";

// CSS IMPORTS
import classes from "./Clubs.module.css";

// MAIN COMPONENT
const Clubs = ({ clubs }) => {
  // States initialization
  const [clubCount, setClubCount] = useState(15);

  // For the show more button
  const showMoreHandler = () => {
    setClubCount((count) => (count += 15));
  };

  // For the show less button
  const showLessHandler = () => {
    setClubCount((count) => (count -= 15));
  };

  return (
    <Fragment>
      {/* Display Clubs */}
      <div className={classes.images}>
        {clubs.slice(0, clubCount).map(({ logo_url, id, name, about }) => (
          <Club
            key={id}
            image={logo_url}
            id={id}
            clubName={name}
            body={about}
          />
        ))}
      </div>

      <div className={classes.show_btns}>
        {/* Show more clubs button */}
        {clubCount < clubs.length && (
          <button className={classes.show_more} onClick={showMoreHandler}>
            Show
            <br />
            more <MdExpandMore size={40} />
          </button>
        )}

        {/* Show less clubs button */}
        {clubCount > 15 && (
          <button className={classes.show_less} onClick={showLessHandler}>
            Show
            <br />
            less <MdExpandLess size={40} />
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default Clubs;
