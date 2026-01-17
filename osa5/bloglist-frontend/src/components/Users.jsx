import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography 
} from "@mui/material";

const Users = ({ blogs }) => {
  const usersMap = blogs.reduce((acc, blog) => {
    const username = blog.user.username;

    if (!acc[username]) {
      acc[username] = {
        id: blog.user.id,
        name: blog.user.name,
        username: blog.user.username,
        blogCount: 0,
      };
    }
    acc[username].blogCount++;

    return acc;
  }, {});

  const users = Object.values(usersMap);

  return (
    <div>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 2 }}>
        Users
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell align="right"><strong>Blogs created</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
              >
                <TableCell>
                  <Link 
                    to={`/users/${user.id}`}
                    style={{ textDecoration: 'none', color: '#1976d2' }}
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{user.blogCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;