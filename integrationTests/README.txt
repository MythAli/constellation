# Integration Tests for UTD - Club Management System

This folder is for running integration tests on the frontend app "Constellation", and the backend express app (with the database).

## FRONTEND

### Cypress Test Suite Documentation

This document outlines the end-to-end testing strategy for the student and club management platform, focusing on registration, authentication, session handling, UI resilience, and security.

### Prerequisites

To run this project locally, you must have the following installed:

1. **Node.js** (v16 or higher)

- In addition, you must ensure both the **Node.js backend server** and **React development server** are running.

### Node Setup (If you already have Node.js installed, skip this step)

Follow these steps to install Node.js
a. Go to the node.js website [nodejs.org] (https://nodejs.org/en/download).
b. Keep the LTS version selected.
c. Depending on your opearting system, press on the installer link below to download.
d. Open the installation file and keep eveything default.
e. Open your terminal (Command Prompt on Windows).
f. Run "node -v", you should see v##.##.# depending on your version.
g. Run "npm -v", you should see v##.##.# depending on your version.

### Running the Tests

#### Installation

```bash
cd frontend # Into this folder
npm install # To install necessary modules
```

#### Open Cypress

```bash
cd frontend # Into this folder
npm run cypress:open # To start cypress
```

- Now select E2E testing, and choose your prferred browser.
- In the left pannel select "Specs".
- Now you see the tests, select any one of them to run the testing.

### The tests:

#### 1. Student Registration (`student_signup.cy.js`)

**Purpose:**  
Verifies that new students can create accounts and that the system correctly rejects invalid data.

- **Boundary Testing:** Checks that short passwords and improperly formatted emails are blocked.
- **Success Path:** Completes a full registration flow and verifies that the student is redirected to the home page.
- **Cleanup Logic:** Uses a custom DELETE request to the backend to remove test accounts before and after the suite runs, ensuring a clean state for every test.

---

#### 2. Club Registration (`club_signup.cy.js`)

**Purpose:**  
Validates the multi-field registration form specifically for Club Officers.

- **Input Partitioning:** Tests the complex logic of the "Officers" field (ensuring first and last names are present).
- **Character Limits:** Enforces minimum and maximum length rules for club descriptions.
- **Conflict Handling:** Confirms the backend correctly returns a `409 Conflict` status if someone tries to register a club with an email that is already in use.

---

#### 3. Login Flows (`login_flows.cy.js`)

**Purpose:**  
Tests the "Happy Path" login experience for both Students and Club Officers.

- **Role Identification:** Ensures the system correctly distinguishes between a student login and a club login.
- **JWT Verification:** Verifies that an `accessToken` is successfully stored in the browser's `localStorage` upon a successful login.
- **Failure States:** Checks that incorrect credentials trigger the appropriate error messages without granting access.

---

#### 4. UI & Submission Throttling (`handle_submit.cy.js`)

**Purpose:**  
Tests the "Optimistic UI" and UX elements during network requests.

- **Loading States:** Verifies that the login button is disabled and changes text to "Logging in..." immediately after being clicked.
- **Throttling:** Confirms that users cannot double-click or spam the submit button while a request is pending.
- **Transition Timing:** Ensures the application waits for the backend response before triggering the page redirect.

---

#### 5. Session Persistence (`persistence_testing.cy.js`)

**Purpose:**  
Ensures that user sessions survive browser refreshes but are properly destroyed upon logging out.

- **Reload Testing:** Logs a user in, refreshes the page (`cy.reload()`), and confirms they are still authenticated.
- **Logout Lifecycle:** Clicks the logout button and verifies that the `accessToken` is deleted from `localStorage`.
- **Unauthorized Access:** Confirms that after logging out, a user is blocked from re-entering private dashboard routes.

---

#### 6. Route Guards & Security (`security_checks.cy.js`)

**Purpose:**  
Tests the "Fortress" logic of the application to prevent unauthorized navigation.

- **Authentication Guards:** Ensures unauthenticated users are automatically kicked back to the login page if they try to visit `/student-home`.
- **Role-Based Access Control (RBAC):** Verifies that a logged-in Student cannot sneak into the `/club-home` dashboard.
- **Redundant Navigation:** Confirms that users who are already logged in are prevented from seeing the login/signup forms again.

---

#### 7. Club Profile Management (`club_update.cy.js`)

**Purpose:**  
Ensures that Club Officers can successfully update their organization's public identity and that the UI enforces strict validation rules for critical data.

- **Field Validation:** Verifies that mandatory fields, such as the club name, cannot be cleared and that the system provides immediate error feedback if a requirement is not met.
- **Media Handling:** Validates the logo upload functionality by simulating a file selection and ensuring the system processes image buffers correctly.
- **Dynamic Updates:** Confirms that updates to contact emails and "About" sections are saved, and that the UI correctly disables the submission trigger once the data is successfully synchronized with the backend.

---

#### 8. Club Event Management (`event_management.cy.js`)

**Purpose:**
Validates the full lifecycle of event administration, from creating new gatherings to removing past or cancelled listings.

- **Modal Form Interaction:** Tests the navigation to the "Add Event" route and ensures that time-sensitive data (start and end times) are correctly formatted and accepted by the system.
- **Sequential Verification:** Uses a "Count-and-Compare" approach to ensure the internal dashboard list grows by exactly one when a new event is added and shrinks when one is removed.
- **Dialog Handling:** Specifically tests the application's ability to handle browser confirm dialogs during the deletion process, ensuring that the destructive action is only completed after a confirmed intent.

---

## 9. Student Dashboard & Core Flows (`basic_student_functions.cy.js`)

**Purpose:**  
Validates the primary user experience for a logged-in student, ensuring that dashboard data and interactive elements function correctly.

- **Dashboard Integrity:** Verifies that core sections like "FAVORITE CLUBS" and "UPCOMING EVENTS" render correctly using seeded data.
- **State Feedback:** Tests the calendar "UPLOAD SCHEDULE" interaction, confirming the UI provides immediate status feedback (e.g., "Successful!" or "Uploading...").
- **Live Interaction:** Validates that clicking a heart icon on the dashboard triggers a real-time re-render that removes the event from the "Upcoming" list without requiring a manual page refresh.

---

## 10. Home Search & Discovery (`home_search.cy.js`)

**Purpose:**  
Validates the global discovery logic and the sorting algorithms that help students find organizations.

- **Query Syncing:** Confirms that typing into the search bar correctly updates the URL parameters and triggers the filtering of the club grid.
- **Priority Sorting:** Validates the custom `.sort()` logic in the frontend, ensuring that clubs whose names start with the search term are prioritized at the top of the results.
- **Dynamic Grid Rendering:** Uses specific attribute selectors to handle hashed CSS Module classes, ensuring the test remains stable even when the frontend build changes.

---

## 11. Cross-Page Sync & Persistence (`sync_validation.cy.js`)

**Purpose:**  
Tests the deep integration between different routes to ensure the database remains the single source of truth.

- **Data Sync Cycle:** Implements a "Count-Action-Verify" pattern—counting items on a collection page, performing a toggle on a detail page, and returning to verify the count has updated.
- **Action Differentiation:** Explicitly separates the logic for "Following" a club versus "Hearting" an event, confirming that both distinct backend endpoints trigger the correct UI reflections.
- **Loader Validation:** Proves that React Router loaders are successfully fetching fresh data from the PostgreSQL backend upon every navigation, preventing "stale data" bugs.

---

## BACKEND

### Postman Integration Test Suite Documentation

This document outlines the integration testing strategy for the backend Express API, covering all public and private routes. Tests verify correct behavior for valid requests, missing or invalid data, missing authentication tokens, and role-based access control.

### Prerequisites

To run these tests locally you must have the following installed and running:

1. **Node.js** (v16 or higher) with the backend server running locally.
2. **Postman** — download and install from [postman.com/downloads](https://www.postman.com/downloads/).

### Node Setup (If you already have Node.js installed, skip this step)

Follow these steps to install Node.js
a. Go to the node.js website [nodejs.org] (https://nodejs.org/en/download).
b. Keep the LTS version selected.
c. Depending on your opearting system, press on the installer link below to download.
d. Open the installation file and keep eveything default.
e. Open your terminal (Command Prompt on Windows).
f. Run "node -v", you should see v##.##.# depending on your version.
g. Run "npm -v", you should see v##.##.# depending on your version.

### Postman Setup (If you already have Postman installed, skip this step)

Follow these steps to install Postman:
a. Go to [postman.com/downloads](https://www.postman.com/downloads/).
b. Select your operating system and download the installer.
c. Open the installer and follow the default installation steps.
d. Launch Postman and create a free account or skip sign-in.

### Running the Tests

#### Step 1 — Start the backend server

```bash
cd backend # Into the backend folder
npm start # Start the backend server
```

Make sure the server is running at `http://127.0.0.1:8080` before proceeding.

#### Step 2 — Import the collection and environment into Postman

1. Open Postman.
2. Click **Import** in the top-left corner.
3. Drag and drop both files into the import window, or click **Upload Files** and select them:
   - `Constellation_postman_collection.json`
   - `Constellation_environment.json`
4. Click **Import** to confirm.

#### Step 3 — Select the environment

In the top-right corner of Postman, open the environment dropdown and select **Constellation Environment**. This activates the environment variables (`{{baseUrl}}`, `{{studentToken}}`, `{{clubToken}}`, etc.) that the requests depend on.

#### Step 4 — Run the collection

1. In the left sidebar, click the **Collections** tab and find the **Constellation** collection.
2. Click the **...** (three dots) next to it and select **Run collection**.
3. In the run configuration screen:
   - Make sure **Constellation Environment** is selected under Environment.
   - Set **Iterations** to `1`.
   - **Uncheck "Stop run if an error occurs"** — this is important because some requests are intentionally expected to fail (e.g. No Token, Invalid Data), and leaving this checked will halt the run prematurely.
   - Leave all other settings at their defaults.
4. Click **Start run**.

All 49 requests (114 tests) will fire in order and results will be shown automatically with pass/fail indicators for every test.

#### Important notes (The below steps should be there by default, but if the tests fail verify these steps before rerunning)

- The **Login — Valid (Student)** and **Login — Valid (Club)** requests must run first since they save the `studentToken` and `clubToken` environment variables that all subsequent private route requests depend on. They are already positioned at the top of the run order.
- The **Add Event — Valid** request must run before **Toggle Event — Valid** and **Delete Event — Valid**, as it creates the test event and saves its ID to `{{testEventId}}`. The run order is already configured correctly.
- The **Register — Valid (Student)** request uses a timestamp-based email (`testuser_{{$timestamp}}@utdallas.edu`) to ensure a unique account is created on every run without conflicts.

---

### The Tests:

#### 1. Auth — Login

**Purpose:**  
Verifies the login endpoint for both student and club users, covering successful authentication, input validation, and credential rejection.

- **Valid (Student):** Confirms a 200 response with `accessToken`, `refreshToken`, and `userType` returned. Automatically saves the student token to the environment for use in subsequent requests.
- **Valid (Club):** Confirms a 200 response with `accessToken` returned. Automatically saves the club token to the environment.
- **No Data:** Sends an empty body and confirms a 400 response with a `messages` array describing the missing fields.
- **Invalid Data:** Sends a malformed email and a short password and confirms a 400 response with a `messages` array.

---

#### 2. Auth — Register

**Purpose:**  
Validates the student registration endpoint, covering the success path, input validation, and duplicate email conflict handling.

- **Valid (Student):** Confirms a 201 response with `accessToken` and the success message. Uses a timestamp-based email to avoid duplicate conflicts across runs.
- **No Data:** Sends an empty body and confirms a 400 or 403 response with an `error` field.
- **Invalid Data:** Sends too-short names, a malformed email, and a short password and confirms a 400 response with a `messages` array.
- **Duplicate Email:** Attempts to register with an already-registered email and confirms a 409 Conflict response.

---

#### 3. Auth — Refresh

**Purpose:**  
Tests the token refresh endpoint that allows users to obtain a new access token using their refresh token.

- **Valid:** Sends the saved `studentRefreshToken` and confirms a 200 response with a new `accessToken` and `userType`. Automatically updates the saved student token in the environment.
- **No Data:** Sends an empty body and confirms a 400 response with an `error` field.
- **Invalid Token:** Sends a malformed token string and confirms a 403 response with an `error` field.

---

#### 4. Verify

**Purpose:**  
Tests the token verification endpoint used to confirm a user's identity and authentication status on every page load.

- **Valid (Student):** Confirms a 200 response with `authenticated: true`, `name`, and `userType`.
- **Valid (Club):** Confirms a 200 response with `authenticated: true` and `clubId`.
- **No Token:** Sends the request without an Authorization header and confirms a 403 response.
- **Invalid Token:** Sends a malformed token and confirms a 400 or 403 response.

---

#### 5. Profile

**Purpose:**  
Tests the student profile endpoint that returns a logged-in student's personal data, favorite clubs, and attending events.

- **Valid:** Confirms a 200 response with `first_name`, a `favorites` array, and an `attending` array.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Club Token):** Sends a club token on a student-only route and confirms a 403 response, verifying role-based access control.

---

#### 6. Change Schedule

**Purpose:**  
Tests the schedule update endpoint that saves a student's calendar date range to the database.

- **Valid:** Confirms a 200 response with the success message.
- **No Data:** Sends an empty body and confirms a 400 response with a `messages` array.
- **Invalid Data:** Sends non-date strings for both fields and confirms a 400 response with a `messages` array.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Club Token):** Confirms a 403 response when a club token is used on a student-only route.

---

#### 7. Match Events

**Purpose:**  
Tests the event-matching endpoint that returns events from a student's favorite clubs that fall within their saved schedule window.

- **Valid:** Confirms a 200 response with an `events` array.
- **No Data:** Sends an empty body and confirms a 400 response with a `messages` array.
- **Invalid Data:** Sends non-date strings and confirms a 400 response with a `messages` array.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Club Token):** Confirms a 403 response when a club token is used on a student-only route.

---

#### 8. Toggle Favorite Club

**Purpose:**  
Tests the toggle endpoint that adds or removes a club from a student's favorites list.

- **Valid:** Confirms a 200 or 201 response with a `status` field set to either `added` or `removed`, correctly handling both states of the toggle.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Club Token):** Confirms a 403 response when a club token is used on a student-only route.
- **Invalid ID:** Sends a non-numeric club ID and confirms a 400 or 404 response.

