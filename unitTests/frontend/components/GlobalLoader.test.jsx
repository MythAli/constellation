import { render, screen } from "@testing-library/react";
// Ensure this import points to your actual GlobalLoader component
import GlobalLoader from "../../../frontend/src/components/GlobalLoader";

describe("GlobalLoader Component", () => {
  test("renders the loading spinner overlay", () => {
    const { container } = render(<GlobalLoader />);

    const spinner = container.querySelector(".overlay");
    expect(spinner).toBeInTheDocument();
  });
});
