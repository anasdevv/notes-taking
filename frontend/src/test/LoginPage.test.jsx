import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../screens/LoginPage/LoginPage";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const mockDispatch = jest.fn();

jest.mock("../hooks/useAuthContext", () => ({
  useAuthContext: () => ({ dispatch: mockDispatch }),
}));

describe(LoginPage, () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    jest.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders Login Page", () => {
    render(
      <AuthContextProvider>
        <Router>
          <LoginPage />
        </Router>
      </AuthContextProvider>
    );
    const loginElement = screen.getByText(/login/i);
    expect(loginElement).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should show validation messages when fields are empty", async () => {
    render(
      <AuthContextProvider>
        <Router>
          <LoginPage />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByTestId("login-btn"));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it("shows an error message on failed login", async () => {
    const mockError = {
      response: { data: { error: "Invalid credentials" } },
    };
    axios.post.mockRejectedValue(mockError);

    render(
      <AuthContextProvider>
        <Router>
          <LoginPage />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it("successful login", async () => {
    axios.post.mockResolvedValueOnce({
      data: { email: "test@example.com", token: "token" },
    });

    render(
      <AuthContextProvider>
        <Router>
          <LoginPage />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOGIN",
        payload: { email: "test@example.com", token: "token" },
      });
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "userInfo",
      JSON.stringify({ email: "test@example.com", token: "token" })
    );
  });
});
