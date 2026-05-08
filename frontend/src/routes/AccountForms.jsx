/*
The Account Forms page which can dynamically preview one of two pages:
  - The student login/signup page
  - The club login/signup page
*/

// LIBRARY IMPORTS
import { useState, Fragment } from "react";
import {
  Link,
  Form,
  useLocation,
  redirect,
  useSubmit,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";

// COMPONENT IMPORTS
import StudentSignUpForm from "../components/StudentSignUpForm.jsx";

// HELPERS IMPORTS
import api from "../utils/api.js";

// CSS IMPORTS
import classes from "./AccountForms.module.css";

// MAIN COMPONENT
const AccountForms = () => {
  // Hooks initialization
  const actionData = useActionData(); // To grab what the action (Runs when Form submitted) method returns
  const navigation = useNavigation(); // To have access to the application's navigation status
  const location = useLocation(); // To grab the pages URL
  const submit = useSubmit(); // To have control over form submission for error validation

  // Check if the Student's Account form page was selected and store in "isStudentMode"
  const isStudentMode = location.pathname === "/account/student";

  // For setting the login button text states while submitting: Login => Logging in...
  const isLoggingIn =
    navigation.state === "submitting" &&
    navigation.formData?.get("login") === "true";

  // States initialization
  const [errors, setErrors] = useState({});

  // The handle for submitting the login forms (Student/Club)
  const loginSubmitFormHandler = (event) => {
    event.preventDefault(); // Prevent default page refresh

    // Identify which button was clicked (login or sign_up)
    // The login forms have name="login" and value="true" in their submit buttons elements. When the
    //    default action path is intercepted with a handler, this value will not be included in the
    //    input date as {login:true}, so we extract it here to pass it to "action" using the "submit" method
    const submittedBy = event.nativeEvent.submitter;

    // Grab the formData
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Declare error object to capture input errors
    const newErrors = {};

    // Email Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    // If any errors, set the "errors" state to display these errors, and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, clear "errors" state and proceed to the action function
    setErrors({});
    submit(
      {
        ...Object.fromEntries(formData),
        [submittedBy.name]: submittedBy.value,
      },
      { method: "post" },
    ); // If valid, proceed to action
  };

  return (
    <div className={classes.forms}>
      <Form
        method="post"
        className={classes.login_form}
        onSubmit={loginSubmitFormHandler}
        noValidate // Do not validate using default HTML input validation, since it is being handled manually
      >
        <p className={classes.title}>Login</p>

        {/* Changes the icon depending on user type */}
        <Icon isStudentMode={isStudentMode} />

        <div className={classes.input_div}>
          <label htmlFor="email">Email</label>
          <div className={classes.input_container}>
            <input
              type="email"
              id="email"
              name="email"
              className={errors.email ? classes.input_error : ""}
            />
            {errors.email && <p className="error_text">{errors.email}</p>}
          </div>
        </div>
        <div className={classes.input_div}>
          <label htmlFor="password">Password</label>
          <div className={classes.input_container}>
            <input
              type="password"
              id="password"
              name="password"
              className={errors.email ? classes.input_error : ""}
            />
            {errors.password && <p className="error_text">{errors.password}</p>}
          </div>
        </div>

        {/* For displaying backend side errors returned from the action function */}
        {actionData?.url === "login" && actionData?.backendError && (
          <p
            className="error_text"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            {actionData.backendError}
          </p>
        )}

        <div className={classes.actions}>
          <Link to="../" type="button" className={classes.cancel}>
            Cancel
          </Link>
          <button
            name="login"
            value="true"
            className={classes.login}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </div>
      </Form>

      {/* If student mode then use the Student SignUp Form, else use the Club SignUp button  */}
      {isStudentMode ? (
        <StudentSignUpForm actionData={actionData} />
      ) : (
        <div className={classes.sign_up_div}>
          <Link to="/club-signup" type="button" className={classes.sign_up}>
            Sign Up / Create Club
          </Link>
        </div>
      )}
    </div>
  );
};

// A COMPONENT FOR HAVING DYNAMIC ICONS
const Icon = ({ isStudentMode }) => {
  return (
    <div className={classes.icon}>
      <div className={classes.icon_wrapper}>
        {isStudentMode ? <LuUserRound size={80} /> : <FaUsers size={80} />}
      </div>
    </div>
  );
};

export default AccountForms;

// THE ACTION METHOD THAT RUNS ON PAGE EXIT OR FORM SUBMISSION
export const action = async ({ request }, type) => {
  // Grab and extract form data
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);

  // The type parameter is passed in the index.jsx root file depending on student/club type
  postData.type = type; // type = 1 to login as student, type = 2 to login as club admin

  // This variable is used to determine the backend api route login/register,
  //    and is returned by the action to help with error display login/register
  const url = postData?.login === "true" ? "login" : "register";

  try {
    // Post a login/register request to the backend
    const response = await api.post(`/user/${url}`, postData);

    // Grab response from the backend
    const data = response.data;

    // If the backend returns a 200 but with an error field
    if (data.error) {
      return { backendError: data.error }; // Return to component for display
    } else {
      // Axios puts the response body in "data"
      const { accessToken, refreshToken } = data;

      // Store the access and refresh tokens in localstorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect user to their home page depending on whether it was a student/club login/register
      return type === 1 ? redirect("/student-home") : redirect("/club-home");
    }
  } catch (error) {
    // Catch the 401 status in case of backend/database error
    const errorMessage =
      error.response?.data?.error || "Login failed, something went wrong.";
    return {
      backendError: errorMessage,
      url, // To help determine if login or register error
    }; // Return to component for display
  }
};
