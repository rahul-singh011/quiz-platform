import React, { useEffect } from 'react';
import { LinearProgress, Box } from '@mui/material';

const Timer = ({ timeLimit, timeRemaining, onTimeUp }) => {
  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <Box sx={{ width: '100%', marginBottom: 2 }}>
      <LinearProgress 
        variant="determinate" 
        value={(timeRemaining / timeLimit) * 100} 
      />
    </Box>
  );
};

export default Timer;