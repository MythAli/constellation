/*
The Club Home page is used by the Club Admin after they login/register to:
  - View/edit the club's name.
  - View/edit the club's logo.
  - View/edit the club's tags.
  - View/edit the club's contact_email.
  - View/edit the club's officers.
  - View/edit the club's social media links.
  - Voew/edit the club's about secion.
  - View/Add/Delete the clubs' events.
*/

// LIBRARY IMPORTS
import { useState, useEffect, useMemo, Fragment } from "react";
import {
  Form,
  useLoaderData,
  useActionData,
  useSubmit,
  Link,
  redirect,
  Outlet,
} from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { FaTwitter } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { AiOutlineMinusCircle, AiOutlinePlus } from "react-icons/ai";

// COMPONENT IMPORTS
import Event from "../components/Event";

// HELPERS IMPORTS
import api from "../utils/api";
import publicApi from "../utils/publicApi";
import { formatDateTime } from "../utils/helpers";

// CSS IMPORTS
import classes from "./ClubHome.module.css";

// MAIN COMPONENT
const ClubHome = () => {
  // Extracting loader function data
  const { clubData, tags: allTags } = useLoaderData() || {};
  const {
    id,
    name,
    about,
    logo_url,
    contact_email,
    officers,
    instagram_url,
    website_url,
    twitter_url,
    tags,
    events,
  } = clubData;

  // Extracting action function's response
  const actionData = useActionData();

  // Hooks initialization
  const submit = useSubmit();

  // Use useMemo to prevent unnecessary recalculations on every render
  const originalData = useMemo(
    () => ({
      name: name || "",
      about: about || "",
      contact_email: contact_email || "",
      officers: officers || [],
      instagram_url: instagram_url || "",
      website_url: website_url || "",
      twitter_url: twitter_url || "",
      tags: tags || [],
    }),
    [clubData],
  ); // Only updates if the loader data actually changes

  // States initialization
  const [errors, setErrors] = useState({});
  const [editingField, setEditingField] = useState(null); // Stores key name of the field being editted
  const [clubName, setClubName] = useState(name || ""); // Club Name textarea field state
  const [selectedFile, setSelectedFile] = useState(null); // Selected logo file state
  const [previewUrl, setPreviewUrl] = useState(clubData.logo_url); // Logo URL state
  const [selectedTags, setSelectedTags] = useState(tags || []); // Tags array state
  const [contactEmail, setContactEmail] = useState(contact_email || ""); // Contact Email input state
  const [currentOfficers, setCurrentOfficers] = useState(officers || []); // Officers textarea array state
  const [instagramURL, setInstagramURL] = useState(instagram_url || ""); // Instagram input URL state
  const [websiteURL, setWebsiteURL] = useState(website_url || ""); // Website input URL state
  const [twitterURL, setTwitterURL] = useState(twitter_url || ""); // Twitter input URL state
  const [currentAbout, setCurrentAbout] = useState(about || ""); // About section textarea state
  const [currentEvents, setCurrentEvents] = useState(events || []); // Club events array state

  // UseEffect: Sync events' state whenever the loader data changes (For adding and removing events)
  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  // UseEffect: Sync all other fields' data whenever the loader data changes to reset the local state
  useEffect(() => {
    if (clubData) {
      // Reset all local states to the fresh data from the server
      setClubName(name || "");
      setCurrentAbout(about || "");
      setContactEmail(contact_email || "");
      setInstagramURL(instagram_url || "");
      setWebsiteURL(website_url || "");
      setTwitterURL(twitter_url || "");
      setCurrentOfficers(officers || []);
      setSelectedTags(tags || []);
      setSelectedFile(null);
      setPreviewUrl(logo_url);

      // Clear any left validation errors
      setErrors({});
    }
  }, [clubData]); // Triggers whenever the loader re-fetches data

  // The handler function for updating the club name's state
  const clubNameChangeHandler = (e) => {
    const singleLineValue = e.target.value.replace(/\n/g, ""); // Prevents the user from adding new lines
    setClubName(singleLineValue);
  };

  // The handler function for updating the club's logo file upload state
  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Overwrite with new local preview
    }
  };

  // The handler function for updating the club's tags state
  const toggleTagHandler = (tag) => {
    setSelectedTags(
      (prev) =>
        prev.includes(tag)
          ? prev.filter((t) => t !== tag) // Remove if already there
          : [...prev, tag], // Add if not
    );
  };

  // The handler function for updating the club's contact email state
  const contactEmailChangeHandler = (e) => {
    const singleLineValue = e.target.value.replace(/\n/g, ""); // Prevents the user from adding new lines
    setContactEmail(singleLineValue);
  };

  // The handler function for updating the club's officers state
  const officersChangeHandler = (e) => {
    const singleLineValue = e.target.value.replace(/\n/g, ""); // Prevents the user from adding new lines
    setCurrentOfficers(singleLineValue.split(", ").map((s) => s)); // From comma seperated to array
  };

  // The handler function for updating the club's three social media URL states
  const urlChangeHandler = (e, setState) => {
    setState(e.target.value);
  };

  // The handler function for updating the club's about section state
  const aboutChangeHandler = (e) => {
    setCurrentAbout(e.target.value);
  };

  // The handler function for deleting a club's event
  const deleteEventHandler = async (id) => {
    // Introduce a popup interface for a second click verification before deletion
    if (!window.confirm("Are you sure you want to remove this event?")) return;

    // Send a delete request to the backend using the event id marked for deletion
    const response = await api.delete(`/user/events/${id}`);

    // If the request succeeds, update the club's events state
    if (response.status >= 200 && response.status < 300) {
      setCurrentEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== id),
      );
    }
  };

  // The handler function for preventing the user from adding newlines in some textarea inputs
  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Stop the newline from being created
    }
  };

  // The hanlder function for submitting the club home's form for updating the club data
  const submitFormHandler = (event) => {
    event.preventDefault(); // Prevent default page refresh

    // Grab the formData
    const formData = new FormData(event.currentTarget);
    const newErrors = {}; // Create errors object
    setEditingField(() => null); // Reset editingField state

    // Club name validation
    if (!clubName || clubName.trim().length < 2) {
      newErrors.name =
        "Club name is required and must be at least 2 characters.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || (contactEmail && !emailRegex.test(contactEmail))) {
      newErrors.contact_email = "Please enter a valid email address.";
    }

    // Social media URLs validation (if they aren't empty becuase they are not required)
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const socials = [
      ["instagram_url", instagramURL],
      ["website_url", websiteURL],
      ["twitter_url", twitterURL],
    ];
    socials.forEach(([name, val]) => {
      if (val && !urlRegex.test(val)) {
        newErrors[name] = `Please enter a valid ${name.split("_").join(" ")}.`;
      }
    });

    // Officers Validation
    const officers = currentOfficers
      .map((s) => s.trim())
      .filter((s) => s.trim() !== "");
    if (officers.length === 0) {
      newErrors.officers = "Please list at least one officer.";
    } else {
      // Check each officer for a First and Last name (at least two words)
      const invalidOfficers = officers.filter((name) => {
        const parts = name.split(/\s+/); // Split first and last name by whitespace
        if (parts.length < 2)
          newErrors.officers = "Please input first and last name"; // Fails if only one name is provided

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

    // Tags Validation
    if (!selectedTags || selectedTags.length === 0) {
      newErrors.tags = "Please select at least one tag for your club.";
    }

    // About section validation (Character limit boundary, 10 to 500)
    const about = currentAbout.trim();
    if (about.length < 10 || about.length > 500) {
      newErrors.about = 'The "About" must be between 10 and 500 characters.';
    }

    // If any errors, set the "errors" state to display these errors, and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Append states data to formData (Because formData does not grab disabled input fields)
    // Stringify arrays because FormData only supports strings
    formData.set("name", clubName);
    formData.set("tags", JSON.stringify(selectedTags));
    formData.set("contact_email", contactEmail);
    formData.set("officers", JSON.stringify(currentOfficers));
    formData.set("instagram_url", instagramURL);
    formData.set("website_url", websiteURL);
    formData.set("twitter_url", twitterURL);
    formData.set("about", about);
    if (selectedFile) formData.set("logo_url", selectedFile);

    // If no errors, clear "errors" state and proceed to the action function
    setErrors({});
    submit(formData, {
      method: "put",
      encType: "multipart/form-data",
    });
  };

  // Create the jsx for the repeatedly used button that is used to enable/disable input fields
  const EditButton = ({ className, method }) => {
    return (
      <button
        className={`${classes.edit_button} ${className}`} // Use default style + unique added style
        type="button"
        onClick={() => method()}
      >
        <TbEdit size={35} />
      </button>
    );
  };

  // Check state changes to enable the update button
  const hasChanges =
    clubName !== originalData.name ||
    currentAbout !== originalData.about ||
    contactEmail !== originalData.contact_email ||
    instagramURL !== originalData.instagram_url ||
    websiteURL !== originalData.website_url ||
    twitterURL !== originalData.twitter_url ||
    selectedFile !== null || // If a new image was picked
    JSON.stringify(currentOfficers) !== JSON.stringify(originalData.officers) ||
    // Sort ensures that just changing the order of tags doesn't trigger the button
    JSON.stringify([...selectedTags].sort()) !==
      JSON.stringify([...originalData.tags].sort());

  // Create the jsx button that the user can press to delete the event (Will be passed to the Event component)
  const RemoveButton = ({ id }) => {
    return (
      <div className={classes.delete_div}>
        <AiOutlineMinusCircle
          size={40}
          className={classes.delete}
          onClick={() => deleteEventHandler(id)}
        />
      </div>
    );
  };

  return (
    <Fragment>
      {/* The Outlet that the AddEvent component will use to display itself on top of this one */}
      <Outlet context={{ clubId: id }} />
      <Form
        method="post"
        encType="multipart/form-data" // For file uploads
        className={classes.form}
        onSubmit={submitFormHandler}
        noValidate // Do not validate using default HTML input validation, since it is being handled manually
      >
        <div className={classes.left}>
          {/* Club Name section */}
          <div className={classes.club_name_div}>
            <textarea
              className={classes.club_name}
              name="name"
              value={clubName}
              onChange={clubNameChangeHandler}
              onKeyDown={keyDownHandler}
              placeholder="Club Name"
              maxLength={54}
              disabled={editingField !== "club_name"}
            />
            <EditButton
              className={classes.edit_club_name}
              method={() =>
                setEditingField((current) =>
                  current === "club_name" ? "" : "club_name",
                )
              }
            />
          </div>
          {errors.name && <p className="error_text">{errors.name}</p>}

          {/* LOGO section */}
          <div className={classes.image_div}>
            <input
              type="file"
              name="logo_url"
              accept="image/*"
              onChange={fileChangeHandler}
              style={{ display: "none" }}
              id="logo-upload"
              htmlFor="logo_upload"
            />
            <div className={classes.image_container}>
              <img
                src={previewUrl}
                alt="Preview"
                className={classes.logo_preview}
              />
              <EditButton
                className={classes.edit_image}
                method={() => document.getElementById("logo-upload").click()}
              />
            </div>

            {/* The main Update button */}
            <button
              type="submit"
              className={`${classes.update_btn} ${!hasChanges ? classes.btn_disabled : ""}`}
              disabled={!hasChanges}
            >
              Update
            </button>
          </div>

          {/* Tags section */}
          <div className={classes.tags_div}>
            <div className={classes.tags}>
              {editingField !== "tags"
                ? selectedTags.map((tag) => (
                    <p key={tag} className={classes.tag}>
                      {tag}
                    </p>
                  ))
                : allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <div
                        key={tag}
                        className={`${classes.tag_pill} ${isSelected ? classes.tag_pill_active : ""}`}
                        onClick={() => toggleTagHandler(tag)}
                      >
                        <input
                          type="hidden"
                          name="tags"
                          value={tag}
                          key={tag}
                        />
                        {tag}
                      </div>
                    );
                  })}
              {!selectedTags.length && <p>***No Tags***</p>}
            </div>
            <EditButton
              className={classes.edit_tags}
              method={() =>
                setEditingField((current) => (current === "tags" ? "" : "tags"))
              }
            />
          </div>
          {errors.tags && <p className="error_text">{errors.tags}</p>}

          {/* Contact email section */}
          <div className={classes.contact_email_div}>
            <label htmlFor="contact_email">CONTACT:</label>
            <input
              type="text"
              name="contact_email"
              id="contact_Email"
              style={{
                width: `${Math.max(contactEmail.length + 2, 10)}ch`,
              }}
              className={classes.contact_email}
              value={contactEmail}
              onChange={contactEmailChangeHandler}
              onKeyDown={(e) => {
                // Prevent the enter button from submitting the form
                e.key === "Enter" && e.preventDefault();
              }}
              placeholder="Contact email"
              disabled={editingField !== "contact_email"}
              maxLength={60}
            />
            <EditButton
              className={classes.edit_contact_email}
              method={() =>
                setEditingField((current) =>
                  current === "contact_email" ? "" : "contact_email",
                )
              }
            />
          </div>
          {errors.contact_email && (
            <p className="error_text">{errors.contact_email}</p>
          )}

          {/* Officeres section */}
          <div className={classes.officers_div}>
            <label htmlFor="officers">OFFICERS:</label>
            <textarea
              name="officers"
              id="officers"
              style={{
                width: `${Math.min(Math.max(currentOfficers.join(", ").length + 2, 10), 50)}ch`,
                height: `${Math.floor((currentOfficers.join(", ").length + 126) / 63) * 1.3}rem`,
              }}
              className={classes.officers}
              value={currentOfficers.join(", ")}
              onChange={officersChangeHandler}
              placeholder="Officers"
              disabled={editingField !== "officers"}
            />

            <EditButton
              className={classes.edit_officers}
              method={() =>
                setEditingField((current) =>
                  current === "officers" ? "" : "officers",
                )
              }
            />
          </div>
          {errors.officers && <p className="error_text">{errors.officers}</p>}

          {/* Social media section */}
          <div className={classes.social_media}>
            {editingField !== "social_media" ? (
              <div className={classes.social_media_view}>
                <Link to={instagram_url} target="_blank">
                  <FaInstagram size={40} className={classes.social} />
                </Link>
                <Link to={website_url} target="_blank">
                  <LuGlobe size={40} className={classes.web} />
                </Link>
                <Link to={twitter_url} target="_blank">
                  <FaTwitter size={40} className={classes.social} />
                </Link>
              </div>
            ) : (
              <div className={classes.social_media_edit}>
                <div>
                  <label htmlFor="instagram_url">Instagram URL:</label>
                  <label htmlFor="website_url">Website URL:</label>
                  <label htmlFor="twitter_url">Twitter URL:</label>
                </div>
                <div>
                  <input
                    type="url"
                    name="instagram_url"
                    id="instagram_url"
                    value={instagramURL}
                    onChange={(e) => urlChangeHandler(e, setInstagramURL)}
                    placeholder="https://instagram.com/yourclub"
                  />
                  <input
                    type="url"
                    name="website_url"
                    id="website_url"
                    value={websiteURL}
                    onChange={(e) => urlChangeHandler(e, setWebsiteURL)}
                    placeholder="https://yourclub.com"
                  />
                  <input
                    type="url"
                    name="twitter_url"
                    id="twitter_url"
                    value={twitterURL}
                    onChange={(e) => urlChangeHandler(e, setTwitterURL)}
                    placeholder="https://twitter.com/yourclub"
                  />
                </div>
              </div>
            )}
            {errors.instagram_url && (
              <p className="error_text">{errors.instagram_url}</p>
            )}
            {errors.website_url && (
              <p className="error_text">{errors.website_url}</p>
            )}
            {errors.twitter_url && (
              <p className="error_text">{errors.twitter_url}</p>
            )}
            <EditButton
              className={classes.edit_urls}
              method={() =>
                setEditingField((current) =>
                  current === "social_media" ? "" : "social_media",
                )
              }
            />
          </div>
        </div>

        <div className={classes.right}>
          {/* About section */}
          <div className={classes.about_div}>
            <p className={classes.about_title}>ABOUT</p>
            <div className={classes.about}>
              <textarea
                name="about"
                id="about"
                style={{
                  height: `${Math.floor((currentAbout.length + 360) / 90) * 1.5}rem`,
                }}
                className={classes.about}
                value={currentAbout}
                onChange={aboutChangeHandler}
                placeholder="About..."
                disabled={editingField !== "about"}
              />
              {errors.about && <p className="error_text">{errors.about}</p>}
              <EditButton
                className={classes.edit_about}
                method={() =>
                  setEditingField((current) =>
                    current === "about" ? "" : "about",
                  )
                }
              />
            </div>
          </div>

          {/* Events section */}
          <div className={classes.events_div}>
            <p className={classes.events_title}>EVENTS</p>
            {currentEvents.map(
              ({ id, title, description, start_time, end_time }) => (
                <Event
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  start_time={start_time}
                  end_time={end_time}
                  /* Pass the RemoveButton jsx component to the event component to use */
                  Button={() => <RemoveButton id={id} />}
                  style={classes.event} // Pass class to control the event's main div CSS styles
                />
              ),
            )}

            {/* Add event button */}
            <Link to="add-event" className={classes.add_event}>
              <AiOutlinePlus size={35} />
            </Link>
          </div>
        </div>
        {actionData?.backendError && (
          <p className={classes.error_block}>{actionData.backendError}</p>
        )}
      </Form>
    </Fragment>
  );
};

