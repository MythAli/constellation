/*
A components that provides a popup loader spinner, and sits at the top of all pages (At the root). This 
components appears during a api request to the backend, and disappears when the api request is done.  
*/

// CSS IMPORTS
import classes from "./GlobalLoader.module.css";

// MAIN COMPONENT
const GlobalLoader = () => {
  return (
    <div className={classes.overlay}>
      <div className={classes.spinner}></div>
    </div>
  );
};

export default GlobalLoader;
