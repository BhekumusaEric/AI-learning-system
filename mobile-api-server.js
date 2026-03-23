const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Mock JWT secret
const JWT_SECRET = 'mobile-app-secret-key';

// Mock data
const LEARNING_GROUNDS = [
  {
    id: 'python-fundamentals',
    title: 'Python Programming Fundamentals',
    description: 'Master the basics of Python programming with hands-on exercises.',
    emoji: '🐍',
    difficulty: 'Beginner',
    contentCount: 15,
    estimatedHours: 20,
  },
  {
    id: 'data-science-ml',
    title: 'Data Science & Machine Learning',
    description: 'Learn data analysis and machine learning algorithms.',
    emoji: '📊',
    difficulty: 'Intermediate',
    contentCount: 25,
    estimatedHours: 40,
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning & Neural Networks',
    description: 'Explore neural network architectures and deep learning.',
    emoji: '🧠',
    difficulty: 'Advanced',
    contentCount: 20,
    estimatedHours: 35,
  },
];

const CONTENT_ITEMS = {
  'python-intro': {
    id: 'python-intro',
    title: 'Introduction to Python',
    description: 'Learn Python basics and syntax.',
    type: 'text',
    difficulty: 'Beginner',
    estimatedTime: 15,
    content: `# Welcome to Python!

Python is an amazing programming language. Here's what you'll learn:

## Basic Syntax
\`\`\`python
print("Hello, World!")
name = "Student"
print(f"Hello, {name}!")
\`\`\`

Keep learning and you'll master Python in no time!`,
    groundId: 'python-fundamentals',
  },
  'python-variables': {
    id: 'python-variables',
    title: 'Variables and Data Types',
    description: 'Understanding variables and types.',
    type: 'code',
    difficulty: 'Beginner',
    estimatedTime: 20,
    content: `# Variables Practice

\`\`\`python
# Create your variables here
name = "Your Name"
age = 25
height = 5.9
is_student = True

print(f"Name: {name}, Age: {age}")
\`\`\``,
    groundId: 'python-fundamentals',
  },
};

// API Routes

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple mock authentication
  if (email && password && password.length >= 6) {
    const user = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user,
      token,
      refreshToken: 'refresh_' + token,
      expiresIn: 7 * 24 * 60 * 60,
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Content routes
app.get('/api/content/grounds', (req, res) => {
  res.json(LEARNING_GROUNDS);
});

app.get('/api/content/ground/:groundId', (req, res) => {
  const { groundId } = req.params;

  // Mock content for each ground
  const groundContent = {
    'python-fundamentals': [
      {
        id: 'python-intro',
        title: 'Introduction to Python',
        description: 'Learn Python basics and syntax.',
        type: 'text',
        difficulty: 'Beginner',
        estimatedTime: 15,
      },
      {
        id: 'python-variables',
        title: 'Variables and Data Types',
        description: 'Understanding variables and types.',
        type: 'code',
        difficulty: 'Beginner',
        estimatedTime: 20,
      },
    ],
    'data-science-ml': [
      {
        id: 'numpy-intro',
        title: 'NumPy Fundamentals',
        description: 'Learn NumPy for numerical computing.',
        type: 'code',
        difficulty: 'Intermediate',
        estimatedTime: 30,
      },
    ],
  };

  res.json(groundContent[groundId] || []);
});

app.get('/api/content/item/:contentId', (req, res) => {
  const { contentId } = req.params;
  const content = CONTENT_ITEMS[contentId];

  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ error: 'Content not found' });
  }
});

// Progress routes
app.get('/api/progress', (req, res) => {
  // Mock progress data
  res.json([
    {
      contentId: 'python-intro',
      status: 'completed',
      progressPercentage: 100,
      timeSpent: 900, // 15 minutes
      completedAt: new Date().toISOString(),
    },
  ]);
});

app.post('/api/progress', (req, res) => {
  const { contentId, progressPercentage, timeSpent, status } = req.body;

  // Mock progress update
  res.json({
    contentId,
    status: status || 'in_progress',
    progressPercentage: progressPercentage || 0,
    timeSpent: timeSpent || 0,
    updatedAt: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mobile App API Server running on http://localhost:${PORT}`);
  console.log('📱 Ready for mobile app connections!');
  console.log('\n📋 Available endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/content/grounds');
  console.log('  GET  /api/content/ground/:groundId');
  console.log('  GET  /api/content/item/:contentId');
  console.log('  GET  /api/progress');
  console.log('  POST /api/progress');
});