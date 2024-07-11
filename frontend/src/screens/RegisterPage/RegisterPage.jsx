import React, { useState, useEffect } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    "https://fontawesome.com/icons/user?f=classic&s=solid"
  );
  const [invalidFields, setInvalidFields] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { dispatch } = useAuthContext();
  const Navigate = useNavigate();

  useEffect(() => {
    console.log("Profile Picture updated: ", profilePicture);
  }, [profilePicture]);

  // for uploading profile picture
  const postDetails = (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "notetaker");
    data.append("cloud_name", "dq196vyns");

    console.log("Starting file upload...");

    fetch("https://api.cloudinary.com/v1_1/dq196vyns/image/upload", {
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
        console.log("File uploaded successfully:", data.url.toString());
        setProfilePicture(data.url.toString());
        setUploading(false);
      })
      .catch((err) => {
        console.error("Failed to upload file:", err);
        setUploading(false);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newInvalidFields = {};
    setError(null);

    if (!name) newInvalidFields.name = true;
    if (!email) newInvalidFields.email = true;
    if (!password) newInvalidFields.password = true;

    if (Object.keys(newInvalidFields).length > 0) {
      setInvalidFields(newInvalidFields);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        setLoading(true);
        const { data } = await axios.post(
          "http://localhost:5000/api/users/signup",
          {
            name,
            email,
            password,
            profilePicture,
          },
          config
        );
        console.log(data);
        // save to local storage
        localStorage.setItem("userInfo", JSON.stringify(data));

        // update the auth context
        dispatch({ type: "LOGIN", payload: data });
        setLoading(false);
        Navigate("/mynotes");
      } catch (error) {
        setLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        }
        console.log(error.response.data.error);
      }
    }
  };

  return (
    <MainScreen title="CREATE ACCOUNT">
      <div className="login-container">
        <Form onSubmit={submitHandler}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={invalidFields.name}
            />
            <Form.Control.Feedback type="invalid">
              Name is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={invalidFields.email}
            />
            <Form.Control.Feedback type="invalid">
              Email is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={invalidFields.password}
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={invalidFields.password}
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => postDetails(e.target.files[0])}
              label="Upload Profile Picture"
            />
          </Form.Group>

          <div className="d-flex justify-content-center mb-3 mt-4">
            <Button
              className="w-100 fs-6 p-2"
              type="submit"
              disabled={uploading || loading}
            >
              {uploading ? "Uploading..." : loading ? "Loading..." : "SIGN UP"}
            </Button>
          </div>

          <Form.Group className="d-flex justify-content-center">
            <Form.Text>
              Already have an account? <Link to="/login">Log in</Link>
            </Form.Text>
          </Form.Group>
        </Form>
      </div>
    </MainScreen>
  );
};

export default RegisterPage;
