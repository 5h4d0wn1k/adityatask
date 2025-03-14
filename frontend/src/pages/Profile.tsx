import React, { useState } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface FormValues {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name should be of minimum 2 characters length')
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  currentPassword: yup.string().min(8, 'Password should be of minimum 8 characters length'),
  newPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
      try {
        setError('');
        setSuccess('');
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSuccess('Profile updated successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleTwoFactorToggle = async () => {
    try {
      setError('');
      setSuccess('');
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(
        `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update 2FA settings');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Full Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Change Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.currentPassword &&
                      Boolean(formik.errors.currentPassword)
                    }
                    helperText={
                      formik.touched.currentPassword && formik.errors.currentPassword
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.newPassword && Boolean(formik.errors.newPassword)
                    }
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    value={formik.values.confirmNewPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.confirmNewPassword &&
                      Boolean(formik.errors.confirmNewPassword)
                    }
                    helperText={
                      formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword
                    }
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={twoFactorEnabled}
                  onChange={handleTwoFactorToggle}
                  color="primary"
                />
              }
              label="Two-Factor Authentication"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enable two-factor authentication for enhanced account security.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Login Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last login: March 15, 2024, 10:30 AM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              IP Address: 192.168.1.1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browser: Chrome on Windows
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 