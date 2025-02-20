import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import MultipleChoiceQuiz from "../components/Quiz/MultipleChoiceQuiz";
import IntegerQuiz from "../components/Quiz/IntegerQuiz";
import { multipleChoiceQuestions, integerQuestions } from "../data/quizData";
import { saveQuizAttempt } from "../hooks/useIndexedDB";

const QuizPage = () => {
  const [quizType, setQuizType] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (!quizCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
  }, [timeRemaining, quizCompleted]);

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion =
      quizType === "multiple"
        ? multipleChoiceQuestions[currentQuestionIndex]
        : integerQuestions[currentQuestionIndex];

    const isCorrect =
      quizType === "multiple"
        ? selectedAnswer === currentQuestion.correctAnswer
        : parseInt(selectedAnswer) === currentQuestion.correctAnswer;

    setAnswers([
      ...answers,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    const questions =
      quizType === "multiple" ? multipleChoiceQuestions : integerQuestions;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(30);
    } else {
      handleQuizComplete();
    }
  };

  const handleTimeUp = () => {
    const questions =
      quizType === "multiple" ? multipleChoiceQuestions : integerQuestions;

    if (currentQuestionIndex < questions.length - 1) {
      setAnswers([
        ...answers,
        {
          questionIndex: currentQuestionIndex,
          selectedAnswer: null,
          isCorrect: false,
        },
      ]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(30);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    saveQuizAttempt({
      date: new Date(),
      quizType,
      score,
      totalQuestions:
        quizType === "multiple"
          ? multipleChoiceQuestions.length
          : integerQuestions.length,
      answers,
    });
  };

  const restartQuiz = () => {
    setQuizType(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeRemaining(30);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const totalQuestions =
      quizType === "multiple"
        ? multipleChoiceQuestions.length
        : integerQuestions.length;

    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Quiz Completed!
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your Score: {score}/{totalQuestions}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Percentage: {Math.round((score / totalQuestions) * 100)}%
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={restartQuiz}
            sx={{ mt: 2 }}
          >
            Try Another Quiz
          </Button>
        </Box>
      </Container>
    );
  }


  if (!quizType) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Choose Quiz Type
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: "#f8f9fa",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "primary.main",
                borderBottom: "2px solid #1976d2",
                pb: 1,
                mb: 2,
              }}
            >
              Instructions:
            </Typography>
            <Box sx={{ textAlign: "left" }}>
              <Typography component="div" sx={{ mb: 2 }}>
                <ol style={{ margin: 0, paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>
                    For multiple-choice questions, select the one best answer
                    (A, B, C, or D).
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    For integer-type questions, write your numerical answer
                    clearly.
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    No calculators unless specified.
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    You have 30 minutes to complete this quiz.
                  </li>
                </ol>
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setQuizType("multiple")}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Multiple Choice Quiz
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setQuizType("integer")}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                backgroundColor: "#9c27b0",
                "&:hover": {
                  backgroundColor: "#7b1fa2",
                },
              }}
            >
              Integer Quiz
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  const currentQuestion =
    quizType === "multiple"
      ? multipleChoiceQuestions[currentQuestionIndex]
      : integerQuestions[currentQuestionIndex];

  const questions =
    quizType === "multiple" ? multipleChoiceQuestions : integerQuestions;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>

        {quizType === "multiple" ? (
          <MultipleChoiceQuiz
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswer={handleAnswer}
            timeRemaining={timeRemaining}
            isAnswered={false}
            correctAnswer={currentQuestion.correctAnswer}
          />
        ) : (
          <IntegerQuiz
            question={currentQuestion.question}
            onAnswer={handleAnswer}
            timeRemaining={timeRemaining}
            isAnswered={false}
            correctAnswer={currentQuestion.correctAnswer} 
          />
        )}
      </Box>
    </Container>
  );
};

export default QuizPage;
