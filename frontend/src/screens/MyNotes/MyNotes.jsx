import React from "react";
import MainScreen from "../../components/MainScreen/MainScreen.jsx";
import { Accordion, Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MyNotes.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const MyNotes = () => {
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          "http://localhost:5000/api/notes/" + id,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(response.status, id, "deleted");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting note:", error);
        setError(error.response?.data?.error || "An error occurred");
      }
    }
  };
  const fetchNotes = async () => {
    const { data } = await axios.get("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setNotes(data);
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  return (
    <div>
      <MainScreen title={`Welcome Back ${user.name}`}>
        <Link to="/create-note">
          <Button
            size="lg"
            style={{
              marginLeft: 10,
              marginBottom: 20,
              marginTop: 0,
              fontSize: 15,
            }}
          >
            Create New Note
          </Button>
        </Link>
        {notes &&
          notes.map((note) => (
            <Accordion
              key={note._id}
              flush
              defaultActiveKey={["0"]}
              style={{ marginLeft: 0, marginBottom: 10 }}
            >
              <Accordion.Item>
                <Card style={{ margin: 0, padding: 0 }}>
                  <Card.Header
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        flex: 1,
                        alignSelf: "center",
                      }}
                    >
                      <Accordion.Button
                        as={Card.Text}
                        variant="link"
                        style={{ fontSize: 20 }}
                      >
                        {note.title}
                      </Accordion.Button>
                    </div>

                    <div className="buttons">
                      <Button
                        href={`/note/${note._id}`}
                        size="sm"
                        className="mx-2"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="mx-3"
                        onClick={() => deleteHandler(note._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse>
                    <Card.Body>
                      <Badge bg="info" style={{ marginBottom: 8 }}>
                        Category - {note.category}
                      </Badge>
                      <blockquote className="blockquote mb-0">
                        <Markdown>{note.content}</Markdown>
                        <footer className="blockquote-footer mt-auto">
                          <cite title="Source Title">
                            Created on: {formatDate(note.createdAt)}
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion.Item>
            </Accordion>
          ))}
      </MainScreen>
    </div>
  );
};

export default MyNotes;
