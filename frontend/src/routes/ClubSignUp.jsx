/*
The Club Signup page that allows the user to input the following:
  - Email
  - Password
  - Club name
  - About
  - Club logo
  - Contact email
  - Instagram URL
  - Website URL
  - Twitter URL
  - Club officers
  - Club tags
*/

// LIBRARY IMPORTS
import { useState } from "react";
import {
  Link,
  Form,
  useLoaderData,
  redirect,
  useSubmit,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { FaUsers } from "react-icons/fa";

// HELPERS IMPORTS
import api from "../utils/api";
import publicApi from "../utils/publicApi";

// CSS IMPORTS
import classes from "./ClubSignUp.module.css";

// MAIN COMPONENT
const ClubSignUp = () => {
  const availableTags = useLoaderData() || []; // Extracting loader data

  // Hooks initialization
  const actionData = useActionData(); // Extracting action function's response
  const submit = useSubmit(); // To have control over form submission for error validation
  const navigation = useNavigation(); // To have access to the application's navigation status
  const isSigningUp = navigation.state === "submitting";

  // State initialization
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // Selected logo file state
  const [previewUrl, setPreviewUrl] = useState(null); // Logo URL state

  // The handler function for updating the club's logo file upload state
  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Overwrite with new local preview
    }
  };

  const submitHandler = (event) => {
    event.preventDefault(); // Prevent default page refresh

    // Grab the formData
    const formData = new FormData(event.currentTarget);
    formData.append("type", 2); // For backend to know it's club registration
    const newErrors = {}; // Create errors object

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get("signup_email"))) {
      newErrors.email = "Invalid account email format.";
    }
    if (!emailRegex.test(formData.get("contact_email"))) {
      newErrors.contact_email = "Invalid account email format.";
    }

    // Password validation
    if (formData.get("signup_password").length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // Club name validation
    if (formData.get("name").trim().length < 3) {
      newErrors.name = "Club name must be at least 3 characters.";
    }

    // About section validation (Character limit boundary, 10 to 500)
    const about = formData.get("about").trim();
    if (about.length < 10 || about.length > 500) {
      newErrors.about = "Description must be between 10 and 500 characters.";
    }

    // Verify that an image was uploaded
    if (!selectedFile) {
      newErrors.logo = "A club logo is required.";
    }

    // Social media URLs validation (if they aren't empty becuase they are not required)
    const urlFields = ["instagram_url", "website_url", "twitter_url"];
    urlFields.forEach((field) => {
      const val = formData.get(field).trim();
      if (val.length > 0 && !val.startsWith("http")) {
        newErrors[field] =
          "Must be a valid URL starting with http:// or https://";
      }
    });

    // Officers Array: Ensure at least one officer is listed
    const officers = formData
      .get("officers")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.trim() !== "");
    if (officers.length === 0) {
      newErrors.officers = "Please list at least one officer.";
    } else {
      // Check each officer for a First and Last name (at least two words)
      const invalidOfficers = officers.filter((name) => {
        const parts = name.split(/\s+/); // Split by any whitespace
        if (parts.length < 2)
          newErrors.officers = "Please input first and last name"; // Fails if only one name is provided
        if (parts.length > 2)
          newErrors.officers = "Please only input first and last name";

        // Check if both first and last name are at least 2 characters
        if (parts.some((part) => part.length < 2)) {
          newErrors.officers =
            "First and last name must be at least 2 characters long";
        }
      });

      if (invalidOfficers.length > 0) {
        newErrors.officers =
          "Each officer must have a first and last name (min. 2 characters each).";
      }
    }

    // Tags Selection: Check if at least one tag is selected
    if (formData.getAll("tags").length === 0) {
      newErrors.tags = "Please select at least one tag.";
    }

    // If any errors, set the "errors" state to display these errors, and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, clear "errors" state and proceed to the action function
    setErrors({});
    submit(formData, {
      method: "post",
      encType: "multipart/form-data", // This is the fix
    });
  };

  return (
    <Form
      method="post"
      encType="multipart/form-data" // For file uploads
      className={classes.sign_up_form}
      onSubmit={submitHandler}
      noValidate
    >
      <p className={classes.title}>Club Registration</p>
      <div className={classes.icon}>
        <div className={classes.icon_wrapper}>
          <FaUsers size={60} />
        </div>
      </div>
      <div className={classes.input_div}>
        <label htmlFor="signup_email">
          Email* <span className={classes.span}>(Account)</span>
        </label>
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
        <label htmlFor="signup_password">Password*</label>
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

      <div className={classes.input_div}>
        <label htmlFor="name">Club Name*</label>
        <div className={classes.input_container}>
          <input
            type="text"
            id="name"
            name="name"
            className={errors.name ? classes.input_error : ""}
          />
          {errors.name && <p className="error_text">{errors.name}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="about">About*</label>
        <div className={classes.input_container}>
          <textarea
            id="about"
            name="about"
            rows="4"
            className={errors.about ? classes.input_error : ""}
          />
          {errors.about && <p className="error_text">{errors.about}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label>Club Logo</label>

        <input
          type="file"
          name="logo_url"
          accept="image/*"
          onChange={fileChangeHandler}
          style={{ display: "none" }}
          id="logo-upload"
          htmlFor="logo_upload"
        />
        <div className={classes.input_container}>
          <button
            type="button"
            onClick={() => document.getElementById("logo-upload").click()}
            className={classes.upload_button}
          >
            Browse Files
          </button>
          <div className={classes.preview_container}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className={classes.logo_preview}
              />
            ) : (
              <div className={classes.logo_placeholder}>No Logo Selected</div>
            )}
          </div>
          {errors.logo && <p className="error_text">{errors.logo}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="contact_email">Contact Email*</label>
        <div className={classes.input_container}>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            className={errors.contact_email ? classes.input_error : ""}
          />
          {errors.contact_email && (
            <p className="error_text">{errors.contact_email}</p>
          )}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="instagram_url">Instagram URL</label>
        <div className={classes.input_container}>
          <input
            type="url"
            id="instagram_url"
            name="instagram_url"
            placeholder="https://instagram.com/yourclub"
            className={errors.instagram_url ? classes.input_error : ""}
          />
          {errors.instagram_url && (
            <p className="error_text">{errors.instagram_url}</p>
          )}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="website_url">Website URL</label>
        <div className={classes.input_container}>
          <input
            type="url"
            id="website_url"
            name="website_url"
            placeholder="https://yourclub.com"
            className={errors.website_url ? classes.input_error : ""}
          />
          {errors.website_url && (
            <p className="error_text">{errors.website_url}</p>
          )}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="twitter_url">Twitter URL</label>
        <div className={classes.input_container}>
          <input
            type="url"
            id="twitter_url"
            name="twitter_url"
            placeholder="https://twitter.com/yourclub"
            className={errors.twitter_url ? classes.input_error : ""}
          />
          {errors.twitter_url && (
            <p className="error_text">{errors.twitter_url}</p>
          )}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="officers">Officers*</label>
        <div className={classes.input_container}>
          <input
            type="text"
            id="officers"
            name="officers"
            placeholder="First Last, First Last,..."
            className={errors.officers ? classes.input_error : ""}
          />
          {errors.officers && <p className="error_text">{errors.officers}</p>}
        </div>
      </div>

      <div className={classes.input_div}>
        <label htmlFor="tags">Tags*</label>
        <div className={classes.input_container}>
          <select
            id="tags"
            name="tags"
            multiple
            className={`${classes.multi_select} ${errors.tags ? classes.input_error : ""}`}
          >
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          {errors.tags && <p className="error_text">{errors.tags}</p>}
        </div>
      </div>

      {actionData?.backendError && (
        <p
          className="error_text"
          style={{ textAlign: "center", marginBottom: "1rem" }}
        >
          {actionData.backendError}
        </p>
      )}

      <p className={classes.actions}>
        <Link to="/account/club" type="button">
          Cancel
        </Link>
        <button name="sign_up" value="true" disabled={isSigningUp}>
          {isSigningUp ? "Signing up..." : "Register Club"}
        </button>
      </p>
    </Form>
  );
};

