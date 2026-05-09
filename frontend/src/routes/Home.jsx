/*
The Main Website Home Page, that shows the list of clubs, and a search bar for searching for clubs.
*/

// LIBRARY IMPORTS
import { useRef, Fragment } from "react";
import { Outlet, Form, useLoaderData, useSearchParams } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSearchSharp } from "react-icons/io5";

// COMPONENT IMPORTS
import Clubs from "../components/Clubs";

// HELPERS IMPORTS
import publicApi from "../utils/publicApi";

// CSS IMPORTS
import classes from "./Home.module.css";

// MAIN COMPONENT
const Home = () => {
  const allClubs = useLoaderData() || []; // Extracting loader data

  // Hooks initialization
  const searchRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams(); // Extracting URL search parameters
  const query = searchParams.get("search") || ""; // Get the current search term from the URL (localhost:3000/?search=...)

  // Filter logic happens here based on the URL query
  let filteredClubs = allClubs.filter(
    ({ name, about }) =>
      name.toLowerCase().includes(query.toLowerCase()) ||
      about.toLowerCase().includes(query.toLowerCase()),
  );

  // Sort for clubs with name matching first, then about matching.
  // In addition, names starting with the word come first.
  if (query) {
    filteredClubs.sort((a, b) => {
      const queryLower = query.toLowerCase();
      const aStarts = a.name.toLowerCase().startsWith(queryLower);
      const bStarts = b.name.toLowerCase().startsWith(queryLower);

      // Sort by startsWith first, then by includes
      if (aStarts !== bStarts) return bStarts - aStarts;

      const aNameMatch = a.name.toLowerCase().includes(queryLower);
      const bNameMatch = b.name.toLowerCase().includes(queryLower);

      return bNameMatch - aNameMatch;
    });
  }

  // The function handler for the search button
  const onSearchHandler = (event) => {
    event.preventDefault(); // Prevent default page refresh
    const searchKey = searchRef.current.value.trim(); // Grab search key from input field

    // Update the URL with the search parameter. This triggers a re-render of the component.
    setSearchParams({ search: searchKey }, { replace: true });
  };

  return (
    <Fragment>
      <Outlet />
      <main>
        <p className={classes.p1}>for utd clubs</p>
        <p className={classes.p2}>CONSTELLATION</p>
        <p className={classes.p3}>find your spot among the stars</p>
        <Form className={classes.form}>
          <button>
            <RxHamburgerMenu size={20} className={classes.icon_left} />
          </button>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Hinted search text"
            ref={searchRef}
            defaultValue={query}
          />
          <button name="search" onClick={onSearchHandler}>
            <IoSearchSharp size={20} className={classes.icon_right} />
          </button>
        </Form>
        <Clubs clubs={filteredClubs} />
      </main>
    </Fragment>
  );
};

export default Home;

// PAGE LOADER: RUNS BEFORE THE PAGE OPENS TO LOAD DATA, OR VERIFY ACCESS STATUS
export const loader = async () => {
  // Get the list of all clubs
  const response = await publicApi.get("");
  const { clubs } = await response.data; // Collect response from backend

  return clubs; // Return data for the loader to use
};
