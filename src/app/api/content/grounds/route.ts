import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Mock learning grounds data
const LEARNING_GROUNDS = [
  {
    id: 'python-fundamentals',
    title: 'Python Programming Fundamentals',
    description: 'Master the basics of Python programming with hands-on exercises and real-world examples.',
    difficulty: 'Beginner',
    contentCount: 15,
    estimatedHours: 20,
    prerequisites: [],
    tags: ['python', 'programming', 'basics'],
  },
  {
    id: 'data-science-ml',
    title: 'Data Science & Machine Learning',
    description: 'Learn data analysis, statistical methods, and machine learning algorithms from scratch.',
    difficulty: 'Intermediate',
    contentCount: 25,
    estimatedHours: 40,
    prerequisites: ['python-fundamentals'],
    tags: ['data-science', 'machine-learning', 'statistics'],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning & Neural Networks',
    description: 'Explore advanced neural network architectures and deep learning techniques.',
    difficulty: 'Advanced',
    contentCount: 20,
    estimatedHours: 35,
    prerequisites: ['data-science-ml'],
    tags: ['deep-learning', 'neural-networks', 'ai'],
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    description: 'Build computer vision applications using convolutional neural networks and image processing.',
    difficulty: 'Advanced',
    contentCount: 18,
    estimatedHours: 30,
    prerequisites: ['deep-learning'],
    tags: ['computer-vision', 'cnn', 'image-processing'],
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    description: 'Learn to process and understand human language with transformers and language models.',
    difficulty: 'Advanced',
    contentCount: 16,
    estimatedHours: 28,
    prerequisites: ['deep-learning'],
    tags: ['nlp', 'transformers', 'language-models'],
  },
];

// GET: Fetch all learning grounds
export async function GET(request: Request) {
  try {
    // In a real implementation, you might fetch this from the database
    // For now, return the mock data
    return NextResponse.json(LEARNING_GROUNDS);
  } catch (error) {
    console.error('Failed to fetch grounds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}