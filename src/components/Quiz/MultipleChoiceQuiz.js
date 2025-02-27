import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Button,
  Box,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const MultipleChoiceQuiz = ({ 
  question, 
  options, 
  onAnswer, 
  timeRemaining,
  correctAnswer 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (event) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    // Convert selected to number for comparison
    const isAnswerCorrect = parseInt(selected) === correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(parseInt(selectedOption)); 
      setShowFeedback(false);
      setSelectedOption(null);
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

        <RadioGroup 
          value={selectedOption} 
          onChange={handleOptionSelect}
        >
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={index.toString()}
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option}
                  {showFeedback && selectedOption === index.toString() && (
                    parseInt(selectedOption) === correctAnswer ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )
                  )}
                </Box>
              }
              sx={{
                ...(showFeedback && index === correctAnswer && {
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: 1,
                }),
                ...(showFeedback && parseInt(selectedOption) === index && index !== correctAnswer && {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  borderRadius: 1,
                })
              }}
            />
          ))}
        </RadioGroup>

        {showFeedback && (
          <Alert 
            severity={isCorrect ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {isCorrect 
              ? "Correct! Well done!" 
              : `Incorrect. The correct answer is ${options[correctAnswer]}`
            }
          </Alert>
        )}

        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          disabled={selectedOption === null}
          sx={{ marginTop: 2 }}
        >
          Next Question
        </Button>
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceQuiz;
