/*
This Add Event page is the popup from page that is used in the Club Home page to add new events to their club
*/

// LIBRARY IMPORTS
import { useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useSubmit,
  redirect,
  useOutletContext,
} from "react-router-dom";
import { BsFillCalendar3EventFill } from "react-icons/bs";

// COMPONENT IMPORTS
import Modal from "../components/Modal";

// HELPERS IMPORTS
import api from "../utils/api";

// CSS IMPORTS
import classes from "./AddEvent.module.css";

// MAIN COMPONENT
const AddEvent = ({ club_id }) => {
  // Hooks initialization
  const submit = useSubmit(); // To have control over form submission for error validation
  const actionData = useActionData(); // Extracting action function's response
  const { clubId } = useOutletContext(); // To grab the clubId passed down from the Club Home using Outlet

  // State initialization
  const [errors, setErrors] = useState({});

  const submitHandler = (event) => {
    event.preventDefault(); // Prevent default page refresh

    // Grab the formData
    const formData = new FormData(event.currentTarget);
    const title = formData.get("event_title");
    const description = formData.get("description");
    const startTime = formData.get("start_time");
    const endTime = formData.get("end_time");

    // Declare error object to capture input errors
    const newErrors = {};

    // Title Validation
    if (!title || title.trim().length < 3) {
      newErrors.event_title = "Event title must be at least 3 characters long.";
    }

    // Time Presence Validation
    if (!startTime) {
      newErrors.start_time = "Please select a start date/time.";
    }
    if (!endTime) {
      newErrors.end_time = "Please select an end date/time.";
    }

    // Chronological Validation for the date/time inputs
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const now = new Date();

      if (start < now) {
        newErrors.start_time = "Start time cannot be in the past.";
      }

      if (end <= start) {
        newErrors.end_time = "End time must be after the start time.";
      }
    }

    // Description Validation
    if (!description) {
      newErrors.description = "Description can not be empty.";
    }
    if (description && description.length < 20) {
      newErrors.description = "Description must be at lest 20 characters.";
    }
    if (description && description.length > 1000) {
      newErrors.description = "Description must be under 1000 characters.";
    }

    // If any errors, set the "errors" state to display these errors, and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, clear "errors" state and proceed to the action function
    setErrors({});
    submit(formData, { method: "post" });
  };

  return (
    <Modal>
      <Form
        method="post"
        className={classes.event_form}
        onSubmit={submitHandler}
        noValidate
      >
        <p className={classes.title}>Add Event</p>
        <div className={classes.icon}>
          <div className={classes.icon_wrapper}>
            <BsFillCalendar3EventFill size={80} />
          </div>
        </div>
        {/* Hidden input to pass clubId */}
        <input type="hidden" name="club_id" value={clubId} />{" "}
        <div className={classes.input_div}>
          <label htmlFor="event_title">Title</label>
          <div className={classes.input_container}>
            <input
              type="text"
              id=""
              name="event_title"
              className={errors.event_title ? classes.input_error : ""}
            />
            {errors.event_title && (
              <p className="error_text">{errors.event_title}</p>
            )}
          </div>
        </div>
        <div className={classes.input_div}>
          <label htmlFor="description">Description</label>
          <div className={classes.input_container}>
            <input
              type="text"
              id="description"
              name="description"
              className={errors.description ? classes.input_error : ""}
            />
            {errors.description && (
              <p className="error_text">{errors.description}</p>
            )}
          </div>
        </div>
        <div className={classes.input_div}>
          <label htmlFor="start_time">Start Time</label>
          <div className={classes.input_container}>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              required
              className={errors.start_time ? classes.input_error : ""}
            />
            {errors.start_time && (
              <p className="error_text">{errors.start_time}</p>
            )}
          </div>
        </div>
        <div className={classes.input_div}>
          <label htmlFor="end_time">End Time</label>
          <div className={classes.input_container}>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              required
              className={errors.end_time ? classes.input_error : ""}
            />
            {errors.end_time && <p className="error_text">{errors.end_time}</p>}
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
        <div className={classes.actions}>
          <Link to="../" type="button" className={classes.cancel}>
            Cancel
          </Link>
          <button className={classes.event}>Add</button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEvent;

// THE ACTION METHOD THAT RUNS ON PAGE EXIT OR FORM SUBMISSION
export const action = async ({ request }) => {
  // Grab and extract form data
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);

  // Validation: Basic check to ensure end is after start
  if (new Date(postData.end_time) <= new Date(postData.start_time)) {
    return { backendError: "End time must be after start time." };
  }

  try {
    // Post an add event request to the backend
    const response = await api.post("/user/events/addEvent", postData);

    // Redirect back to Club Home if request succeeds
    return redirect("/club-home");
  } catch (error) {
    return {
      backendError: error.response?.data?.error || "Failed to create event",
    };
  }
};
