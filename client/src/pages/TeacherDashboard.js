// src/pages/TeacherDashboard.js
import React, { useState, useEffect } from "react";

import socket from "../socket";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Card,
  InputGroup,
} from "react-bootstrap";






const TeacherDashboard = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [responses, setResponses] = useState([]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const createPoll = () => {
    const pollData = {
      question,
      options: options.filter((opt) => opt.trim() !== ""),
    };
    socket.emit("createPoll", pollData);
  };

  const endPoll = () => {
    socket.emit("endPoll");
    setQuestion("");
    setOptions(["", ""]);
    setResponses([]);
  };

  useEffect(() => {
    socket.on("pollUpdate", (data) => {
      setResponses(data);
    });

    socket.on("pollEnded", () => {
      alert("Poll has ended.");
    });

    return () => {
      socket.off("pollUpdate");
      socket.off("pollEnded");
    };
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Teacher Dashboard</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Poll Question</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Form.Group>

            <Form.Label>Options</Form.Label>
            {options.map((opt, idx) => (
              <InputGroup key={idx} className="mb-2">
                <Form.Control
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              </InputGroup>
            ))}

            <Button
              variant="secondary"
              onClick={() => setOptions([...options, ""])}
              className="me-2"
            >
              + Add Option
            </Button>

            <Button variant="success" onClick={createPoll} className="me-2">
              Start Poll
            </Button>

            <Button variant="danger" onClick={endPoll}>
              End Poll
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h4>Responses</h4>
          {responses.length === 0 ? (
            <p className="text-muted">No responses yet.</p>
          ) : (
            <ListGroup>
              {responses.map((r, i) => (
                <ListGroup.Item key={i}>
                  <strong>{r.studentName}</strong> voted: <em>{r.answer}</em>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeacherDashboard;
