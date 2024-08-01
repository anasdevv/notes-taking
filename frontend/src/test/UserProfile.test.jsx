import {
  fireEvent,
  getByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import UserProfile from "../screens/UserProfile/UserProfile";
import "@testing-library/jest-dom";
import { AuthContextProvider } from "../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { USER_ROUTES } from "../constants/userConstants";
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

describe(UserProfile, () => {
  it("Renders user profile page", () => {
    render(
      <AuthContextProvider>
        <Router>
          <UserProfile />
        </Router>
      </AuthContextProvider>
    );

    expect(screen.getAllByText(/my profile/i));
    const img = screen.getByRole("img");
    expect(img.src).toContain("picture.png");

    //should have two instances of name and email
    const name = screen.getAllByText(/mock user/i);
    expect(name.length).toBe(2);
    const email = screen.getAllByText(/mockuser@example.com/i);
    expect(name.length).toBe(2);
    expect(screen.getByText(/30-Jul-2024/i)).toBeInTheDocument();
  });

  it("Uploads and updates profile picture", async () => {
    const imgFile = new File(["dummy content"], "new-img.png", {
      type: "image/png",
    });

    render(
      <AuthContextProvider>
        <Router>
          <UserProfile />
        </Router>
      </AuthContextProvider>
    );

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            url: imgFile.name,
          }),
      })
    );
    axios.patch.mockResolvedValue({
      data: {
        ...mockUser,
        profilePicture: imgFile.name,
      },
    });

    fireEvent.change(screen.getByTestId("change-pic"), {
      target: { files: [imgFile] },
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        USER_ROUTES.IMAGE_UPLOAD,
        expect.any(Object)
      );
      expect(axios.patch).toHaveBeenCalledWith(
        USER_ROUTES.UPDATE_PROFILE,
        { profilePicture: imgFile.name },
        { headers: { Authorization: `Bearer ${mockUser.token}` } }
      );
      expect(screen.getByRole("img").src).toContain(imgFile.name);
    });
  });

  it("Displays image upload error", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation();
    const imgFile = new File(["dummy content"], "new-img.png", {
      type: "image/png",
    });

    global.fetch = jest.fn().mockRejectedValue(new Error("Upload failed"));

    render(
      <AuthContextProvider>
        <Router>
          <UserProfile />
        </Router>
      </AuthContextProvider>
    );

    fireEvent.change(screen.getByTestId("change-pic"), {
      target: { files: [imgFile] },
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        USER_ROUTES.IMAGE_UPLOAD,
        expect.any(Object)
      );
      expect(alertMock).toHaveBeenCalledTimes(1);
    });
  });
});
