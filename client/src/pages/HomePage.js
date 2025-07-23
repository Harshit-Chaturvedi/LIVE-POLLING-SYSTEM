// src/pages/HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";

const HomePage = () => {
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goToStudent = () => {
    if (studentName.trim()) {
      navigate("/poll", { state: { studentName } });
    } else {
      setError("Please enter your name to join as a student.");
    }
  };

  const goToTeacher = () => {
    navigate("/teacher");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row style={{ width: "100%" }}>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="p-4 shadow">
            <h2 className="text-center mb-4">Welcome to Live Polling System</h2>

            <Row className="mb-5">
              <Col md={6} className="border-end">
                <h4 className="text-center mb-3">Enter as Student</h4>
                <Form>
                  <Form.Group controlId="studentNameInput">
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={studentName}
                      onChange={(e) => {
                        setError("");
                        setStudentName(e.target.value);
                      }}
                    />
                  </Form.Group>
                  {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
                  <div className="d-grid mt-3">
                    <Button variant="primary" onClick={goToStudent}>
                      Join Poll
                    </Button>
                  </div>
                </Form>
              </Col>

              <Col md={6} className="text-center">
                <h4 className="mb-4">Enter as Teacher</h4>
                <Button variant="secondary" onClick={goToTeacher}>
                  Go to Teacher Dashboard
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
