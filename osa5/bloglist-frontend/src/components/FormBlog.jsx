import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography 
} from '@mui/material';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <Box sx={{ marginTop: 2, maxWidth: 500 }}>
      <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
        Create a new blog
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          required
        />
        
        <TextField
          label="Author"
          fullWidth
          margin="normal"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          required
        />
        
        <TextField
          label="URL"
          fullWidth
          margin="normal"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          required
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Create
        </Button>
      </form>
    </Box>
  );
};

export default BlogForm;