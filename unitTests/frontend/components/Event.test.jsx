import { render, screen } from "@testing-library/react";
import Event from "../../../frontend/src/components/Event";

const defaultProps = {
  id: "1",
  title: "Annual Hackathon",
  description: "Build something awesome",
  start_time: "2026-04-10T09:00:00.000Z",
  end_time: "2026-04-10T17:00:00.000Z",
};

describe("Event Component", () => {
  test("renders the event title", () => {
    render(<Event {...defaultProps} />);
    expect(screen.getByText("Annual Hackathon")).toBeInTheDocument();
  });

  test("renders the event description", () => {
    render(<Event {...defaultProps} />);
    expect(screen.getByText(/Build something awesome/i)).toBeInTheDocument();
  });

  test("renders the Time & Date label", () => {
    render(<Event {...defaultProps} />);
    expect(screen.getByText(/Time & Date:/i)).toBeInTheDocument();
  });

  test("renders a custom Button when provided", () => {
    const CustomButton = () => <button>Add Event</button>;
    render(<Event {...defaultProps} Button={CustomButton} />);
    expect(
      screen.getByRole("button", { name: /add event/i }),
    ).toBeInTheDocument();
  });

  test("renders an empty div when no Button is provided", () => {
    const { container } = render(<Event {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
