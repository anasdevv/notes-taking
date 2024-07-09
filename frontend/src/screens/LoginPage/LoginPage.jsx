import React from "react";
import "./LoginPage.css";
import { Button, Container, Form } from "react-bootstrap";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <MainScreen title="LOGIN">
      <div className="login-container">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit" className="mb-2">
            Submit
          </Button>
          <Form.Group>
            <Form.Text>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </Form.Text>
          </Form.Group>
        </Form>
      </div>
    </MainScreen>
  );
};

export default LoginPage;
