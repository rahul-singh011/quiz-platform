import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, Paper, LinearProgress } from '@mui/material';
import MultipleChoiceQuiz from '../components/Quiz/MultipleChoiceQuiz';
import IntegerQuiz from '../components/Quiz/IntegerQuiz';
import { multipleChoiceQuestions, integerQuestions } from '../data/quizData';
import { saveQuizAttempt } from '../hooks/useIndexedDB';

const QuizPage = () => {
  const [quizType, setQuizType] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(true);

  const handleQuizComplete = useCallback(() => {
    // Update score first, then save the attempt
    setScore(currentScore => {
      const totalQuestions = quizType === 'multiple' ? multipleChoiceQuestions.length : integerQuestions.length;
      
      const attempt = {
        date: new Date(),
        quizType,
        score: currentScore,
        totalQuestions,
        percentage: ((currentScore / totalQuestions) * 100).toFixed(1),
        answers
      };

      console.log('Saving final attempt:', {
        finalScore: currentScore,
        totalQuestions,
        calculatedPercentage: ((currentScore / totalQuestions) * 100).toFixed(1)
      });

      setQuizCompleted(true);
      
      saveQuizAttempt(attempt);
      
      return currentScore;
    });
  }, [quizType, answers]);

  const handleTimeUp = useCallback(() => {
    if (!quizCompleted && timeRemaining > 0) {
      const questions = quizType === 'multiple' ? multipleChoiceQuestions : integerQuestions;
      const currentQuestion = questions[currentQuestionIndex];
      
      setAnswers(prev => [...prev, {
        question: currentQuestion.question,
        userAnswer: null,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        timeTaken: 30
      }]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeRemaining(30);
      } else {
        handleQuizComplete();
      }
    }
  }, [currentQuestionIndex, quizCompleted, quizType, handleQuizComplete]);

  useEffect(() => {
    if (!quizCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
  }, [timeRemaining, quizCompleted, handleTimeUp]);

  const handleAnswer = (answer) => {
    const questions = quizType === 'multiple' ? multipleChoiceQuestions : integerQuestions;
    const currentQuestion = questions[currentQuestionIndex];
    
    const isCorrect = quizType === 'multiple' 
      ? String(answer) === String(currentQuestion.correctAnswer)
      : Number(answer) === Number(currentQuestion.correctAnswer);

    console.log('Answer check:', {
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    });

    if (isCorrect) {
      setScore(prevScore => {
        const newScore = prevScore + 1;
        console.log('Updating score:', newScore);
        return newScore;
      });
    }

    setAnswers(prev => [...prev, {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken: 30 - timeRemaining
    }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(30);
    } else {
      setTimeout(() => handleQuizComplete(), 0);
    }
  };

  const handleRestartQuiz = () => {
    setQuizType(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeRemaining(30);
    setQuizCompleted(false);
    setIsCorrect(true);
  };

  if (!quizType) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Choose Quiz Type
          </Typography>
          
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Instructions:
            </Typography>
            <Typography component="div">
              <ol>
                <li>Select your preferred quiz type</li>
                <li>Each question has a 30-second time limit</li>
                <li>You'll get immediate feedback on your answers</li>
                <li>Your progress will be saved automatically</li>
              </ol>
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => setQuizType('multiple')}
              sx={{ py: 2 }}
            >
              Multiple Choice Quiz
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => setQuizType('integer')}
              sx={{ py: 2 }}
            >
              Integer Quiz
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (quizCompleted) {
    const totalQuestions = quizType === 'multiple' ? 
      multipleChoiceQuestions.length : integerQuestions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(1);
    
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Quiz Completed!
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your Score: {score} out of {totalQuestions}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Percentage: {percentage}%
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleRestartQuiz}
            sx={{ mt: 2 }}
          >
            Take Another Quiz
          </Button>
        </Box>
      </Container>
    );
  }

  const questions = quizType === 'multiple' ? multipleChoiceQuestions : integerQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Time Remaining: {timeRemaining} seconds
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(timeRemaining / 30) * 100} 
            sx={{ mt: 1 }}
          />
        </Box>

        {quizType === 'multiple' ? (
          <MultipleChoiceQuiz
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswer={handleAnswer}
            timeRemaining={timeRemaining}
            correctAnswer={currentQuestion.correctAnswer}
          />
        ) : (
          <IntegerQuiz
            question={currentQuestion.question}
            onAnswer={handleAnswer}
            timeRemaining={timeRemaining}
            correctAnswer={currentQuestion.correctAnswer}
          />
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={handleRestartQuiz}
          >
            Quit Quiz
          </Button>
          <Typography variant="h6">
            Score: {score}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default QuizPage;
