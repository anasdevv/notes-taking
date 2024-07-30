import React, { useState } from "react";
import "./LoginPage.css";
import { Alert, Button, Container, Form } from "react-bootstrap";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { USER_ROUTES } from "../../constants/userConstants";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newInvalidFields = {};
    setError(null);

    if (!email) newInvalidFields.email = true;
    if (!password) newInvalidFields.password = true;

    if (Object.keys(newInvalidFields).length > 0) {
      setInvalidFields(newInvalidFields);
      return;
    }
    setInvalidFields({});
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios.post(
        USER_ROUTES.LOG_IN,
        {
          email,
          password,
        },
        config
      );
      // save the user to local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // update the auth context
      dispatch({ type: "LOGIN", payload: data });
      setLoading(false);
      navigate("/mynotes");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <MainScreen title="LOGIN">
      <div className="login-container">
        <Form onSubmit={submitHandler}>
          {error && <Alert variant="danger">{error}</Alert>}
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
            <Form.Control.Feedback type="invalid" data-testid="pass-error">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center mb-3 mt-4">
            <Button
              className="w-100 fs-6 p-2"
              type="submit"
              disabled={loading}
              data-testid="login-btn"
            >
              LOG IN
            </Button>
          </div>

          <Form.Group className="d-flex justify-content-center">
            <Form.Text>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </Form.Text>
          </Form.Group>
        </Form>
      </div>
    </MainScreen>
  );
};

export default LoginPage;
