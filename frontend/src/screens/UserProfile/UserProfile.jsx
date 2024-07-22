import React, { useRef, useState } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { useAuthContext } from "../../hooks/useAuthContext";
import { USER_ROUTES } from "../../constants/userConstants";
import "./UserProfile.css";
import axios from "axios";
import { Card, Col, Container, Row, Image, Button } from "react-bootstrap";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate());
  const month = date.toLocaleString("en-UK", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const UserProfile = () => {
  const { user } = useAuthContext();
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const hiddenFileInput = useRef(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    postDetails(fileUploaded);
  };

  // for uploading profile picture
  const postDetails = (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "notetaker");

    fetch(USER_ROUTES.IMAGE_UPLOAD, {
      method: "post",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProfilePicture(data.url.toString());
        setUploading(false);
        updateInfo(data.url.toString());
      })
      .catch((err) => {
        alert("Failed to upload file:", err);
        setUploading(false);
      });
  };

  const updateInfo = async (newProfilePicture) => {
    try {
      const response = await axios.patch(
        USER_ROUTES.UPDATE_PROFILE,
        {
          profilePicture: newProfilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data));
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <MainScreen title={"MY PROFILE"}>
      <Container className="profile-container">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center">
              <Card.Body>
                <Image
                  src={`${profilePicture}`}
                  roundedCircle
                  thumbnail
                  className="profile-picture mb-3"
                />
                <div className="mb-3">
                  <Button
                    className="button-upload"
                    onClick={handleClick}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }} // Make the file input element invisible
                  />
                </div>
                <Card.Title as="h3">{user.name}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">
                  {user.email}
                </Card.Subtitle>
                <Card.Text as="div">
                  <Row className="profile-row">
                    <Col className="profile-label">Name:</Col>
                    <Col className="profile-value">{user.name}</Col>
                  </Row>
                  <Row className="profile-row">
                    <Col className="profile-label">Email:</Col>
                    <Col className="profile-value">{user.email}</Col>
                  </Row>
                  <Row className="profile-row">
                    <Col className="profile-label">Created:</Col>
                    <Col className="profile-value">
                      {formatDate(user.createdAt)}
                    </Col>
                  </Row>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </MainScreen>
  );
};

export default UserProfile;
