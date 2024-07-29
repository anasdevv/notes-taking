import { render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

describe("Tests Login Page", () => {
  it("renders Login Page", () => {
    const { getByText } = render(
      <AuthContextProvider>
        <Router>
          <LoginPage />
        </Router>
      </AuthContextProvider>
    );
    const loginElement = getByText(/login/i);
    expect(loginElement).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });
});
