import { Container, Navbar, Nav } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>LMS Admin</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate("/admin/users")}>
              Users
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}
