import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublicHeader from "../../../frontend/src/components/PublicHeader";

describe("PublicHeader Component", () => {
  test("renders logo and navigation links", () => {
    render(
      <MemoryRouter>
        <PublicHeader />
      </MemoryRouter>,
    );

    // Check the login/signup link exists
    const loginLink = screen.getByRole("link", { name: /login \/ sign up/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/account");

    // Check the home link exists (icon-only link, so query by href)
    const links = screen.getAllByRole("link");
    const homeLink = links.find((link) => link.getAttribute("href") === "/");
    expect(homeLink).toBeInTheDocument();
  });
});
