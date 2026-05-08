import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Clubs from "../../../frontend/src/components/Clubs";

const makeClubs = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Club ${i + 1}`,
    about: `About club ${i + 1}`,
    logo_url: `https://example.com/logo${i + 1}.png`,
  }));

const renderClubs = (clubs) =>
  render(
    <MemoryRouter>
      <Clubs clubs={clubs} />
    </MemoryRouter>,
  );

describe("Clubs Component", () => {
  test("renders a list of clubs", () => {
    renderClubs(makeClubs(3));
    expect(screen.getByText("Club 1")).toBeInTheDocument();
    expect(screen.getByText("Club 2")).toBeInTheDocument();
    expect(screen.getByText("Club 3")).toBeInTheDocument();
  });

  test("shows at most 15 clubs initially", () => {
    renderClubs(makeClubs(20));
    // Only 15 club names should be visible
    expect(screen.getByText("Club 15")).toBeInTheDocument();
    expect(screen.queryByText("Club 16")).not.toBeInTheDocument();
  });

  test("does not show 'Show more' button when clubs are 15 or fewer", () => {
    renderClubs(makeClubs(10));
    expect(screen.queryByText(/show/i)).not.toBeInTheDocument();
  });

  test("shows 'Show more' button when clubs exceed 15", () => {
    renderClubs(makeClubs(16));
    expect(screen.getByText(/show/i)).toBeInTheDocument();
  });

  test("does not show 'Show less' button initially", () => {
    renderClubs(makeClubs(20));
    expect(screen.queryByText(/less/i)).not.toBeInTheDocument();
  });
});
