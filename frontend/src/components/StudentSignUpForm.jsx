/*
The Student Sign Up Form Component, used specfically by the AccountForms Component's student view
*/

// LIBRARY IMPORTS
import { useState } from "react";
import { Link, Form, useSubmit, useNavigation } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";

// CSS IMPORTS
import classes from "./StudentSignUpForm.module.css";

// MAIN COMPONENT
const StudentSignUpForm = ({ actionData }) => {
  // Hooks initialization
  const submit = useSubmit(); // To have control over form submission for error validation
  const navigation = useNavigation(); // To have access to the application's navigation status

  // State initialization
  const [errors, setErrors] = useState({});

  // For setting the signup button text states while submitting: Sign Up => Signing up...
  const isSigningUp =
    navigation.state === "submitting" &&
    navigation.formData?.get("sign_up") === "true";

  // The handle for submitting the signup form
  const submitHandler = (event) => {
    event.preventDefault(); // Prevent default page refresh

    // Grab the form data
    const formData = new FormData(event.currentTarget);

    // Store data in object
    const data = {
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      email: formData.get("signup_email").trim(),
      password: formData.get("signup_password"),
    };

    // Declare error object to capture input errors
    const newErrors = {};

    // First and last name validation
    if (data.firstName.length < 2) {
      newErrors.firstName = "First name is too short.";
    }
    if (data.lastName.length < 2) {
      newErrors.lastName = "Last name is too short.";
    }

    // Email Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // If any errors, set the "errors" state to display these errors, and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, clear "errors" state and proceed to the action function (In AccountForms)
    setErrors({});
    submit(event.currentTarget);
  };

  return (
    <Form
      method="post"
      className={classes.sign_up_form}
      onSubmit={submitHandler}
      noValidate // Do not validate using default HTML input validation, since it is being handled manually
    >
      <p className={classes.title}>Sign Up</p>
      <div className={classes.icon}>
        <div className={classes.icon_wrapper}>
          <LuUserRound size={80} />
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="first_name">First Name</label>
        <div className={classes.input_container}>
          <input
            type="text"
            id="first_name"
            name="firstName"
            className={errors.firstName ? classes.input_error : ""}
          />
          {errors.firstName && <p className="error_text">{errors.firstName}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="last_name">Last Name</label>
        <div className={classes.input_container}>
          <input
            type="text"
            id="last_name"
            name="lastName"
            className={errors.lastName ? classes.input_error : ""}
          />
          {errors.lastName && <p className="error_text">{errors.lastName}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="signup_email">Email</label>
        <div className={classes.input_container}>
          <input
            type="email"
            id="signup_email"
            name="signup_email"
            className={errors.email ? classes.input_error : ""}
          />
          {errors.email && <p className="error_text">{errors.email}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="signup_password">Password</label>
        <div className={classes.input_container}>
          <input
            type="password"
            id="signup_password"
            name="signup_password"
            className={errors.password ? classes.input_error : ""}
          />
          {errors.password && <p className="error_text">{errors.password}</p>}
        </div>
      </div>

      {actionData?.url === "register" && actionData?.backendError && (
        <p
          className="error_text"
          style={{ textAlign: "center", marginBottom: "1rem" }}
        >
          {actionData.backendError}
        </p>
      )}

      <p className={classes.actions}>
        <Link to="../" type="button">
          Cancel
        </Link>
        <button name="sign_up" value="true" disabled={isSigningUp}>
          {isSigningUp ? "Signing up..." : "Sign Up"}
        </button>
      </p>
    </Form>
  );
};

export default StudentSignUpForm;