export default ClubSignUp;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const verify = await api.verifyToken(); // Check if user is logged in using backend

    // If user is logged in redirect to home page
    if (verify.authenticated) {
      return redirect("/");
    }

    // Get the club's tags data from the backend
    const tagsReq = await publicApi.get("/tags");
    const { tags } = await tagsReq.data; // Collect response from backend

    return tags; // Return data for the loader to use
  } catch (error) {
    return error;
  }
};

// THE ACTION METHOD THAT RUNS ON PAGE EXIT OR FORM SUBMISSION
export const action = async ({ request }) => {
  // Grab and extract form data
  const formData = await request.formData();

  try {
    // Post a request to the backend to register the new club account
    const response = await api.post("/user/register", formData);
    const data = response.data; // Collect response from backend

    if (data.error) {
      // If the backend returns a 200 but with an error field
      return { backendError: data.error }; // Return to component for display
    } else {
      // Axios puts the response body in .data
      const { accessToken, refreshToken } = data;

      // Store the access and refresh tokens in localstorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect user to their club home page
      return redirect("/club-home");
    }
  } catch (error) {
    // Catche the 401 status in case of incorrect email or password
    const errorMessage = error.response?.data?.error || "Register failed";
    return {
      backendError: errorMessage,
    }; // Return this to the component
  }
};
