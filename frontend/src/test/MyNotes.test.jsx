import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MyNotes from "../screens/MyNotes/MyNotes";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

const mockNotes = [
  {
    _id: "1",
    title: "Test Note 1",
    content: "This is the content of test note 1.",
    category: "General",
    createdAt: "2023-01-01T12:00:00Z",
  },
  {
    _id: "2",
    title: "Test Note 2",
    content: "This is the content of test note 2.",
    category: "Work",
    createdAt: "2023-01-02T12:00:00Z",
  },
];

jest.mock("../hooks/useAuthContext", () => ({
  useAuthContext: () => ({ user: mockUser }),
}));

describe("MyNotes", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockNotes });
    axios.delete.mockResolvedValueOnce({ status: 200 });
    window.confirm = jest.fn().mockImplementation(() => true);
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render MyNotes homepage", async () => {
    render(
      <AuthContextProvider>
        <MemoryRouter>
          <MyNotes />
        </MemoryRouter>
      </AuthContextProvider>
    );

    expect(
      screen.getByText(`Welcome Back ${mockUser.name}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create new note/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      mockNotes.forEach((note) => {
        expect(screen.getByText(note.title)).toBeInTheDocument();
        expect(screen.getByText(note.content)).toBeInTheDocument();
        expect(
          screen.getByText(`Category - ${note.category}`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            `Created on: ${new Date(note.createdAt).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}`
          )
        ).toBeInTheDocument();
        expect(screen.getAllByText("Edit")).toHaveLength(mockNotes.length);
        expect(screen.getAllByText("Delete")).toHaveLength(mockNotes.length);
      });
    });
  });

  test("creates new note button navigates to create note page", () => {
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<MyNotes />} />
            <Route path="/create-note" element={<div>Create Note Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const createButton = screen.getByText("Create New Note");
    fireEvent.click(createButton);

    // Wait for navigation to complete
    expect(screen.getByText("Create Note Page")).toBeInTheDocument();
  });

  test("should delete a note", async () => {
    render(
      <AuthContextProvider>
        <MemoryRouter>
          <MyNotes />
        </MemoryRouter>
      </AuthContextProvider>
    );

    await waitFor(() => {
      mockNotes.forEach((note) => {
        expect(screen.getByText(note.title)).toBeInTheDocument();
      });
    });

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        NOTE_ROUTES.DELETE_NOTE(1),
        expect.any(Object)
      );
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });
});
