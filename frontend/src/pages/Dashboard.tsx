import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography component="h1" variant="h4">
              Welcome, {user?.name}
            </Typography>
            <Box>
              {user?.role === 'admin' && (
                <Button
                  startIcon={<AdminPanelSettingsIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleAdminPanel}
                  sx={{ mr: 2 }}
                >
                  Admin Panel
                </Button>
              )}
              <Button
                startIcon={<ExitToAppIcon />}
                variant="outlined"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">User Information</Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {user?.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Role:</strong> {user?.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <SecurityIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Security Information</Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    Your session is secure and encrypted. All communications are
                    protected using HTTPS.
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    For security reasons, your session will automatically expire
                    after a period of inactivity.
                  </Typography>
                  <Typography variant="body1">
                    If you notice any suspicious activity, please contact the
                    administrator immediately.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 