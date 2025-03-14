import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <SecurityIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized; 