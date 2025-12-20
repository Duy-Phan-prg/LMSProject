import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // tạm thời fake login
    navigate("/admin");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: 400 }} className="p-4">
        <h4 className="text-center mb-3">Login</h4>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control placeholder="Email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button className="w-100" onClick={handleLogin}>
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
