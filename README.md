# UTD - Club Management System

This project is a full-stack web application designed for the UTD community. It allows students to discover clubs and events while providing club admins with the necessary tools to create and manage their club organizations.

## Prerequisites

To run this project locally, you must have the following installed:

1. **Node.js** (v16 or higher)

## Node Setup (If you already have Node.js installed, skip this step)

Follow these steps to install Node.js
1. Go to the node.js website [nodejs.org] (https://nodejs.org/en/download).
2. Keep the LTS version selected.
3. Depending on your opearting system, press on the installer link below to download.
4. Open the installation file and keep eveything default.
5. Open your terminal (Command Prompt on Windows).
6. Run `node -v`, you should see v##.##.# depending on your version.
7. Run `npm -v`, you should see v##.##.# depending on your version.

## RUNNING APPLICATION:

### The main method for running this application is using the two executable files depending on your operating system:

#### WINDOWS:

1. Run the file `install` or `install.bat` to install all the application dependencies.
2. Run the file `start` or `start.bat` to start the application (Runs backend -> then frotend).
3. Keep these terminals open to keep the the application running.

#### MAC/LINUX:

1. Run the file `install.command` to install all the application dependencies.
2. Run the file `start.command` to start the application (Runs backend -> then frotend).
3. Keep these terminals open to keep the the application running.

### ALTERNATIVELY: If these files do not work, it can be done the manual way:

#### Run Backend Server - (FIRST) (Skip if executable files worked)

1. Navigate to the "backend" folder in your terminal using the `cd` command.
2. Run `npm install`. You might see some warnings, but it should not be a problem as long as the installation finishes.
3. Run `npm start`, you should see "Server running at port http://localhost:8080". Now your backend server is up and running.
4. Keep the terminal open to keep the backend running.

#### Run Frontend (Main Application) - (SECOND) (Skip if executable files worked)

1. Open a new terminal.
2. Navigate to the "frontend" folder in your terminal using the `cd` command.
3. Run `npm install`. You might see some warnings, but it should not be a problem as long as the installation finishes.
4. Run `npm run start`, you will see multiple prompts. As long as you see "Compiled successfully!", you should be good.
5. It should automatically open the website for you. If it does not, go to your browser and paste in "http://localhost:3000".
6. Keep the terminal open to keep the website running.

## Usage

    - You should be able to use all features of this application immediately.
    - If you do not wish to create any accounts to test this application, you can use these already registered accounts:
        *Student Accounts (They all use password: "password12345"):
            - james.smith61@utdallas.edu
            - mary.johnson37@utdallas.edu
            - robert.williams63@utdallas.edu

        *Club Admin Accounts (They all use password: "Password123!"):
            - the.dialogue.society@utdallas.edu
            - comets.ai.research..cair.@utdallas.edu
            - artificial.intelligence.society@utdallas.edu

## Files For FRONTEND

**Project Configs (Path: /)**

    - package.json: A manifest file that lists the project's metadata and required dependencies with their allowed version ranges.

    - package-lock.json: An automatically generated file that records the exact version of every installed package to ensure the same dependency tree is built on every machine.

    - cypress.config.js: The configuration file for Cypress that sets up the base URL and testing environment.

**Root files (Path: /public)** - index.html: The ROOT HTML file that React.js uses to inject its HTML

**Frontend Core & Routing (Path: /src)**

    - index.jsx: The entry point for the React application; it configures the createBrowserRouter and maps URL paths to specific page components.

    - index.css: The global stylesheet containing base styles that apply to the entire application.

**Page Components - Routes - Represent Full Pages (Path /src/routes)**

> > All these pages contain a main component function exported as default that returns the finished HTML code of the page. Some of these pages have loader methods that run before the page opens to load in data or verify user athentication, and some have action methods that run when forms have been submitted:

    - Home.jsx: The landing page of the application. (PUBLIC)

    - Club.jsx: The page for viewing a specific club's detailed profile. (PUBLIC)

    - Account.jsx & AccountForms.jsx: Handles both student and club users' login, registration, and authentication. (PUBLIC)

    - StudentHome.jsx: The dashboard view specifically designed for logged-in students. (PRIVATE)

    - Clubs.jsx: For browsing the list of all clubs in the student's favorites list (PRIVATE)

    - Events.jsx: For browsing the list of all events in the student's attending events list (PRIVATE)

    - MatchingEvents.jsx: For browsing the list of all events that match a student's set schedule.

    - ClubHome.jsx: The dashboard for club administrators to manage their organization and events.

    - AddEvent.jsx: A popup page on top of the Club's dashborad that provides a form for the club administrator users to create new events for their club.

    - Module.css files: Every page has a corresponding .module.css file (e.g., Club.module.css) to ensure styles stay scoped to that specific component.

**UI Components - Reusable (Path /src/components)**

> > These are smaller pieces of UI components used across multiple pages. All these pages contain a main component function exported as default that returns the finished HTML code of the component.

    - Calendar.jsx: A component that provides an interactive schedule allowing the user to input their schedule.

    - Club.jsx: A component that provides a small rectangular shaped box showing basic club data. It is used in places where lists of clubs need to be displayed.

    - Clubs.jsx: A component that provides an organized block listing groups of Club.jsx component clubs that are fed to it.

    - Event.jsx: A component that provides a small rectangular shaped box showing basic event data. It is used in places were lists of events need to be displayed.

    - GlobalLoader.jsx: A component that provides a popup loader spinner, and sits at the top of all pages (At the root). This components appears during a api request to the backend, and disappears when the api request is done.

    - Modal.jsx: A reusable pop-up window used for forms or detailed alerts.

    - PublicHeader.jsx & UserHeader.jsx: Navigation bars that change based on whether a user is logged in or just browsing.

    - StudentSignUpForm.jsx: The specific registration form for new student accounts.

    - Module.css files: Every component has a corresponding .module.css file (e.g., Calendar.module.css) to ensure styles stay scoped to that specific component.

**Utility Functions (path /src/utils)**

    - api.js: A helper file dedicated to handling private requests and communication between the frontend and backend API.

    - publiApi.js: A helper file dedicated to handling public requests and communication between the frontend and backend API.

    - helpers.js: Contains reusable JavaScript utility functions that are shared across different components.

**Utility Functions (path /src/context)**

    - LoadingContext.jsx: A component that uses React's Context plugin in order to add a wrapper around the main App component, in order to have a global state layer that can be edited from or loaded into any page/component.

## Files For BACKEND

**Project Configs (Path: /)**

    - package.json: A manifest file that lists the project's metadata and required dependencies (like Express, pg, etc.) with their allowed version ranges.

    - package-lock.json: An automatically generated file that records the exact version of every installed package to ensure the same dependency tree is built on every machine.

    - .env: Stores sensitive environment variables such as database credentials, API keys, and JWT secrets.

**Root files (Path: /)**

    - app.js: The main entry point for the backend application; it configures the Express server, applies middleware, and mounts all the application routes.

**Database Configuration (Path: /db)**

    - main.js: Contains the core database connection logic (e.g., establishing the connection pool) and helper functions for executing queries.

**Public Data Routes (Path: /clubsRoutes)**

> > These files handle incoming API requests for public-facing data that usually do not require user authentication. All these files (excluding index.js) have handler functions that are the controllers of the route logic, and are responsible for accepting data, returning data, and handling errors.

    - fetchClub.js: Handles the logic for retrieving detailed information about a single, specific club from the database.

    - fetchClubs.js: Handles the logic for querying and returning a list of multiple clubs.

    - fetchTags.js: Handles retrieving the list of available tags/categories used to filter clubs.

    - index.js: Exports and maps these specific club-related route handlers to their respective URL endpoints.

**User & Authentication Routes (Path: /userRoutes/user)**

> > These files handle incoming API requests that handle authentication, profile management, and actions that require a logged-in user (either a student or a club administrator).

    - login.js: Handles user authentication, validates credentials, and generates JWTs for the frontend to store and use for private requests.

    - register.js: Validates and creates new user accounts (students or clubs) in the database, and generates JWTs for the frontend to store and use for private requests.

    - refresh.js: Handles refreshing authentication tokens to keep a user logged in without requiring them to re-enter credentials.

    - verify.js: Handles user verification steps, such as checking their access tokens.

    - addEvent.js: Handles the backend logic and database insertion for when a club creates a new event.

    - changeSchedule.js: Updates a student's personal schedule in the database.

    - deleteEvent.js: Handles the removal of an existing event from the database.

    - editClub.js: Processes updates to a club's profile details and saves them.

    - matchEvents.js: Contains the algorithm/query to find and return events that match a user's set schedule.

    - profile.js: Retrieves or updates a specific student user's private profile data.

    - toggleEventAttendance.js: Updates a user's RSVP status (attending/not attending) for a specific event.

    - toggleUserFavorite.js: Adds or removes a club from a student's personal favorites list.

    - index.js: Bundles all these user-related controllers and maps them to the '/user' sub-routes. (Note: There is also an 'index.js' in '/userRoutes' which mounts this entire folder to the main app).

**Middleware (Path: /middleware)**

> > Functions that run before the main route handlers to intercept, verify, or modify incoming requests.

    - authenticateToken.js: Security middleware that checks incoming requests for a valid JWT token before allowing access to private routes.

    - cloudinaryConfig.js: Configuration and upload middleware for Cloudinary, used to handle image uploads (club logos).

**Utility Functions (Path: /helpers)**

    - constants.js: Stores reusable static values, or ENUMS.

    - errorHandler.js: Centralized logic for catching backend errors and formatting them into consistent API responses for the frontend.

**Testing Routes (Path: /testRoutes)**

> > Specialized routes strictly used during testing (like for Cypress E2E tests) to manipulate the database state. These are typically disabled in production.

    - cleanupTestAccounts.js: An endpoint triggered by tests to delete mock users, clubs, or events to reset the database to a clean state.

    - index.js: Maps the testing route handlers to their endpoints.
