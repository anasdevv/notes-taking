import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditNote from "../screens/EditNote/EditNote";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../context/AuthContext";
import { MemoryRouter, Route, Routes, Router } from "react-router-dom";
import axios from "axios";
import { NOTE_ROUTES } from "../constants/noteConstants";

jest.mock("axios");

const mockUser = {
  email: "mockuser@example.com",
  name: "Mock User",
  profilePicture: "picture.png",
  createdAt: "2024-07-30T15:20:49.072Z",
  token: "token",
};

const mockNote = {
  _id: "1",
  title: "Test Note",
  content: "This is the content of the test note.",
  category: "General",
};

jest.mock("../hooks/useAuthContext", () => ({
  useAuthContext: () => ({ user: mockUser }),
}));

const renderComponent = () => {
  // note id is taken from url
  render(
    <AuthContextProvider>
      <MemoryRouter initialEntries={["/edit-note/1"]}>
        <Routes>
          <Route path="/edit-note/:id" element={<EditNote />} />
          <Route path="/mynotes" element={<div>My Notes Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContextProvider>
  );
};

describe(EditNote, () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockNote });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render EditNote page and fetch note data", async () => {
    renderComponent();

    expect(screen.getByText("Edit Note")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i).value).toBe(mockNote.title);
      expect(screen.getByLabelText(/content/i).value).toBe(mockNote.content);
      expect(screen.getByLabelText(/category/i).value).toBe(mockNote.category);
    });
  });

  test("should handle form submission and update note", async () => {
    axios.patch.mockResolvedValueOnce({ status: 200 });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Note Title" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Updated content." },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Updated Category" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        `http://localhost:5000/api/notes/1`,
        {
          title: "Updated Note Title",
          content: "Updated content.",
          category: "Updated Category",
        },
        {
          headers: {
            Authorization: `Bearer ${mockUser.token}`,
          },
        }
      );
    });
    expect(screen.queryByText(/an error occurred/i)).not.toBeInTheDocument();
    expect(screen.getByText(/my notes page/i)).toBeInTheDocument();
  });

  test("should show validation messages when fields are empty", async () => {
    render(
      <AuthContextProvider>
        <MemoryRouter>
          <EditNote />
        </MemoryRouter>
      </AuthContextProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });
  });

  test("should update Markdown preview when content is entered", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "### Updated content." },
    });
    await waitFor(() => {
      expect(screen.getByText(/note preview/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText("Updated content.")).toBeInTheDocument();
    });
  });

  test("should handle cancel button click", async () => {
    renderComponent();

    const createButton = screen.getByText(/cancel/i);
    fireEvent.click(createButton);

    // Wait for navigation to complete
    await waitFor(() => {
      expect(screen.getByText("My Notes Page")).toBeInTheDocument();
    });
  });
});
