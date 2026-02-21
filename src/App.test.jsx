import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
    it("renders difficulty label", () => {
        render(<App />);
        const element = screen.getByText(/Diff:/i);
        expect(element).toBeInTheDocument();
    });
});
