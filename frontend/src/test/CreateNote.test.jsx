import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CreateNote from "../screens/CreateNote/CreateNote";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { NOTE_ROUTES } from "../constants/noteConstants";
import axios from "axios";

jest.mock("axios");

const mockUser = {
  email: "mockuser@example.com",
  name: "Mock User",
  profilePicture: "picture.png",
  createdAt: "2024-07-30T15:20:49.072Z",
  token: "token",
};

jest.mock("../hooks/useAuthContext", () => ({
  useAuthContext: () => ({ user: mockUser }),
}));

describe(CreateNote, () => {
  test("should render CreateNote page", () => {
    render(
      <AuthContextProvider>
        <Router>
          <CreateNote />
        </Router>
      </AuthContextProvider>
    );
    expect(screen.getByText("Create New Note")).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/title/i).tagName).toBe("INPUT");
    expect(screen.getByLabelText(/content/i).tagName).toBe("TEXTAREA");
    expect(screen.getByLabelText(/category/i).tagName).toBe("INPUT");
  });

  test("should show validation messages when fields are empty", async () => {
    render(
      <AuthContextProvider>
        <Router>
          <CreateNote />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });
  });
  test("should handle cancel button click", async () => {
    render(
      <AuthContextProvider>
        <Router>
          <CreateNote />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(window.location.pathname).toBe("/mynotes");
  });

  test("should create a note and navigate to /mynotes", async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <AuthContextProvider>
        <Router>
          <CreateNote />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Note" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "This is a test note." },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "General" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        NOTE_ROUTES.CREATE_NOTE,
        {
          title: "Test Note",
          content: "This is a test note.",
          category: "General",
        },
        {
          headers: { Authorization: `Bearer ${mockUser.token}` },
        }
      );
    });

    expect(window.location.pathname).toBe("/mynotes");
  });

  test("should update Markdown preview when content is entered", async () => {
    render(
      <AuthContextProvider>
        <Router>
          <CreateNote />
        </Router>
      </AuthContextProvider>
    );

    const contentInput = screen.getByLabelText(/content/i);
    fireEvent.change(contentInput, {
      // ### displays content in a h3 tag
      target: { value: "### This is a test note." },
    });
    await waitFor(() => {
      expect(screen.getByText(/note preview/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 }));
      expect(screen.getByText("This is a test note.")).toBeInTheDocument();
    });
  });
});
