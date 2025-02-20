import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Button,
  TextField,
  Box
} from '@mui/material';

const QuizQuestion = ({ 
  question, 
  options, 
  onAnswer, 
  timeRemaining, 
  isAnswered,
  type 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [integerAnswer, setIntegerAnswer] = useState('');

  const handleOptionSelect = (event) => {
    setSelectedOption(parseInt(event.target.value));
  };

  const handleIntegerChange = (event) => {
    setIntegerAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (type === 'multiple-choice' && selectedOption !== null) {
      onAnswer(selectedOption);
    } else if (type === 'integer' && integerAnswer !== '') {
      onAnswer(parseInt(integerAnswer));
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

        {type === 'multiple-choice' ? (
          <RadioGroup value={selectedOption} onChange={handleOptionSelect}>
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio />}
                label={option}
                disabled={isAnswered}
              />
            ))}
          </RadioGroup>
        ) : (
          <Box sx={{ mt: 2 }}>
            <TextField
              type="number"
              label="Your answer"
              value={integerAnswer}
              onChange={handleIntegerChange}
              disabled={isAnswered}
              fullWidth
            />
          </Box>
        )}

        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          disabled={
            (type === 'multiple-choice' && selectedOption === null) || 
            (type === 'integer' && integerAnswer === '') || 
            isAnswered
          }
          sx={{ marginTop: 2 }}
        >
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;