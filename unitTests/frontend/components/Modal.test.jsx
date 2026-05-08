import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Modal from "../../../frontend/src/components/Modal";

const renderModal = (props = {}) =>
  render(
    <MemoryRouter>
      <Modal {...props}>
        <p>Modal Content</p>
      </Modal>
    </MemoryRouter>,
  );

describe("Modal Component", () => {
  test("renders children content", () => {
    renderModal();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("renders a backdrop element", () => {
    const { container } = renderModal();
    const backdrop = container.querySelector('[class*="backdrop"]');
    expect(backdrop).toBeInTheDocument();
  });

  test("renders an open dialog element", () => {
    renderModal();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
});