export default ClubHome;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  try {
    const userData = await api.verifyToken(); // Check if user is logged in using backend
    const { authenticated, userType, clubId } = userData; // Extract backend response data

    // If the user in not authenticated, redirect to club login/signup page
    if (!authenticated) {
      return redirect("/account/club");
    }

    // If a student is trying to access ClubHome, redirect to home page
    if (userType !== "club") {
      return redirect("/");
    }

    // Get the club date from the backend
    const response = await publicApi.get(`/${clubId}`);
    const clubData = await response.data; // Collect response from backend

    // Get the club's tags data from the backend
    const tagsReq = await publicApi.get("/tags");
    const { tags } = await tagsReq.data; // Collect response from backend

    return { clubData, tags }; // Return data for the loader to use
  } catch (error) {
    return error;
  }
};

// THE ACTION METHOD THAT RUNS ON PAGE EXIT OR FORM SUBMISSION
export const action = async ({ request, params }) => {
  // Grab and extract form data
  const formData = await request.formData();

  try {
    // Send an update (put) request to the backend to update the club data, and collect the response
    const response = await api.put(`/user/club`, formData);

    // If the request fails, return an error
    if (response.data.error) {
      return { backendError: response.data.error };
    }

    // Returning null or a success message will trigger revalidation of the ClubHome loader, refreshing
    //    the UI with the new data.
    return { success: true };
  } catch (error) {
    return {
      backendError:
        error.response?.data?.error || "Failed to update club profile.",
    };
  }
};
