import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { getQuizAttempts, clearQuizHistory } from '../hooks/useIndexedDB';

const HistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAttempts = async () => {
    try {
      setIsLoading(true);
      const quizAttempts = await getQuizAttempts();
      
      console.log('Raw attempts before processing:', 
        quizAttempts.map(a => ({
          score: a.score,
          total: a.totalQuestions,
          percentage: a.percentage
        }))
      );

      const sortedAttempts = quizAttempts.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setAttempts(sortedAttempts);
      setError(null);
    } catch (err) {
      setError('Failed to load quiz history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttempts();
  }, []);

  const handleClearHistory = async () => {
    try {
      await clearQuizHistory();
      setAttempts([]);
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      setError('Failed to clear quiz history');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Quiz History</Typography>
        {attempts.length > 0 && (
          <Button variant="outlined" color="error" onClick={() => setOpenDialog(true)}>
            Clear History
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : attempts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No quiz attempts yet</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Quiz Type</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Total Questions</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts.map((attempt, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(attempt.date).toLocaleString()}</TableCell>
                  <TableCell>{attempt.quizType === 'multiple' ? 'Multiple Choice' : 'Integer'}</TableCell>
                  <TableCell align="right">{attempt.score}</TableCell>
                  <TableCell align="right">{attempt.totalQuestions}</TableCell>
                  <TableCell align="right">{attempt.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Clear Quiz History</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear all quiz history? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleClearHistory} color="error" variant="contained">Clear History</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryPage;
