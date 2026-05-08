/*
 The User Header component that is displayed on every page when a student/club user is logged in
*/

// LIBRARY IMPORTS
import { Link } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { FiHome } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

// CSS IMPORTS
import classes from "./UserHeader.module.css";

// MAIN COMPONENT
const UserHeader = ({ onSetLogOut, user }) => {
  // Grab user's name and type (Student or Club user)
  const { name, userType } = user;

  const isStudent = userType === "student";

  return (
    <header className={classes.header}>
      <Link
        to={isStudent ? "/student-home" : "/club-home"} // User home button redirect logic
        className={classes.icon_wrapper}
      >
        {isStudent ? <LuUserRound size={80} /> : <FaUsers size={80} />}
      </Link>
      <p className={classes.name}>
        {name}
        {!isStudent ? (
          <span className={classes.club_superscript}>(Club Admin)</span>
        ) : (
          ""
        )}
      </p>
      <button className={classes.logout} onClick={onSetLogOut}>
        Log out <BiLogOut size={20} />
      </button>
      <Link to="/" className={classes.home}>
        <FiHome size={65} strokeWidth={1} />
      </Link>
    </header>
  );
};

export default UserHeader;
