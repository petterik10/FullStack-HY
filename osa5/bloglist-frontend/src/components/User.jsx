import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";

const User = ({ blogs }) => {
  const { id } = useParams();

  const userBlogs = blogs.filter((blog) => blog.user.id === id);
  const user = userBlogs[0]?.user.name;

  if (!user) {
    return <Typography variant="h5">User not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ marginBottom: 2 }}>
        {user}
      </Typography>

      <Typography
        variant="h6"
        sx={{ marginBottom: 2, color: "text.secondary" }}
      >
        Added blogs
      </Typography>

      <Box component="ul" sx={{ paddingLeft: 3 }}>
        {userBlogs.map((blog) => (
          <Typography component="li" key={blog.id} sx={{ marginBottom: 1 }}>
            {blog.title}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default User;
