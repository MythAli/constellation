/*
The Account page component that features two button options:
  - Go to Student login/signup
  - Go to Club login/signup
*/

// LIBRARY IMPORTS
import { Fragment } from "react";
import { Outlet, Link, redirect } from "react-router-dom";
import { FaUsers, FaArrowLeft } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";

// HELPERS IMPORTS
import api from "../utils/api";

// CSS IMPORTS
import classes from "./Account.module.css";

// MAIN COMPONENT
const Account = () => {
  return (
    <Fragment>
      {/* The Outlet that the AccountForm component will use to display itself on top of this one */}
      <Outlet />
      <Link to="../" className={classes.back_button}>
        <FaArrowLeft size={50} />
      </Link>
      <p className={classes.title}>LOGIN / SIGNUP</p>
      <div className={classes.options}>
        <Option Icon={LuUserRound} button_text="student" link="student" />
        <Option Icon={FaUsers} button_text="club" link="club" />
      </div>
    </Fragment>
  );
};

// A COMPONENT FOR HAVING DYNAMIC OPTIONS
const Option = ({ Icon, button_text, link }) => {
  return (
    <div className={classes.option}>
      <div className={classes.icon}>
        <Icon size={200} />
      </div>
      <Link to={`${link}`}>{button_text}</Link>
    </div>
  );
};

export default Account;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const verify = await api.verifyToken(); // Check if user is logged in using backend

    // If user is logged in redirect to home page
    if (verify.authenticated) {
      return redirect("/");
    }
  } catch (error) {}
};
