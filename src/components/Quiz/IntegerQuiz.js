import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

const IntegerQuiz = ({ 
  question, 
  onAnswer, 
  timeRemaining, 
  isAnswered,
  correctAnswer 
}) => {
  const [answer, setAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerChange = (event) => {
    const value = event.target.value;
    setAnswer(value);
    if (value !== '') {
      const isAnswerCorrect = parseInt(value) === correctAnswer;
      setIsCorrect(isAnswerCorrect);
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }
  };

  const handleSubmit = () => {
    if (answer !== '') {
      onAnswer(parseInt(answer));
      setShowFeedback(false);
      setAnswer('');
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {question}
        </Typography>
        
        <Typography color="textSecondary" gutterBottom>
          Time remaining: {timeRemaining} seconds
        </Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            type="number"
            label="Your answer"
            value={answer}
            onChange={handleAnswerChange}
            disabled={isAnswered}
            fullWidth
            sx={{
              ...(showFeedback && isCorrect && {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'success.main',
                  },
                },
              }),
              ...(showFeedback && !isCorrect && {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'error.main',
                  },
                },
              }),
            }}
          />
        </Box>

        {showFeedback && (
          <Alert 
            severity={isCorrect ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {isCorrect 
              ? "Correct! Well done!" 
              : `Incorrect. The correct answer is ${correctAnswer}`
            }
          </Alert>
        )}

        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          disabled={answer === '' || isAnswered}
          sx={{ marginTop: 2 }}
        >
          Next Question
        </Button>
      </CardContent>
    </Card>
  );
};

export default IntegerQuiz;