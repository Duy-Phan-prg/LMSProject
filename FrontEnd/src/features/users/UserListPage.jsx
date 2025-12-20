import { useEffect, useState } from "react";
import { Table, Spinner, Pagination } from "react-bootstrap";
import { getAllUsers } from "../../services/userService";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 0) => {
    try {
      setLoading(true);
      const data = await getAllUsers(page, 5);

      setUsers(data.content); // ✅ QUAN TRỌNG
      setPageInfo({
        page: data.number,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <h3>User List</h3>

      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.fullName}</td>
              <td>{u.role}</td>
              <td>{u.active ? "YES" : "NO"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(pageInfo.totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx === pageInfo.page}
            onClick={() => fetchUsers(idx)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
}
