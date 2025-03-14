import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface Vulnerability {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Open' | 'Fixed' | 'In Progress';
  dateIdentified: string;
  recommendation: string;
}

const SecurityAudit: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<Vulnerability | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const vulnerabilities: Vulnerability[] = [
    {
      id: 'VUL-001',
      severity: 'High',
      description: 'Weak password policy implementation',
      status: 'In Progress',
      dateIdentified: '2024-03-14',
      recommendation:
        'Implement stronger password requirements including minimum length, special characters, and regular password rotation.',
    },
    {
      id: 'VUL-002',
      severity: 'Medium',
      description: 'Missing rate limiting on authentication endpoints',
      status: 'Open',
      dateIdentified: '2024-03-13',
      recommendation:
        'Implement rate limiting to prevent brute force attacks on login endpoints.',
    },
    {
      id: 'VUL-003',
      severity: 'Low',
      description: 'Outdated SSL certificate',
      status: 'Fixed',
      dateIdentified: '2024-03-12',
      recommendation: 'Update SSL certificate to latest version.',
    },
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'error';
      case 'In Progress':
        return 'warning';
      case 'Fixed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          Security Audit
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleStartScan}
          disabled={isScanning}
        >
          Start New Scan
        </Button>
      </Box>

      {isScanning && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="info">Security scan in progress...</Alert>
          <LinearProgress
            variant="determinate"
            value={scanProgress}
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Identified</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vulnerabilities.map((vulnerability) => (
              <TableRow key={vulnerability.id}>
                <TableCell>{vulnerability.id}</TableCell>
                <TableCell>
                  <Chip
                    label={vulnerability.severity}
                    color={getSeverityColor(vulnerability.severity) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{vulnerability.description}</TableCell>
                <TableCell>
                  <Chip
                    label={vulnerability.status}
                    color={getStatusColor(vulnerability.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{vulnerability.dateIdentified}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedVulnerability(vulnerability)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selectedVulnerability}
        onClose={() => setSelectedVulnerability(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Vulnerability Details</DialogTitle>
        <DialogContent>
          {selectedVulnerability && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedVulnerability.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {selectedVulnerability.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Severity:</strong>{' '}
                <Chip
                  label={selectedVulnerability.severity}
                  color={getSeverityColor(selectedVulnerability.severity) as any}
                  size="small"
                />
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong>{' '}
                <Chip
                  label={selectedVulnerability.status}
                  color={getStatusColor(selectedVulnerability.status) as any}
                  size="small"
                />
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date Identified:</strong>{' '}
                {selectedVulnerability.dateIdentified}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Recommendation:</strong>
              </Typography>
              <Typography variant="body1">
                {selectedVulnerability.recommendation}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVulnerability(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityAudit; 