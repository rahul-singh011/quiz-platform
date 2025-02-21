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

  const handleQuizComplete = useCallback((finalScore, finalAnswers) => {
    setQuizCompleted(true);
    const totalQuestions = quizType === 'multiple' ? multipleChoiceQuestions.length : integerQuestions.length;
    
    const percentage = ((finalScore / totalQuestions) * 100).toFixed(1);

    const attempt = {
      date: new Date(),
      quizType,
      score: finalScore,
      totalQuestions,
      percentage: Number(percentage),
      answers: finalAnswers
    };

    console.log('Saving final attempt:', {
      score: finalScore,
      totalQuestions,
      percentage,
      answers: finalAnswers.map(a => a.isCorrect)
    });

    saveQuizAttempt(attempt);
  }, [quizType]);

  const handleTimeUp = useCallback(() => {
    if (!quizCompleted && timeRemaining > 0) {
      const questions = quizType === 'multiple' ? multipleChoiceQuestions : integerQuestions;
      const currentQuestion = questions[currentQuestionIndex];
      
      setAnswers(prev => [...prev, {
        question: currentQuestion.question,
        userAnswer: null,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        timeTaken: timeRemaining
      }]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeRemaining(30);
      } else {
        handleQuizComplete(score, answers);
      }
    }
  }, [currentQuestionIndex, quizCompleted, quizType, handleQuizComplete, timeRemaining, score, answers]);

  const handleAnswer = (answer) => {
    const questions = quizType === 'multiple' ? multipleChoiceQuestions : integerQuestions;
    const currentQuestion = questions[currentQuestionIndex];
    
    const isCorrect = quizType === 'multiple' 
      ? String(answer) === String(currentQuestion.correctAnswer)
      : Number(answer) === Number(currentQuestion.correctAnswer);

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    const newAnswer = {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken: 30 - timeRemaining
    };

    setAnswers(prev => [...prev, newAnswer]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(30);
    } else {
      Promise.resolve().then(() => {
        const finalScore = isCorrect ? score + 1 : score;
        handleQuizComplete(finalScore, [...answers, newAnswer]);
      });
    }
  };

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
