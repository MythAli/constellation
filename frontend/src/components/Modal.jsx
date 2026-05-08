/*
This is a Modal component that can me used by any other component to add a low opacity background, 
  to make the component pop out.
*/

// LIBRARY IMPORTS
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

// CSS IMPORTS
import classes from "./Modal.module.css";

// MAIN COMPONENT
const Modal = ({ children, closeOnBackgroundClick = false }) => {
  // Hooks initialization
  const navigate = useNavigate();

  // A handler to close the component wrapped by this model when a user clicks on the dim backgound
  const closeHandler = () => {
    if (closeOnBackgroundClick) {
      navigate("../");
    }
  };

  return (
    <Fragment>
      <div className={classes.backdrop} onClick={closeHandler} />
      <dialog open className={classes.modal}>
        {children}
      </dialog>
    </Fragment>
  );
};

export default Modal;
