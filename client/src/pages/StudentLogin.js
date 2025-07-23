// src/pages/StudentLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

const StudentLogin = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name.trim()) {
      navigate("/poll", { state: { studentName: name } });
    } else {
      setError("Please enter your name.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row style={{ width: "100%" }}>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center mb-4">Student Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group controlId="studentName">
              <Form.Label>Enter your name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Harshit"
                value={name}
                onChange={(e) => {
                  setError("");
                  setName(e.target.value);
                }}
              />
            </Form.Group>

            <div className="d-grid mt-4">
              <Button variant="primary" onClick={handleLogin}>
                Join Poll
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentLogin;
