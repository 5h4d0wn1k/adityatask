import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface SecurityMetric {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const securityMetrics: SecurityMetric[] = [
    {
      title: 'Security Score',
      value: 85,
      icon: <SecurityIcon />,
      color: '#2196f3',
    },
    {
      title: 'Password Strength',
      value: 90,
      icon: <LockIcon />,
      color: '#4caf50',
    },
    {
      title: 'Vulnerabilities',
      value: 20,
      icon: <WarningIcon />,
      color: '#f44336',
    },
    {
      title: 'Security Checks',
      value: 95,
      icon: <CheckCircleIcon />,
      color: '#9c27b0',
    },
  ];

  const recentEvents = [
    {
      title: 'Login from new device',
      description: 'Windows PC - Chrome Browser',
      time: '2 hours ago',
      icon: <InfoIcon color="info" />,
    },
    {
      title: 'Password changed',
      description: 'Security update successful',
      time: '1 day ago',
      icon: <LockIcon color="success" />,
    },
    {
      title: 'Security scan completed',
      description: 'No critical issues found',
      time: '2 days ago',
      icon: <SecurityIcon color="primary" />,
    },
  ];

  const securityRecommendations = [
    'Enable two-factor authentication for enhanced security',
    'Update your password regularly',
    'Review recent login activity',
    'Complete security awareness training',
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {securityMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${metric.color}20`,
                    borderRadius: '50%',
                    p: 1,
                    mr: 1,
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography variant="h6" component="div">
                  {metric.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {metric.value}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metric.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: `${metric.color}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Security Events
              </Typography>
              <List>
                {recentEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>{event.icon}</ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <>
                            {event.description}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              <ScheduleIcon
                                sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}
                              />
                              {event.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Recommendations
              </Typography>
              <List>
                {securityRecommendations.map((recommendation, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                    {index < securityRecommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 