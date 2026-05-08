import { render, screen } from "@testing-library/react";
import { MemoryRouter, RouterProvider, createMemoryRouter } from "react-router-dom";
import StudentSignUpForm from "../../../frontend/src/components/StudentSignUpForm";

// StudentSignUpForm uses useSubmit and useNavigation which require a full router context
const renderForm = (actionData = null) => {
  const router = createMemoryRouter(
    [{ path: "/", element: <StudentSignUpForm actionData={actionData} /> }],
    { initialEntries: ["/"] }
  );
  return render(<RouterProvider router={router} />);
};

describe("StudentSignUpForm Component", () => {
  test("renders the Sign Up title", () => {
    renderForm();
    const titles = screen.getAllByText("Sign Up");
    // One is the <p> title, one is the submit button — both should be present
    const titleParagraph = titles.find((el) => el.tagName === "P");
    expect(titleParagraph).toBeInTheDocument();
  });

  test("renders First Name input", () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  test("renders Last Name input", () => {
    renderForm();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  test("renders Email input", () => {
    renderForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test("renders Password input", () => {
    renderForm();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("renders Sign Up submit button", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("renders Cancel link", () => {
    renderForm();
    expect(screen.getByRole("link", { name: /cancel/i })).toBeInTheDocument();
  });

  test("renders backend error message when actionData contains an error", () => {
    renderForm({ url: "register", backendError: "Email already in use." });
    expect(screen.getByText("Email already in use.")).toBeInTheDocument();
  });
});
