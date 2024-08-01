import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import RegisterPage from "../screens/RegisterPage/RegisterPage";
import { USER_ROUTES } from "../constants/userConstants";

jest.mock("axios");

const mockDispatch = jest.fn();

jest.mock("../hooks/useAuthContext", () => ({
  useAuthContext: () => ({ dispatch: mockDispatch }),
}));

describe(RegisterPage, () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    jest.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders register page elements", () => {
    render(
      <AuthContextProvider>
        <Router>
          <RegisterPage />
        </Router>
      </AuthContextProvider>
    );

    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("validates form inputs", async () => {
    render(
      <AuthContextProvider>
        <Router>
          <RegisterPage />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByTestId("reg-btn"));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    //password error message should appear twice
    await waitFor(() => {
      const passwordErrors = screen.getAllByText(/password is required/i);
      expect(passwordErrors.length).toBe(2);
    });
  });
  it("Renders passwords do not match error", () => {
    render(
      <AuthContextProvider>
        <Router>
          <RegisterPage />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New User" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "diffpass" },
    });

    fireEvent.click(screen.getByTestId("reg-btn"));

    expect(screen.getByText(/passwords do not match/i));
  });

  it("successful registration", async () => {
    axios.post.mockResolvedValueOnce({
      data: { email: "newuser@example.com", token: "token" },
    });

    render(
      <AuthContextProvider>
        <Router>
          <RegisterPage />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New User" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("reg-btn"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOGIN",
        payload: { email: "newuser@example.com", token: "token" },
      });
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "userInfo",
      JSON.stringify({ email: "newuser@example.com", token: "token" })
    );
  });

  test("Uploads profile picture", async () => {
    const imgFile = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    render(
      <AuthContextProvider>
        <Router>
          <RegisterPage />
        </Router>
      </AuthContextProvider>
    );

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            url: `${USER_ROUTES.IMAGE_UPLOAD}/${imgFile.name}`,
          }),
      })
    );

    fireEvent.change(screen.getByTestId("upload-pic"), {
      target: { files: [imgFile] },
    });

    await waitFor(() => {
      expect(screen.getByText(/Uploading.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith(
        USER_ROUTES.IMAGE_UPLOAD,
        expect.any(Object)
      );
    });

    global.fetch.mockClear();
  });
});
