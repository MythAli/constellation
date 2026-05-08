# Unit Tests for UTD - Club Management System

This folder is for running unit tests on the frontend app "Constellation", and the backend express app (with the database).

## FRONTEND

### Jest Test Suite Documentation

This document outlines the unit testing strategy for the student and club management platform's React component library, focusing on rendering correctness, prop handling, routing integration, and form behavior.

### Prerequisites

To run this project locally, you must have the following installed:

1. **Node.js** (v16 or higher)

### Node Setup (If you already have Node.js installed, skip this step)

Follow these steps to install Node.js:
a. Go to the Node.js website [nodejs.org](https://nodejs.org/en/download).
b. Keep the LTS version selected.
c. Depending on your operating system, press on the installer link below to download.
d. Open the installation file and keep everything default.
e. Open your terminal (Command Prompt on Windows).
f. Run "node -v", you should see v##.##.# depending on your version.
g. Run "npm -v", you should see v##.##.# depending on your version.

### RUNNING THE TESTS:

#### The main method for running these tests is using the given executable file depending on your operating system:

##### WINDOWS:

1. Go to the "frontend" folder inside the "unitTests" folder and run the file `start` or `start.bat` to start the tests, the results will be shown in the termial.

##### MAC/LINUX:

2. Go to the "frontend" folder inside the "unitTests" folder and run the file `start.command` to start the tests, the results will be shown in the termial.

##### RESULTS:

- All test results will be displayed directly in the terminal.
- A summary of passed/failed suites and individual tests is shown at the end.

#### ALTERNATIVELY: If these files do not work, it can be done the manual way:

1. Open a new terminal.
2. Navigate to the "frontend" folder inside the "unitTests" folder in your terminal using the `cd` command.
3. Run `npm install`. You might see some warnings, but it should not be a problem as long as the installation finishes.
4. Run `npm test`.
5. All test results will be displayed directly in the terminal.
6. A summary of passed/failed suites and individual tests is shown at the end.

### The Tests:

#### 1. GlobalLoader (`GlobalLoader.test.jsx`)

**Purpose:**  
Verifies that the global loading spinner renders correctly when triggered during API requests.

- **Overlay Rendering:** Confirms that the overlay wrapper element is present in the DOM when the component is mounted.

---

#### 2. PublicHeader (`PublicHeader.test.jsx`)

**Purpose:**  
Validates the navigation header shown to unauthenticated users on all public-facing pages.

- **Login Link:** Confirms the "Login / Sign Up" anchor element is rendered and points to `/account`.
- **Home Link:** Verifies the icon-only home link is present and resolves to `/`.

---

#### 3. Calendar (`Calendar.test.jsx`)

**Purpose:**  
Tests the date range calendar widget used on the Student Home page for schedule and event filtering.

- **Structural Rendering:** Confirms the calendar card container mounts correctly.
- **Month and Year Display:** Verifies that the current month abbreviation and year are shown in the header based on the provided `range` prop.
- **Weekday Headers:** Ensures all 7 weekday labels (Su–Sa) are rendered in the grid.
- **Grid Size:** Confirms that exactly 42 day cells are always rendered, keeping the calendar a consistent 6-week height regardless of the month.
- **Navigation Buttons:** Verifies that both the previous and next month buttons are present.

---

#### 4. Club (`Club.test.jsx`)

**Purpose:**  
Validates the individual club card component used across the Clubs list and discovery pages.

- **Club Name & Description:** Confirms that the club's name and about text are rendered correctly from props.
- **Logo Image:** Verifies the club logo `<img>` element is present with the correct `src` and `alt` attributes.
- **Navigation Link:** Confirms the card links to the correct dynamic route (`/clubs/:id`) based on the `id` prop.

---

#### 5. Clubs (`Clubs.test.jsx`)

**Purpose:**  
Tests the paginated club grid component that wraps and displays a list of Club cards.

- **List Rendering:** Verifies that all provided clubs are rendered when the count is within the 15-item page limit.
- **Initial Cap:** Confirms that only the first 15 clubs are shown when more than 15 are provided.
- **Show More Button:** Verifies the "Show more" button appears only when the total club count exceeds the current display limit.
- **Show Less Button:** Confirms the "Show less" button is hidden on initial render before any pagination has occurred.

---

#### 6. Event (`Event.test.jsx`)

**Purpose:**  
Validates the reusable event card component used across the Student dashboard and club event management pages.

- **Title & Description:** Confirms the event title and activity description are rendered from props.
- **Date Label:** Verifies the "Time & Date:" label is present to indicate formatted time output.
- **Custom Button Slot:** Confirms that a custom `Button` component passed as a prop is rendered inside the card.
- **Default Button Fallback:** Verifies the component renders without errors when no `Button` prop is provided.

---

#### 7. Modal (`Modal.test.jsx`)

**Purpose:**  
Tests the Modal wrapper component used to overlay content with a dimmed background across multiple pages.

- **Children Rendering:** Confirms that content passed as `children` is rendered inside the modal.
- **Backdrop Element:** Verifies the backdrop div is present in the DOM for the overlay effect.
- **Dialog Element:** Confirms an accessible `<dialog>` element is rendered and open.

---

#### 8. StudentSignUpForm (`StudentSignUpForm.test.jsx`)

**Purpose:**  
Validates the student registration form used on the Account page, including all input fields, action controls, and backend error display.

- **Title Rendering:** Confirms the "Sign Up" heading paragraph is present.
- **Input Fields:** Verifies all four input fields (First Name, Last Name, Email, Password) are rendered and correctly labeled.
- **Submit Button:** Confirms the "Sign Up" submit button is present and accessible.
- **Cancel Link:** Verifies the Cancel navigation link is rendered.
- **Backend Error Display:** Confirms that a backend error message passed via `actionData` is rendered in the form when registration fails.

---

#### 9. UserHeader (`UserHeader.test.jsx`)

**Purpose:**  
Tests the authenticated user header displayed on all private pages, covering both student and club admin user types.

- **Student Name:** Confirms the logged-in student's name is rendered.
- **Club Admin Label:** Verifies the "(Club Admin)" superscript is shown for club users and hidden for students.
- **Logout Button:** Confirms the "Log out" button is present for both user types.
- **Home Link:** Verifies the icon-only home link resolves to `/`.
- **Role-Based Redirect:** Confirms the profile icon link points to `/student-home` for students and `/club-home` for club admins.

---

## BACKEND

### Jest Test Suite Documentation

This document outlines the unit testing strategy for the backend Express application's validation logic, focusing on input correctness, boundary conditions, and crash-safe behavior when no data is provided.

### Prerequisites

To run this project locally, you must have the following installed:

1. **Node.js** (v16 or higher)

### Node Setup (If you already have Node.js installed, skip this step)

Follow these steps to install Node.js:
a. Go to the Node.js website [nodejs.org](https://nodejs.org/en/download).
b. Keep the LTS version selected.
c. Depending on your operating system, press on the installer link below to download.
d. Open the installation file and keep everything default.
e. Open your terminal (Command Prompt on Windows).
f. Run "node -v", you should see v##.##.# depending on your version.
g. Run "npm -v", you should see v##.##.# depending on your version.

### RUNNING THE TESTS:

#### The main method for running these tests is using the given executable file depending on your operating system:

##### WINDOWS:

1. Go to the "backend" folder inside the "unitTests" folder and run the file `start` or `start.bat` to start the tests, the results will be shown in the termial.

##### MAC/LINUX:

2. Go to the "backend" folder inside the "unitTests" folder and run the file `start.command` to start the tests, the results will be shown in the termial.

##### RESULTS:

- All test results will be displayed directly in the terminal.
- A summary of passed/failed suites and individual tests is shown at the end.

#### ALTERNATIVELY: If these files do not work, it can be done the manual way:

1. Open a new terminal.
2. Navigate to the "backend" folder inside the "unitTests" folder in your terminal using the `cd` command.
3. Run `npm install`. You might see some warnings, but it should not be a problem as long as the installation finishes.
4. Run `npm test`.
5. All test results will be displayed directly in the terminal.
6. A summary of passed/failed suites and individual tests is shown at the end.

### The Tests:

#### 1. validateRequestData (`login.test.js`)

**Purpose:**  
Tests the login request validation logic that checks email format and password length before any database query is made.

- **Valid Input:** Confirms no errors are returned for a properly formatted email and a password of sufficient length.
- **Email Validation:** Verifies errors are returned for a missing email, an email without an `@` symbol, and an email missing a domain.
- **Password Validation:** Verifies errors are returned for a missing password and a password shorter than 8 characters, and confirms no error is returned for a password of exactly 8 characters.
- **Multiple Errors:** Confirms that both errors are returned simultaneously when both fields are invalid.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.

---

#### 2. validateScheduleData (`changeSchedule.test.js`)

**Purpose:**  
Tests the schedule update validation logic that checks the presence, format, and chronological ordering of the student's calendar date range.

- **Valid Input:** Confirms no errors are returned for a valid start and end date pair.
- **Presence Validation:** Verifies individual errors are returned for a missing start date and a missing end date, and confirms two errors are returned when both are missing.
- **Format Validation:** Verifies errors are returned when either date is not a valid date string.
- **Chronological Validation:** Confirms errors are returned when the end date is before the start date or equal to it.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.

---

#### 3. validateRequestDates (`matchEvents.test.js`)

**Purpose:**  
Tests the event-matching date range validation logic that ensures a student's schedule window is present, parseable, and chronologically valid before querying for matching events.

- **Valid Input:** Confirms no errors are returned for a valid start and end date pair.
- **Presence Validation:** Verifies individual errors are returned for a missing start date and a missing end date, and confirms two errors are returned when both are missing.
- **Format Validation:** Verifies errors are returned when either date is not a valid date string.
- **Chronological Validation:** Confirms errors are returned when the end date is before the start date or equal to it.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.

---

#### 4. validateEventData (`addEvent.test.js`)

**Purpose:**  
Tests the event creation validation logic covering the event title, time window, and description fields.

- **Valid Input:** Confirms no errors are returned for a complete and valid event payload.
- **Title Validation:** Verifies errors are returned for a missing or too-short title, and confirms no error for a title of exactly 3 characters.
- **Time Presence Validation:** Verifies errors are returned when either the start or end time is missing.
- **Format Validation:** Verifies errors are returned when either time field is not a valid date string.
- **Chronological Validation:** Confirms errors are returned when the start time is in the past, when the end time is before the start time, and when they are equal.
- **Description Validation:** Verifies errors are returned for a missing, too-short, or too-long description, and confirms no errors at the exact boundary values of 20 and 1000 characters.
- **Multiple Errors:** Confirms that multiple errors are returned simultaneously for a completely empty input.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.

---

#### 5. validateStudentData (`register.test.js`)

**Purpose:**  
Tests the student registration validation logic covering name, email, and password fields.

- **Valid Input:** Confirms no errors are returned for a complete and valid student registration payload.
- **First Name Validation:** Verifies errors are returned for a missing or too-short first name, and confirms no error for a name of exactly 2 characters.
- **Last Name Validation:** Verifies errors are returned for a missing or too-short last name.
- **Email Validation:** Verifies errors are returned for a missing email and an improperly formatted email.
- **Password Validation:** Verifies errors are returned for a missing or too-short password, and confirms no error for a password of exactly 8 characters.
- **Multiple Errors:** Confirms that multiple errors are returned simultaneously for a completely empty input.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.

---

#### 6. validateClubData — register (`register.test.js`)

**Purpose:**  
Tests the club registration validation logic covering the logo upload, emails, password, club name, about section, social URLs, officers list, and tags.

- **Valid Input:** Confirms no errors are returned for a complete and valid club registration payload.
- **File Validation:** Verifies an error is returned when no logo file is uploaded.
- **Email Validation:** Verifies errors are returned for an invalid login email and an invalid contact email.
- **Password Validation:** Verifies an error is returned for a password shorter than 8 characters.
- **Club Name Validation:** Verifies errors are returned for a missing or too-short club name.
- **About Validation:** Verifies errors are returned outside the 10–500 character boundary, and confirms no errors at the exact boundary values.
- **Social URL Validation:** Verifies an error is returned for an invalid URL, and confirms no errors when all social fields are empty since they are optional.
- **Officers Validation:** Verifies errors are returned for no officers, an officer with only one name, an officer with more than two names, and an officer name part shorter than 2 characters.
- **Tags Validation:** Verifies an error is returned when no tags are selected.
- **Multiple Errors:** Confirms that multiple errors are returned simultaneously for a completely empty input.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.

---

#### 7. validateClubData — editClub (`editClub.test.js`)

**Purpose:**  
Tests the club profile update validation logic, which shares similar rules to registration but excludes the file and password fields since those are handled separately during an edit.

- **Valid Input:** Confirms no errors are returned for a complete and valid club update payload.
- **Club Name Validation:** Verifies errors are returned for a missing or too-short club name, and confirms no error for a name of exactly 2 characters.
- **Contact Email Validation:** Verifies errors are returned for a missing or improperly formatted contact email.
- **Social URL Validation:** Verifies errors are returned for invalid Instagram, website, and Twitter URLs individually, and confirms no errors when all social fields are empty since they are optional.
- **Officers Validation:** Verifies errors are returned for no officers, an officer with only one name, and an officer name part shorter than 2 characters, and confirms no error for a valid officers list.
- **Tags Validation:** Verifies an error is returned when no tags are selected, and confirms no error when at least one tag is provided.
- **About Validation:** Verifies errors are returned outside the 10–500 character boundary, and confirms no errors at the exact boundary values.
- **Multiple Errors:** Confirms that multiple errors are returned simultaneously for a completely empty input.
- **Crash Safety:** Verifies the function does not throw when called with an empty object.
