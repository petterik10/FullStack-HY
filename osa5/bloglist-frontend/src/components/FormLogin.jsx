import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container 
} from '@mui/material';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h2" sx={{ marginBottom: 3 }}>
          Log in to application
        </Typography>
        
        <form onSubmit={onSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth 
            size="large"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;