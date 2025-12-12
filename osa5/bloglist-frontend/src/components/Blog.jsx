import { useState } from "react";

const Blog = ({ blog, addLikeToBlog, removeBlog, user }) => {
  const [showBlog, setShowBlog] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const blogButtonText = showBlog ? "hide" : "view";

  const isCreator = user && blog.user && blog.user.username === user.username;

  const handleBlogRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id);
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowBlog(!showBlog)}>{blogButtonText}</button>
        {showBlog && (
          <div>
            {blog.url}
            <p>
              likes {blog.likes}
              <button onClick={() => addLikeToBlog(blog)}>like</button>
            </p>
            <p>{blog.user.username}</p>
            <p>
              {isCreator && (
                <button
                  data-testid="remove-button"
                  onClick={handleBlogRemove}
                  style={{ backgroundColor: "red" }}
                >
                  remove
                </button>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
