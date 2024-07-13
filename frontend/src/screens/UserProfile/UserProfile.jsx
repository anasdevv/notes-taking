import React from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { useAuthContext } from "../../hooks/useAuthContext";

const UserProfile = () => {
  const { user } = useAuthContext();
  return (
    <MainScreen title={"MY PROFILE"}>
      <div>
        <p>name: {user.name}</p>
        <p>email: {user.email}</p>
        <p>Profile Picture:</p>
        <img style={{ maxWidth: 300 }} src={`${user.profilePicture}`} />
      </div>
    </MainScreen>
  );
};

export default UserProfile;
