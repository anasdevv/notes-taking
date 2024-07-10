import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import "./LandingPage.css";
import { useEffect, useState } from "react";

const LandingPage = () => {
  return (
    <div className="main">
      <Container>
        <Row>
          <div className="intro-text">
            <h1 className="title">Welcome to Note Taker</h1>
            <p className="sub-title">One Safe Page For All Your Notes</p>
            <div className="buttonContainer">
              <a href="/login">
                <Button size="lg" className="landingButton">
                  Login
                </Button>
              </a>
              <a href="/signup">
                <Button
                  size="lg"
                  className="landingButton"
                  variant="outline-primary"
                >
                  Register
                </Button>
              </a>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
