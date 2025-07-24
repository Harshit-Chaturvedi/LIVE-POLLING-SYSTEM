// src/pages/StudentPollView.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import socket from "../socket";

import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";





const StudentPollView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = location.state?.studentName;
  const [poll, setPoll] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!studentName) {
      navigate("/");
      return;
    }

    socket.on("newPoll", (pollData) => {
      setPoll(pollData);
      setAnswered(false);
    });

    socket.on("pollEnded", () => {
      setPoll(null);
      alert("Poll ended.");
    });

    return () => {
      socket.off("newPoll");
      socket.off("pollEnded");
    };
  }, [studentName, navigate]);

  const submitAnswer = (option) => {
    socket.emit("submitAnswer", {
      studentName,
      answer: option,
    });
    setAnswered(true);
  };

  return (
    <Container className="py-5 text-center">
      <h2 className="fw-bold mb-4">Welcome, {studentName}!</h2>

      {!poll ? (
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Waiting for poll...</span>
        </Spinner>
      ) : (
        <Card className="mx-auto shadow-sm" style={{ maxWidth: "600px" }}>
          <Card.Body>
            <Card.Title className="mb-3">{poll.question}</Card.Title>

            {poll.options.map((opt, i) => (
              <Button
                key={i}
                variant="outline-primary"
                className="w-100 my-2"
                disabled={answered}
                onClick={() => submitAnswer(opt)}
              >
                {opt}
              </Button>
            ))}

            {answered && (
              <Alert variant="success" className="mt-4">
                Answer submitted!
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default StudentPollView;
