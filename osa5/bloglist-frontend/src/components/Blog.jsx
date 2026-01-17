import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Link as MuiLink,
} from "@mui/material";

const Blog = ({ blogs, addLikeToBlog, removeBlog, user, addNewComment }) => {
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const blog = blogs?.find((b) => b.id === id);

  if (!blog) {
    return <Typography variant="h5">Blog not found</Typography>;
  }

  const isCreator = user && blog.user && blog.user.username === user.username;

  const handleBlogRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id);
    }
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    addNewComment(blog.id, comment);
    setComment("");
  };

  return (
    <Box sx={{ maxWidth: 800, marginTop: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" component="h2" sx={{ marginBottom: 2 }}>
          {blog.title}
        </Typography>

        <Typography variant="h6" color="text.secondary" marginBottom={2}>
          by {blog.author}
        </Typography>

        <MuiLink href={blog.url} sx={{ display: "block", marginBottom: 2 }}>
          {blog.url}
        </MuiLink>

        <Box>
          <Typography variant="body1">{blog.likes} likes</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => addLikeToBlog(blog)}
          >
            Like
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          Added by {blog.user.name}
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="error"
            onClick={handleBlogRemove}
            marginBottom={2}
          >
            Remove
          </Button>
        )}

        <Divider marginY={3} />

        <Typography variant="h5" marginBottom={3}>
          Comments
        </Typography>

        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{ marginBottom: 2 }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment for this blog post"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ marginBottom: 1 }}
          />
          <Button type="submit" variant="contained" size="small">
            Add comment
          </Button>
        </Box>

        <List>
          {blog.comments.map((comment, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={comment} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Blog;
