import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { NOTE_ROUTES } from "../../constants/noteConstants";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [invalidFields, setInvalidFields] = useState({});
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const resetHandler = () => {
    setTitle("");
    setContent("");
    setCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const newInvalidFields = {};

    if (!title) newInvalidFields.title = true;
    if (!content) newInvalidFields.content = true;
    if (!category) newInvalidFields.category = true;

    if (Object.keys(newInvalidFields).length > 0) {
      setInvalidFields(newInvalidFields);
      return;
    }

    setInvalidFields({});
    const note = { title, content, category };
    try {
      await axios.post(NOTE_ROUTES.CREATE_NOTE, note, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      resetHandler();
      navigate("/mynotes");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };
  const handleCancel = () => {
    navigate("/mynotes"); // Redirect to /mynotes
  };

  return (
    <div>
      <MainScreen title="Create New Note">
        <Card>
          <Card.Header>Enter Note Information</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isInvalid={invalidFields.title}
                />
                <Form.Control.Feedback type="invalid">
                  Title is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="content">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  isInvalid={invalidFields.content}
                />
                <Form.Control.Feedback type="invalid">
                  Content is required.
                </Form.Control.Feedback>
                {content && (
                  <Card className="mt-3 mb-3">
                    <Card.Header>Note Preview</Card.Header>
                    <Card.Body>
                      <Markdown>{content}</Markdown>
                    </Card.Body>
                  </Card>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  isInvalid={invalidFields.category}
                />
                <Form.Control.Feedback type="invalid">
                  Category is required.
                </Form.Control.Feedback>
              </Form.Group>
              {error && <div className="alert alert-danger">{error}</div>}
              <Button className="mx-2" type="submit">
                Create
              </Button>
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </MainScreen>
    </div>
  );
};

export default CreateNote;
