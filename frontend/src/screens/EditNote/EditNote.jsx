import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import Markdown from "react-markdown";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { NOTE_ROUTES } from "../../constants/noteConstants";

const EditNote = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [invalidFields, setInvalidFields] = useState({});
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const getData = async () => {
      try {
        const { data } = await axios.get(NOTE_ROUTES.GET_NOTE(id), {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      } catch (error) {
        setError(error.response?.data?.error || "An error occurred");
      }
    };
    getData();
  }, [id, user]);

  const resetHandler = () => {
    setTitle("");
    setContent("");
    setCategory("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      await axios.patch(NOTE_ROUTES.UPDATE_NOTE(id), note, {
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

  return (
    <MainScreen title="Edit Note">
      <Card>
        <Card.Header>Enter Note Information</Card.Header>
        <Card.Body>
          <Form onSubmit={handleUpdate}>
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
            <Button className="mx-2" type="submit">
              Update
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                navigate("/mynotes");
              }}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </MainScreen>
  );
};

export default EditNote;
