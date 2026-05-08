import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserHeader from "../../../frontend/src/components/UserHeader";

const renderHeader = (user, onSetLogOut = jest.fn()) =>
  render(
    <MemoryRouter>
      <UserHeader user={user} onSetLogOut={onSetLogOut} />
    </MemoryRouter>,
  );

describe("UserHeader Component", () => {
  describe("Student user", () => {
    const studentUser = { name: "Jane Doe", userType: "student" };

    test("renders the student's name", () => {
      renderHeader(studentUser);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    test("does not render Club Admin label for students", () => {
      renderHeader(studentUser);
      expect(screen.queryByText(/club admin/i)).not.toBeInTheDocument();
    });

    test("renders a Log out button", () => {
      renderHeader(studentUser);
      expect(
        screen.getByRole("button", { name: /log out/i }),
      ).toBeInTheDocument();
    });

    test("home link points to /", () => {
      renderHeader(studentUser);
      const links = screen.getAllByRole("link");
      const homeLink = links.find((l) => l.getAttribute("href") === "/");
      expect(homeLink).toBeInTheDocument();
    });

    test("student home link points to /student-home", () => {
      renderHeader(studentUser);
      const links = screen.getAllByRole("link");
      const studentHomeLink = links.find(
        (l) => l.getAttribute("href") === "/student-home",
      );
      expect(studentHomeLink).toBeInTheDocument();
    });
  });

  describe("Club admin user", () => {
    const clubUser = { name: "Chess Club", userType: "club" };

    test("renders the club's name", () => {
      renderHeader(clubUser);
      expect(screen.getByText("Chess Club")).toBeInTheDocument();
    });

    test("renders Club Admin label for club users", () => {
      renderHeader(clubUser);
      expect(screen.getByText(/club admin/i)).toBeInTheDocument();
    });

    test("club home link points to /club-home", () => {
      renderHeader(clubUser);
      const links = screen.getAllByRole("link");
      const clubHomeLink = links.find(
        (l) => l.getAttribute("href") === "/club-home",
      );
      expect(clubHomeLink).toBeInTheDocument();
    });
  });
});
