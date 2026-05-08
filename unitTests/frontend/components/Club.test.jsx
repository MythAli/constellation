import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Club from "../../../frontend/src/components/Club";

const defaultProps = {
  image: "https://example.com/logo.png",
  id: "42",
  clubName: "Chess Club",
  body: "A club for chess enthusiasts.",
};

describe("Club Component", () => {
  test("renders the club name", () => {
    render(
      <MemoryRouter>
        <Club {...defaultProps} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Chess Club")).toBeInTheDocument();
  });

  test("renders the club description", () => {
    render(
      <MemoryRouter>
        <Club {...defaultProps} />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("A club for chess enthusiasts."),
    ).toBeInTheDocument();
  });

  test("renders the club logo image", () => {
    render(
      <MemoryRouter>
        <Club {...defaultProps} />
      </MemoryRouter>,
    );
    const img = screen.getByAltText("Club Logo");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", defaultProps.image);
  });

  test("links to the correct club page", () => {
    render(
      <MemoryRouter>
        <Club {...defaultProps} />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/clubs/42");
  });
});
