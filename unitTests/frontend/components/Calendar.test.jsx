import { render, screen } from "@testing-library/react";
import Calendar from "../../../frontend/src/components/Calendar";

// Helper to create a range prop
const makeRange = (start, end) => ({ start, end });

describe("Calendar Component", () => {
  const defaultRange = makeRange(new Date(2026, 3, 1), new Date(2026, 3, 1)); // April 1, 2026 (month is 0-indexed)
  const onRangeChange = jest.fn();

  test("renders the calendar card", () => {
    const { container } = render(
      <Calendar range={defaultRange} onRangeChange={onRangeChange} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test("renders the current month and year", () => {
    render(<Calendar range={defaultRange} onRangeChange={onRangeChange} />);
    expect(screen.getByText("Apr")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  test("renders all 7 weekday headers", () => {
    render(<Calendar range={defaultRange} onRangeChange={onRangeChange} />);
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("renders 42 day cells", () => {
    const { container } = render(
      <Calendar range={defaultRange} onRangeChange={onRangeChange} />
    );
    // day_cell class is applied to each day; identity-obj-proxy returns the class name as-is
    const dayCells = container.querySelectorAll('[class*="day_cell"]');
    expect(dayCells).toHaveLength(42);
  });

  test("renders previous and next month navigation buttons", () => {
    render(<Calendar range={defaultRange} onRangeChange={onRangeChange} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
