/*
 The Public Header component that is displayed on every public page
*/

// LIBRARY IMPORTS
import { Link } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FiHome } from "react-icons/fi";

// CSS IMPORTS
import classes from "./PublicHeader.module.css";

// MAIN COMPONENT
const PublicHeader = () => {
  return (
    <header className={classes.header}>
      <p>
        <Link to="/account" className={classes.button}>
          Login / Sign Up
          <MdOutlineAccountCircle size={26} />
        </Link>
      </p>
      <Link to="/" className={classes.home}>
        <FiHome size={65} strokeWidth={1} />
      </Link>
    </header>
  );
};

export default PublicHeader;
