import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
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

  const handleQuizComplete = useCallback(() => {
    setQuizCompleted(true);
    const attempt = {
      date: new Date(),
      quizType,
      score,
      totalQuestions: quizType === 'multiple' ? multipleChoiceQuestions.length : integerQuestions.length,
      answers
    };
    saveQuizAttempt(attempt);
  }, [quizType, score, answers]);

  const handleTimeUp = useCallback(() => {
    if (!quizCompleted) {
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
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
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
      handleQuizComplete();
    }
  };

  const handleRestartQuiz = () => {
    setQuizType(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeRemaining(30);
    setQuizCompleted(false);
  };

  if (!quizType) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Choose Quiz Type
          </Typography>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                borderBottom: '2px solid #1976d2',
                pb: 1,
                mb: 2
              }}
            >
              Instructions:
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
              <Typography component="div" sx={{ mb: 2 }}>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>
                    For multiple-choice questions, select the one best answer (A, B, C, or D).
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    For integer-type questions, write your numerical answer clearly.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    No calculators unless specified.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    You have 30 minutes to complete this quiz.
                  </li>
                </ol>
              </Typography>
            </Box>
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
            Percentage: {((score / totalQuestions) * 100).toFixed(1)}%
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
        {quizType === 'multiple' ? (
          <MultipleChoiceQuiz
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswer={handleAnswer}
            timeRemaining={timeRemaining}
          />
        ) : (
          <IntegerQuiz
            question={currentQuestion.question}
            onAnswer={handleAnswer}
            timeRemaining={timeRemaining}
          />
        )}
      </Box>
    </Container>
  );
};

export default QuizPage;
