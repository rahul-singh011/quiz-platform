import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Icon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TimerIcon from '@mui/icons-material/Timer';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LoopIcon from '@mui/icons-material/Loop';

const FeatureCard = ({ icon, title, description }) => (
  <Card 
    sx={{ 
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 8,
      }
    }}
  >
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Icon component={icon} sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TimerIcon,
      title: "Timed Questions",
      description: "Challenge yourself with time-limited questions to test your quick thinking"
    },
    {
      icon: FeedbackIcon,
      title: "Instant Feedback",
      description: "Get immediate results and learn from your answers"
    },
    {
      icon: ShowChartIcon,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed performance statistics"
    },
    {
      icon: LoopIcon,
      title: "Multiple Attempts",
      description: "Practice makes perfect - take the quiz as many times as you want"
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        pt: 8
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center',
            p: 6,
            mb: 6,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 4,
              animation: 'fadeIn 1s ease-in'
            }}
          >
            Welcome to Quiz Platform
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
          >
            Test your knowledge with our interactive quiz! Challenge yourself and learn something new.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/quiz')}
            sx={{ 
              py: 2, 
              px: 4, 
              fontSize: '1.2rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Start Quiz Now
          </Button>
        </Paper>

        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            fontWeight: 'bold'
          }}
        >
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>

        <Box 
          sx={{ 
            textAlign: 'center',
            mt: 'auto',
            pb: 6
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ready to Challenge Yourself?
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/quiz')}
            sx={{ 
              mt: 2,
              px: 4,
              py: 1.5
            }}
          >
            Take Quiz Now
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;