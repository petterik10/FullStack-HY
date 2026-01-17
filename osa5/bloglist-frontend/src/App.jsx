import { useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import FormLogin from "./components/FormLogin";
import FormBlog from "./components/FormBlog";
import Togglable from "./components/Toggable";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NotificationContext from "./NotificationContext";
import UserContext from "./userContenxt";
import Users from "./components/Users";
import User from "./components/User";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Routes, Route, Link } from "react-router-dom";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";

const App = () => {
  const noteFormRef = useRef();
  const { notificationDispatch } = useContext(NotificationContext);
  const { user, userDispatch } = useContext(UserContext);
  const queryClient = useQueryClient();

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        "success"
      );
    },
    onError: () => {
      showNotification("Failed to create a blog", "error");
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, ...blogData }) => blogService.update(id, blogData),
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showNotification(
        `a blog ${returnedBlog.title} by ${returnedBlog.author} has been liked`,
        "success"
      );
    },
    onError: () => {
      showNotification("Failed to like the blog", "error");
    },
  });

  const removeBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showNotification("Blog removed successfully", "success");
    },
    onError: () => {
      showNotification("Failed to remove blog", "error");
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ blogId, comment }) =>
      blogService.comment(blogId, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      showNotification("Comment added successfully", "success");
    },
    onError: () => {
      showNotification("Failed to add comment", "error");
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, type) => {
    notificationDispatch({
      type: "SET_NOTIFICATION",
      payload: { message, type },
    });
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: "SET_USER", payload: user });
      showNotification(`Welcome ${user.name}!`, "success");
    } catch {
      showNotification("wrong username or password", "error");
    }
  };

  const addNewComment = async (blogId, comment) => {
    addCommentMutation.mutate({ blogId, comment });
  };

  const addLikeToBlog = async (blogObject) => {
    const blogToUpdate = {
      user: blogObject.user.id,
      likes: blogObject.likes + 1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
    };

    likeBlogMutation.mutate({ id: blogObject.id, ...blogToUpdate });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    userDispatch({ type: "CLEAR_USER" });
    blogService.setToken(null);
    showNotification("Logged out successfully", "success");
  };

  const removeBlog = async (id) => {
    removeBlogMutation.mutate(id);
  };

  const addBlog = async (blogObject) => {
    addBlogMutation.mutate(blogObject);
    noteFormRef.current.toggleVisibility();
  };

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (isError) {
    return <div>Error loading blogs</div>;
  }

  if (user === null) {
    return (
      <div>
        <Notification />
        <FormLogin handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <Box
        sx={{ display: "flex", gap: 2, padding: 2, backgroundColor: "#f0f0f0" }}
      >
        <Button component={Link} to="/" variant="contained">
          blogs
        </Button>
        <Button component={Link} to="/users" variant="contained">
          users
        </Button>
        <Box sx={{ marginLeft: "auto" }}>
          {user.name} logged in
          <Button onClick={handleLogout} variant="outlined" sx={{ ml: 2 }}>
            logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" component="h2" sx={{ marginBottom: 2 }}>
          Blog App
        </Typography>
        <Notification />

        <Routes>
          <Route path="/users/:id" element={<User blogs={blogs} />} />
          <Route path="/users" element={<Users blogs={blogs} />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                addNewComment={addNewComment}
                addLikeToBlog={addLikeToBlog}
                removeBlog={removeBlog}
              />
            }
          />
          <Route
            path="/"
            element={
              <div>
                <Togglable buttonLabel="create new" ref={noteFormRef}>
                  <FormBlog createBlog={addBlog} />
                </Togglable>

                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {blogs
                    .sort((a, b) => b.likes - a.likes)
                    .map((blog) => (
                      <div key={blog.id}>
                        <ListItem>
                          <ListItemButton
                            component={Link}
                            to={`/blogs/${blog.id}`}
                          >
                            <ListItemText
                              primary={blog.title}
                              secondary={`by ${blog.author}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      </div>
                    ))}
                </List>
              </div>
            }
          />
        </Routes>
      </Box>
    </div>
  );
};
export default App;