---

#### 9. Toggle Event Attendance

**Purpose:**  
Tests the toggle endpoint that marks or unmarks a student as attending an event, using the event ID created in the Add Event test.

- **Valid:** Confirms a 200 or 201 response with a `status` field set to either `added` or `removed`.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Club Token):** Confirms a 403 response when a club token is used on a student-only route.
- **Invalid ID:** Sends a non-numeric event ID and confirms a 400 or 404 response.

---

#### 10. Add Event

**Purpose:**  
Tests the event creation endpoint for club users, covering the success path, validation, and access control. The created event's ID is automatically saved to `{{testEventId}}` for use in the Toggle Event and Delete Event tests.

- **Valid:** Confirms a 201 response with the success message and the new event's `id`.
- **No Data:** Sends an empty body and confirms a 400 or 403 response.
- **Invalid Data:** Sends a too-short title, invalid dates, and a too-short description and confirms a 400 response with a `messages` array.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Student Token):** Confirms a 403 response when a student token is used on a club-only route.

---

#### 11. Delete Event

**Purpose:**  
Tests the event deletion endpoint for club users, using the event ID created in the Add Event test to ensure the test is self-contained across runs.

- **Valid:** Confirms a 200 response with the success message.
- **No Token:** Confirms a 403 response when the Authorization header is missing.
- **Wrong Role (Student Token):** Confirms a 403 response when a student token is used on a club-only route.
- **Not Owner:** Attempts to delete an event that the authenticated club does not own and confirms a 403 response.

---

#### 12. Fetch Clubs (Public)

**Purpose:**  
Tests the public endpoint that returns a list of all clubs. No authentication is required.

- **Valid:** Confirms a 200 response with a non-empty `clubs` array.

---

#### 13. Fetch Club (Public)

**Purpose:**  
Tests the public endpoint that returns all data for a single club including its events. No authentication is required.

- **Valid:** Confirms a 200 response with a `name` field and an `events` array.
- **Not Found:** Requests a club ID that does not exist and confirms a 404 response with an `error` field.

---

#### 14. Fetch Tags (Public)

**Purpose:**  
Tests the public endpoint that returns the full list of available club tags used for filtering and registration. No authentication is required.

- **Valid:** Confirms a 200 response with a non-empty `tags` array.
