import React from "react";
import MainScreen from "../../components/MainScreen/MainScreen.jsx";
import { Accordion, Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MyNotes.css";
import { notes } from "./notes.js";

const MyNotes = () => {
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      console.log(id, "deleted");
    }
  };
  return (
    <div>
      <MainScreen title="Welcome Back Fahd Aleem">
        <Link to="/create">
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
        {notes.map((note) => (
          <Accordion
            flush
            defaultActiveKey={["0"]}
            style={{ marginLeft: 0, marginBottom: 10 }}
          >
            <Accordion.Item eventkey="0">
              <Card key={note._id} style={{ margin: 0, padding: 0 }}>
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
                      className="mx-2"
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
                      <p>{note.content}</p>
                      <footer className="blockquote-footer">
                        <cite title="Source Title">Created on: date</cite>
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
